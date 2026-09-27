import { describe, expect, it } from "vitest";
import {
	McStatusIoServerStatusProvider,
	getPersonnelMessage,
	MockServerStatusProvider,
	parseMcStatusIoResponse,
} from "./serverStatus";

describe("getPersonnelMessage", () => {
	it("covers mock online counts, offline state, and checking state", async () => {
		expect(getPersonnelMessage(null, true)).toBe(
			"Establishing contact with the colony. Please remain calm",
		);

		const scenarios = [
			{
				values: { online: false },
				expected: "Mission control has lost contact with the colony",
			},
			{
				values: { playersOnline: 0 },
				expected: "No personnel detected. The moon remains observant",
			},
			{
				values: { playersOnline: 1 },
				expected: "One personnel unit is operating without supervision",
			},
			{
				values: { playersOnline: 3 },
				expected: "Small expedition underway. Risk level: acceptable-ish",
			},
			{
				values: { playersOnline: 6 },
				expected: "Multiple personnel units detected. Safety paperwork pending",
			},
			{
				values: { playersOnline: 7 },
				expected: "Population density exceeds Mars Command recommendations",
			},
			{
				values: { playersOnline: null },
				expected: "Personnel count unavailable. The moon remains observant",
			},
		] as const;

		for (const scenario of scenarios) {
			const status = await new MockServerStatusProvider(
				scenario.values,
			).getStatus();
			expect(getPersonnelMessage(status, false)).toBe(
				scenario.expected,
			);
		}
	});
});

describe("parseMcStatusIoResponse", () => {
	it("fills missing optional telemetry with safe null values", () => {
		const parsed = parseMcStatusIoResponse({
			online: true,
			host: "play.nexusgit.info",
			port: 25565,
			players: { online: 0, max: 67 },
			version: { name_clean: "1.21.1" },
			motd: { clean: "The moon has been informed." },
			retrieved_at: 1790537299095,
		});

		expect(parsed?.playersOnline).toBe(0);
		expect(parsed?.playersMax).toBe(67);
		expect(parsed?.latencyMs).toBeNull();
		expect(parsed?.motd).toBe("The moon has been informed.");
		expect(parsed?.versionName).toBe("1.21.1");
		expect(parsed?.checkedAt).toBe(
			new Date(1790537299095).toISOString(),
		);
	});

	it.each([
		null,
		[],
		{ online: "yes", host: "mars", port: 25565 },
		{ online: true, host: "", port: 25565 },
		{ online: true, host: "mars", port: 70000 },
	])("rejects malformed payload %j", (payload) => {
		expect(parseMcStatusIoResponse(payload)).toBeNull();
	});

	it("renders invalid optional counts as unavailable", () => {
		const parsed = parseMcStatusIoResponse({
			online: true,
			host: "mars",
			port: 25565,
			players: { online: -1, max: Number.NaN },
		});

		expect(parsed?.playersOnline).toBeNull();
		expect(parsed?.playersMax).toBeNull();
	});

	it("maps an offline MCStatus.io result without treating it as an API error", () => {
		expect(
			parseMcStatusIoResponse({
				online: false,
				host: "play.nexusgit.info",
				port: 25565,
				players: { online: 0, max: 67 },
			}),
		).toMatchObject({ online: false, error: null });
	});
});

describe("status providers", () => {
	it("returns injected mock values with a fresh timestamp", async () => {
		const provider = new MockServerStatusProvider({
			playersOnline: 7,
			latencyMs: 42,
		});
		const result = await provider.getStatus();

		expect(result.online).toBe(true);
		expect(result.playersOnline).toBe(7);
		expect(result.latencyMs).toBe(42);
		expect(Number.isNaN(Date.parse(result.checkedAt))).toBe(false);
	});

	it("handles invalid JSON as an offline status without throwing", async () => {
		const provider = new McStatusIoServerStatusProvider(
			"https://api.mcstatus.io/v2/status/java",
			"play.nexusgit.info",
			async () => new Response("{broken", { status: 200 }),
		);
		const result = await provider.getStatus();

		expect(result.online).toBe(false);
		expect(result.error).toBe("MCStatus.io returned invalid JSON");
	});

	it("queries the encoded server address and maps real API fields", async () => {
		let requestedUrl = "";
		const provider = new McStatusIoServerStatusProvider(
			"https://api.mcstatus.io/v2/status/java/",
			"play.nexusgit.info:25566",
			async (input) => {
				requestedUrl = String(input);
				return Response.json({
					online: true,
					host: "play.nexusgit.info",
					port: 25566,
					players: { online: 2, max: 67 },
					version: { name_clean: "1.21.1" },
					motd: { clean: "Mars is listening." },
					retrieved_at: 1790537299095,
				});
			},
		);
		const result = await provider.getStatus();

		expect(requestedUrl).toBe(
			"https://api.mcstatus.io/v2/status/java/play.nexusgit.info%3A25566",
		);
		expect(result).toMatchObject({
			online: true,
			playersOnline: 2,
			playersMax: 67,
			versionName: "1.21.1",
			motd: "Mars is listening.",
			latencyMs: null,
		});
	});

	it("handles HTTP failures and request timeouts safely", async () => {
		const failedResponse = new McStatusIoServerStatusProvider(
			"https://api.mcstatus.io/v2/status/java",
			"play.nexusgit.info",
			async () => new Response("", { status: 503 }),
		);
		const timeoutResponse = new McStatusIoServerStatusProvider(
			"https://api.mcstatus.io/v2/status/java",
			"play.nexusgit.info",
			async () => {
				throw new DOMException("Aborted", "AbortError");
			},
		);

		await expect(failedResponse.getStatus()).resolves.toMatchObject(
			{
				online: false,
				error: "MCStatus.io returned HTTP 503",
			},
		);
		await expect(
			timeoutResponse.getStatus(),
		).resolves.toMatchObject({
			online: false,
			error: "Status request timed out",
		});
	});
});
