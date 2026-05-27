import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";

import { Calculate } from "./routes/calculate";
import { CfSolve } from "./routes/cfSolve";
import { Ssweb } from "./routes/ssweb";
import { Home } from "./components/Home";
import { openApiSpec } from "./docs/openapi";
import { randomRange, apiError, apiResponse } from "./utils";
import commitData from "./commit.json";

const apiApp = new Hono<{ Variables: { start: number } }>();
apiApp.use("*", async (c, next) => {
	c.set("start", Date.now());
	await next();
});

apiApp.use(prettyJSON());
apiApp.notFound((c) => apiError(c, 404, "Endpoint not found!"));

apiApp.get("/", (c) => {
	return apiResponse(c, 200, "Success", {
		name: "TURU REST API",
		description:
			"Free REST API for lazy people (fyi: turu is mean sleep in indonesia, Javanese language)",
		author: "indra87g",
		version: "0.1.2",
		license: "MIT",
		github: "https://github.com/indra87g/turu-api",
		status: "https://stats.uptimerobot.com/6tNlOje1Uv",
		randomNumber: randomRange(1, 1000),
	});
});
apiApp.get("/hello/:name", (c) => {
	const name = c.req.param("name");
	return apiResponse(c, 200, "Success", { message: `Hello, ${name}!` });
});
apiApp.route("/calculate", Calculate);
apiApp.route("/cf-solve", CfSolve);
apiApp.route("/ssweb", Ssweb);

const app = new Hono();

app.get("/", async (c) => {
	const start = Date.now();
	// Calculate a simple internal ping representation
	await new Promise((res) => setTimeout(res, 2));
	const pingMs = Date.now() - start;

	const userIp =
		c.req.header("cf-connecting-ip") ||
		c.req.header("x-forwarded-for") ||
		"127.0.0.1";

	// API counts endpoints logically bound or available paths
	const endpointsCount = Object.keys(openApiSpec.paths).length;

	const gitCommit = commitData.commit || "unknown";

	return c.html(
		<Home
			userIp={userIp}
			endpointsCount={endpointsCount}
			pingMs={pingMs}
			gitCommit={gitCommit}
		/>,
	);
});

app.get("/openapi.json", (c) => c.json(openApiSpec));

const swaggerCustomCss = `
  body {
    background-color: #0f172a;
    color: #f8fafc;
  }
  .swagger-ui .info .title,
  .swagger-ui .info p,
  .swagger-ui .info li,
  .swagger-ui .info a,
  .swagger-ui .scheme-container .schemes-title,
  .swagger-ui .opblock .opblock-summary-operation-id,
  .swagger-ui .opblock .opblock-summary-path,
  .swagger-ui .opblock .opblock-summary-path__deprecated,
  .swagger-ui .opblock-description-wrapper p,
  .swagger-ui .parameter__name,
  .swagger-ui .parameter__type,
  .swagger-ui .parameter__in,
  .swagger-ui table thead tr td,
  .swagger-ui table thead tr th,
  .swagger-ui .response-col_status,
  .swagger-ui .response-col_description,
  .swagger-ui .tab li,
  .swagger-ui .opblock-tag {
    color: #f1f5f9 !important;
  }
  .swagger-ui .opblock-tag small {
    color: #cbd5e1 !important;
  }
  .swagger-ui .scheme-container {
    background-color: #1e293b;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,.15);
  }
  .swagger-ui .opblock {
    background-color: #1e293b;
    border: 1px solid #334155;
    border-radius: 8px;
  }
  .swagger-ui .opblock .opblock-section-header {
    background-color: #0f172a;
  }
  .swagger-ui .opblock.opblock-post {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
  }
  .swagger-ui .opblock.opblock-post .opblock-summary-method {
    background: #ef4444;
  }
  .swagger-ui .opblock.opblock-get {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
  }
  .swagger-ui .opblock.opblock-get .opblock-summary-method {
    background: #3b82f6;
  }
  .swagger-ui .btn {
    color: #f1f5f9;
    border-color: #334155;
  }
  .swagger-ui .btn.execute {
    background-color: #ef4444;
    color: white;
    border-color: #ef4444;
  }
  .swagger-ui section.models {
    border: 1px solid #334155;
    border-radius: 8px;
    background: #1e293b;
  }
  .swagger-ui section.models h4 {
    color: #f1f5f9 !important;
  }
  .swagger-ui section.models .model-container {
    background: #0f172a;
  }
  .swagger-ui .model {
    color: #f1f5f9;
  }
  .swagger-ui .model-title {
    color: #f8fafc;
  }
  .swagger-ui .prop-type {
    color: #ef4444;
  }
  .swagger-ui .model .property.primitive {
    color: #cbd5e1;
  }
`;

app.get("/docs", (c) => {
	return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="SwaggerUI" />
  <title>SwaggerUI</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <style>
    ${swaggerCustomCss}
  </style>
</head>
<body>
<div id="swagger-ui"></div>
<script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js" crossorigin="anonymous"></script>
<script>
  window.onload = () => {
    window.ui = SwaggerUIBundle({
      url: '/openapi.json',
      dom_id: '#swagger-ui',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIStandalonePreset
      ],
      layout: "BaseLayout"
    });
  };
</script>
</body>
</html>
`);
});

app.get("/donate", (c) => {
	return c.redirect(
		"https://app.pakasir.com/pay/twinightwheel/5000?order_id=22",
		301,
	);
});

app.route("/api", apiApp);

const port = 5000;
console.log(`Server is running on port ${port}`);

export default {
	port,
	fetch: app.fetch,
};
