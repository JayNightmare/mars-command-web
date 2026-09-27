import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");

	return {
		base: process.env.BASE_PATH || env.BASE_PATH || "/",
		plugins: [react(), tailwindcss()],
		server: {
			proxy: {
				"/api/mcstatus": {
					target: "https://api.mcstatus.io",
					changeOrigin: true,
					rewrite: (path) =>
						path.replace(
							/^\/api\/mcstatus/,
							"/v2/status/java",
						),
				},
			},
		},
	};
});
