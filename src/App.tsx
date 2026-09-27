import { HeroPanel } from "./components/HeroPanel";
import { InstallGuide } from "./components/InstallGuide";
import { LauncherDownloadCard } from "./components/LauncherDownloadCard";
import { ServerStatusCard } from "./components/ServerStatusCard";
import { ServerTelemetry } from "./components/ServerTelemetry";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { TransmissionList } from "./components/TransmissionList";
import { marsConfig } from "./config/mars";
import { useServerStatus } from "./hooks/useServerStatus";

function App() {
	const { status, isChecking, lastUpdated, refresh } = useServerStatus();
	const online = status?.online ?? null;

	return (
		<div className="site-shell">
			<div className="ambient-grid" aria-hidden="true" />
			<div className="content-wrap mx-auto">
				<SiteHeader
					online={online}
					checking={isChecking}
				/>
				<main>
					<HeroPanel
						online={online}
						checking={isChecking}
					/>
					{marsConfig.useMockStatus && (
						<p
							className="mock-notice"
							role="status"
						>
							SIMULATED TELEMETRY //
							DEVELOPMENT ONLY
						</p>
					)}

					<div className="system-grid">
						<ServerStatusCard
							status={status}
							checking={isChecking}
							lastUpdated={
								lastUpdated
							}
							onRefresh={refresh}
						/>
						<ServerTelemetry
							status={status}
							checking={isChecking}
							lastUpdated={
								lastUpdated
							}
						/>
					</div>

					<LauncherDownloadCard />

					<div className="lower-grid">
						<TransmissionList />
						<InstallGuide />
					</div>
				</main>
				<SiteFooter />
			</div>
		</div>
	);
}

export default App;
