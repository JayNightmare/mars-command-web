import { useEffect, useRef, useState } from "react";
import { serverStatusProvider } from "../services/serverStatus";
import type { ServerStatus } from "../types/server";

const REFRESH_INTERVAL_MS = 15_000;

export function useServerStatus() {
	const [status, setStatus] = useState<ServerStatus | null>(null);
	const [isChecking, setIsChecking] = useState(true);
	const [lastUpdated, setLastUpdated] = useState<string | null>(null);
	const refreshRef = useRef<() => Promise<void>>(async () => undefined);
	const requestInFlightRef = useRef<Promise<ServerStatus> | null>(null);

	useEffect(() => {
		let active = true;

		const refresh = async () => {
			setIsChecking(true);
			const request =
				requestInFlightRef.current ??
				serverStatusProvider.getStatus();
			requestInFlightRef.current = request;

			try {
				const nextStatus = await request;
				if (active) {
					setStatus(nextStatus);
					setLastUpdated(nextStatus.checkedAt);
				}
			} finally {
				if (requestInFlightRef.current === request)
					requestInFlightRef.current = null;
				if (active) setIsChecking(false);
			}
		};

		refreshRef.current = refresh;
		void refresh();

		const interval = window.setInterval(
			() => void refresh(),
			REFRESH_INTERVAL_MS,
		);
		return () => {
			active = false;
			window.clearInterval(interval);
		};
	}, []);

	return {
		status,
		isChecking,
		lastUpdated,
		refresh: () => void refreshRef.current(),
	};
}
