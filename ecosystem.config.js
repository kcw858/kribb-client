module.exports = {
	apps: [
		{
			name: "odorClient",
			script: "npm",
			args: "run start:prod",
			instances: 1,
			autorestart: true,
			watch: false,
			max_memory_restart: "1G",
			env: {
				NODE_ENV: "production",
			},
		},
	],
};
