import { marsConfig } from "../config/mars";
import type { ServerStatus } from "../types/server";

export interface ServerStatusProvider {
	getStatus(): Promise<ServerStatus>;
}

function offlineStatus(error: string): ServerStatus {
	return {
		online: false,
		host: marsConfig.serverAddress,
		port: 25565,
		playersOnline: null,
		playersMax: null,
		latencyMs: null,
		motd: null,
		versionName: null,
		checkedAt: new Date().toISOString(),
		error,
	};
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return (
		typeof value === "object" &&
		value !== null &&
		!Array.isArray(value)
	);
}

function isCount(value: unknown): value is number | null {
	return (
		value === null ||
		(typeof value === "number" &&
			Number.isInteger(value) &&
			value >= 0)
	);
}

function optionalCount(value: unknown): number | null {
	return isCount(value) ? value : null;
}

function optionalCleanText(value: unknown): string | null {
	if (!isRecord(value) || typeof value.clean !== "string") return null;
	return value.clean.trim() || null;
}

export function parseMcStatusIoResponse(value: unknown): ServerStatus | null {
	if (!isRecord(value)) return null;

	const { online, host, port } = value;
	if (
		typeof online !== "boolean" ||
		typeof host !== "string" ||
		host.trim().length === 0 ||
		typeof port !== "number" ||
		!Number.isInteger(port) ||
		port < 1 ||
		port > 65535
	) {
		return null;
	}

	const players = isRecord(value.players) ? value.players : null;
	const version = isRecord(value.version) ? value.version : null;
	const retrievedAt = value.retrieved_at;
	const retrievedDate =
		typeof retrievedAt === "number" && Number.isFinite(retrievedAt)
			? new Date(retrievedAt)
			: null;
	const checkedAt =
		retrievedDate && !Number.isNaN(retrievedDate.getTime())
			? retrievedDate.toISOString()
			: new Date().toISOString();

	return {
		online,
		host: host.trim(),
		port,
		playersOnline: optionalCount(players?.online),
		playersMax: optionalCount(players?.max),
		latencyMs: null,
		motd: optionalCleanText(value.motd),
		versionName:
			version && typeof version.name_clean === "string"
				? version.name_clean.trim() || null
				: null,
		checkedAt,
		error: null,
	};
}

export class McStatusIoServerStatusProvider implements ServerStatusProvider {
	private readonly apiUrl: string;
	private readonly serverAddress: string;
	private readonly request: typeof fetch;
	private readonly timeoutMs: number;

	constructor(
		apiUrl = marsConfig.statusApiUrl,
		serverAddress = marsConfig.serverAddress,
		request: typeof fetch = fetch,
		timeoutMs = 5000,
	) {
		this.apiUrl = apiUrl;
		this.serverAddress = serverAddress;
		this.request = request;
		this.timeoutMs = timeoutMs;
	}

	async getStatus(): Promise<ServerStatus> {
		const controller = new AbortController();
		const timeout = globalThis.setTimeout(
			() => controller.abort(),
			this.timeoutMs,
		);

		try {
			const endpoint = `${this.apiUrl.replace(/\/+$/, "")}/${encodeURIComponent(this.serverAddress)}`;
			const response = await this.request(endpoint);

			if (!response.ok)
				return offlineStatus(
					`MCStatus.io returned HTTP ${response.status}`,
				);

			let payload: unknown;
			try {
				payload = await response.json();
			} catch {
				return offlineStatus(
					"MCStatus.io returned invalid JSON",
				);
			}

			return (
				parseMcStatusIoResponse(payload) ??
				offlineStatus(
					"MCStatus.io returned incomplete or invalid data",
				)
			);
		} catch (error) {
			const message =
				error instanceof DOMException &&
				error.name === "AbortError"
					? "Status request timed out"
					: "Status endpoint could not be reached";
			return offlineStatus(message);
		} finally {
			globalThis.clearTimeout(timeout);
		}
	}
}

export class MockServerStatusProvider implements ServerStatusProvider {
	private readonly values: Partial<ServerStatus>;

	constructor(values: Partial<ServerStatus> = {}) {
		this.values = values;
	}

	async getStatus(): Promise<ServerStatus> {
		return {
			online: true,
			host: marsConfig.serverAddress,
			port: 25565,
			playersOnline: 0,
			playersMax: 67,
			latencyMs: 0,
			motd: "The moon has been informed.",
			versionName: `Minecraft ${marsConfig.minecraftVersion}`,
			checkedAt: new Date().toISOString(),
			error: null,
			...this.values,
		};
	}
}

export const serverStatusProvider: ServerStatusProvider =
	marsConfig.useMockStatus
		? new MockServerStatusProvider()
		: new McStatusIoServerStatusProvider();

export function getPersonnelMessage(
	status: ServerStatus | null,
	checking: boolean,
): string {
	if (checking)
		return "Establishing contact with the colony. Please remain calm";
	if (!status?.online)
		return "Mission control has lost contact with the colony";

	const players = status.playersOnline;
	if (players === null)
		return "Personnel count unavailable. The moon remains observant";
	if (players === 0)
		return "No personnel detected. The moon remains observant";
	if (players === 1)
		return "One personnel unit is operating without supervision";
	if (players <= 3)
		return "Small expedition underway. Risk level: acceptable-ish";
	if (players <= 6)
		return "Multiple personnel units detected. Safety paperwork pending";
	return "Population density exceeds Mars Command recommendations";
}
