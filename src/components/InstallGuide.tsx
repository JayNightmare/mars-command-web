import { ClipboardList } from "lucide-react";

const installSteps = [
	"Download the Mars Command Launcher",
	"Install or open the launcher",
	"Sign in with your Microsoft Minecraft account",
	"Let the client synchronise the required Mars files",
	"Launch Mars and connect to play.nexusgit.info",
];

export function InstallGuide() {
	return (
		<section
			className="panel guide-panel"
			id="install-guide"
			aria-labelledby="guide-heading"
		>
			<div className="panel-heading">
				<div>
					<p className="eyebrow">
						04 // PERSONNEL INSTRUCTIONS
					</p>
					<h2 id="guide-heading">HOW TO JOIN</h2>
				</div>
				<ClipboardList
					size={18}
					className="heading-icon"
					aria-hidden="true"
				/>
			</div>
			<ol className="install-steps">
				{installSteps.map((step, index) => (
					<li key={step}>
						<span>
							{String(
								index + 1,
							).padStart(2, "0")}
						</span>
						<p>{step}</p>
					</li>
				))}
			</ol>
			<p className="guide-note">
				The launcher manages the Mars client files. Do
				not manually edit managed mods or configuration
				files unless instructed by Mars Command
			</p>
		</section>
	);
}
