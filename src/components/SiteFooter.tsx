import { marsConfig } from "../config/mars";

export function SiteFooter() {
	return (
		<footer className="site-footer">
			<p>
				<span>MARS COMMAND</span> // COLONY NETWORK
			</p>
			<p>
				Atmospheric safety: <strong>UNVERIFIED</strong>
				<span className="footer-divider">·</span>{" "}
				Terraforming progress: <strong>0.00%</strong>
			</p>
			<p className="footer-moon">
				The moon has been informed //{" "}
				{marsConfig.serverAddress}
			</p>
		</footer>
	);
}
