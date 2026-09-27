import { AlertTriangle, Check, Info } from "lucide-react";
import { transmissions } from "../data/transmissions";

const severityIcon = {
	warning: AlertTriangle,
	info: Info,
	success: Check,
} as const;

export function TransmissionList() {
	return (
		<section
			className="transmission-section"
			aria-labelledby="transmissions-heading"
		>
			<div className="section-title-row">
				<div>
					<p className="eyebrow">
						03 // RECENT ACTIVITY
					</p>
					<h2 id="transmissions-heading">
						LATEST TRANSMISSIONS
					</h2>
				</div>
				<span className="transmission-count">
					{String(transmissions.length).padStart(
						2,
						"0",
					)}{" "}
					LOGS
				</span>
			</div>
			<div className="transmission-list">
				{transmissions.map((transmission, index) => {
					const Icon =
						severityIcon[
							transmission.severity
						];
					return (
						<article
							className={`transmission transmission--${transmission.severity}`}
							key={transmission.title}
						>
							<span className="transmission-index">
								0{index + 1}
							</span>
							<Icon
								size={17}
								className="transmission-icon"
								aria-hidden="true"
							/>
							<div>
								<h3>
									{
										transmission.title
									}
								</h3>
								<p>
									{
										transmission.body
									}
								</p>
							</div>
						</article>
					);
				})}
			</div>
		</section>
	);
}
