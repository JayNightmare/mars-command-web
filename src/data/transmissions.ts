export type Transmission = {
	severity: "warning" | "info" | "success";
	title: string;
	body: string;
};

export const transmissions: Transmission[] = [
	{
		severity: "warning",
		title: "END PROTOCOL remains active",
		body: "Orbital anomaly transit requires Mars Command authorisation",
	},
	{
		severity: "info",
		title: "Landing Zone 01 operational",
		body: "Terraforming progress remains within acceptable fictional limits",
	},
	{
		severity: "success",
		title: "Create infrastructure online",
		body: "Industrial activity is now considered somebody else's problem",
	},
];
