import { ArrowDown, Crosshair } from "lucide-react";
import { pulseTarget } from "../utils/pulseTarget";
import { StarField } from "./StarField";

type HeroPanelProps = {
	online: boolean | null;
	checking: boolean;
};

export function HeroPanel({ online, checking }: HeroPanelProps) {
	return (
		<section
			className="hero-panel"
			id="hero-panel"
			aria-labelledby="hero-title"
		>
			<div className="hero-copy">
				<p className="eyebrow">
					<Crosshair
						size={13}
						aria-hidden="true"
					/>{" "}
					ORBITAL SIGNAL ARRAY // LIVE
				</p>
				<h1 id="hero-title">
					THE RED PLANET
					<br />
					<span>HAS CHOSEN YOU</span>
				</h1>
				<p className="hero-subtitle">
					Do not ask why the moon is watching
				</p>
				<a
					className="hero-jump"
					href="#server-status"
					onClick={() =>
						pulseTarget("server-status")
					}
				>
					<span>MISSION CONTROL</span>
					<ArrowDown
						size={14}
						aria-hidden="true"
					/>
				</a>
			</div>
			<div className="hero-signal">
				<StarField />
				<span className="signal-caption">
					SIGNAL{" "}
					{checking
						? "ACQUIRING"
						: online
							? "LOCKED"
							: "LOST"}
				</span>
			</div>
			<div className="hero-coordinates" aria-hidden="true">
				24° 07′ N<br />
				05° 31′ E
			</div>
		</section>
	);
}
