import { ArrowDownToLine, ArrowUpRight, Rocket } from "lucide-react";
import { marsConfig } from "../config/mars";
import { pulseTarget } from "../utils/pulseTarget";

export function LauncherDownloadCard() {
	return (
		<section
			className="launcher-panel"
			id="launcher-panel"
			aria-labelledby="launcher-heading"
		>
			<div className="launcher-copy">
				<p className="eyebrow">
					<Rocket size={14} aria-hidden="true" />{" "}
					CLIENT DEPLOYMENT // PREVIEW CHANNEL
				</p>
				<h2 id="launcher-heading">
					MARS COMMAND CLIENT
				</h2>
				<p className="launcher-subtitle">
					Synchronised client transport for the
					Mars server
				</p>
				<p className="launcher-disclaimer">
					Client synchronisation is not available
					yet. This release channel is a preview
				</p>
				<div className="launcher-actions">
					{marsConfig.launcherDownloadUrl ? (
						<a
							className="button button-primary"
							href={
								marsConfig.launcherDownloadUrl
							}
							target="_blank"
							rel="noreferrer"
							onClick={() =>
								pulseTarget(
									"launcher-panel",
								)
							}
						>
							<ArrowDownToLine
								size={17}
								aria-hidden="true"
							/>{" "}
							DOWNLOAD LAUNCHER
						</a>
					) : (
						<button
							className="button button-primary"
							type="button"
							disabled
						>
							<ArrowDownToLine
								size={17}
								aria-hidden="true"
							/>{" "}
							LAUNCHER DOWNLOAD COMING
							SOON
						</button>
					)}
					<a
						className="button button-secondary"
						href="#install-guide"
						onClick={() =>
							pulseTarget(
								"install-guide",
							)
						}
					>
						VIEW INSTALL GUIDE{" "}
						<ArrowUpRight
							size={15}
							aria-hidden="true"
						/>
					</a>
				</div>
			</div>
			<div
				className="launcher-specs"
				aria-label="Client version information"
			>
				<p>
					<span>CLIENT VERSION</span>
					<strong>
						v{marsConfig.clientVersion}
					</strong>
				</p>
				<p>
					<span>GAME</span>
					<strong>
						Minecraft{" "}
						{marsConfig.minecraftVersion}
					</strong>
				</p>
				<p>
					<span>LOADER</span>
					<strong>{marsConfig.loader}</strong>
				</p>
			</div>
			<span className="launcher-stamp">
				MARS
				<br />
				CMD
			</span>
		</section>
	);
}
