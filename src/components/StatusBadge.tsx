import { CircleDot } from "lucide-react";

type StatusBadgeProps = {
	online: boolean | null;
	checking: boolean;
};

export function StatusBadge({ online, checking }: StatusBadgeProps) {
	const label = checking ? "CHECKING" : online ? "ONLINE" : "OFFLINE";
	const state = checking ? "checking" : online ? "online" : "offline";

	return (
		<span className={`status-badge status-badge--${state}`}>
			<CircleDot
				size={13}
				strokeWidth={2.2}
				aria-hidden="true"
			/>
			<span>{label}</span>
		</span>
	);
}
