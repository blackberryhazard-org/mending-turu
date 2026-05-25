export const openApiSpec = {
	openapi: "3.0.0",
	info: {
		version: "0.1.2",
		title: "TURU REST API",
		description:
			"Free REST API for lazy people (fyi: turu is mean sleep in indonesia, Javanese language)",
		contact: {
			name: "indra87g",
			url: "https://github.com/indra87g/turu-api",
		},
	},
	servers: [{ url: "/api" }],
	paths: {
		"/solve": {
			post: {
				summary: "Solve Cloudflare Turnstile/Captcha",
				tags: ["Solver"],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									url: {
										type: "string",
										description: "URL to solve",
									},
									mode: {
										type: "string",
										description:
											"Mode (e.g. full, turnstile-min, cf_clearance)",
										default: "full",
									},
									timeout: {
										type: "number",
										description: "Timeout in milliseconds",
										default: 30000,
									},
									proxy: {
										type: "string",
										description: "Proxy server string (optional)",
									},
								},
								required: ["url"],
							},
						},
					},
				},
				responses: {
					"200": {
						description: "Solve result",
					},
					"400": {
						description: "Invalid parameters",
					},
					"500": {
						description: "Internal server error",
					},
				},
			},
		},
		"/ssweb": {
			post: {
				summary: "Take a screenshot of a webpage",
				tags: ["Tools"],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									url: {
										type: "string",
										description: "URL to capture",
									},
									timeout: {
										type: "number",
										description: "Timeout in milliseconds",
										default: 30000,
									},
								},
								required: ["url"],
							},
						},
					},
				},
				responses: {
					"200": {
						description: "Screenshot URL result",
					},
					"400": {
						description: "Invalid parameters",
					},
					"500": {
						description: "Internal server error",
					},
				},
			},
		},
		"/": {
			get: {
				summary: "Get API information",
				tags: ["Info"],
				responses: {
					"200": {
						description: "API information",
					},
				},
			},
		},
		"/hello/{name}": {
			get: {
				summary: "Say hello",
				tags: ["Greeting"],
				parameters: [
					{
						name: "name",
						in: "path",
						required: true,
						schema: { type: "string" },
					},
				],
				responses: {
					"200": {
						description: "Greeting message",
					},
				},
			},
		},
		"/calculate": {
			get: {
				summary: "Perform calculations",
				tags: ["Math"],
				parameters: [
					{
						name: "operation",
						in: "query",
						required: true,
						schema: {
							type: "string",
							enum: ["add", "subtract", "multiply", "divide"],
						},
					},
					{
						name: "num1",
						in: "query",
						required: true,
						schema: { type: "number" },
					},
					{
						name: "num2",
						in: "query",
						required: true,
						schema: { type: "number" },
					},
				],
				responses: {
					"200": {
						description: "Calculation result",
					},
					"400": {
						description: "Invalid operation or parameters",
					},
				},
			},
		},
	},
};
