import { marsConfig } from "../config/mars";
import type { ServerStatus } from "../types/server";

type ServerTelemetryProps = {
	status: ServerStatus | null;
	checking: boolean;
	lastUpdated: string | null;
};

function displayCount(value: number | null | undefined): string {
	return value === null || value === undefined ? "—" : String(value);
}

function displayTime(value: string | null): string {
	if (!value || Number.isNaN(Date.parse(value))) return "AWAITING CHECK";
	return new Intl.DateTimeFormat(undefined, {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	}).format(new Date(value));
}

export function ServerTelemetry({
	status,
	checking,
	lastUpdated,
}: ServerTelemetryProps) {
	const rows = [
		["HOST", status?.host || marsConfig.serverAddress],
		["MINECRAFT", marsConfig.minecraftVersion],
		["LOADER", marsConfig.loader.toUpperCase()],
		["VOICE", marsConfig.voiceAddress],
		[
			"STATUS",
			checking
				? "CHECKING"
				: status?.online
					? "ONLINE"
					: "OFFLINE",
		],
		[
			"PERSONNEL",
			status?.playersOnline == null
				? "—"
				: `${displayCount(status.playersOnline)} / ${displayCount(status.playersMax)}`,
		],
		[
			"LATENCY",
			status?.latencyMs == null
				? "—"
				: `${Math.round(status.latencyMs)} ms`,
		],
		["LAST CHECK", displayTime(lastUpdated)],
	] as const;

	return (
		<section
			className="panel telemetry-panel"
			aria-labelledby="telemetry-heading"
		>
			<div className="panel-heading">
				<div>
					<p className="eyebrow">
						02 // READ-ONLY FEED
					</p>
					<h2 id="telemetry-heading">
						SERVER TELEMETRY
					</h2>
				</div>
				<span className="telemetry-mark">SYS</span>
			</div>
			<dl className="telemetry-list">
				{rows.map(([label, value]) => (
					<div
						className={`telemetry-row ${label === "STATUS" ? `telemetry-row--${value.toLowerCase()}` : ""}`}
						key={label}
					>
						<dt>{label}</dt>
						<dd>
							<span>::</span>
							{value}
						</dd>
					</div>
				))}
			</dl>
			<p className="telemetry-note">
				Only values returned by the public status feed
				are shown
			</p>
		</section>
	);
}
