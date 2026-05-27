import { Hono } from "hono";
import puppeteer from "@cloudflare/puppeteer";
import { apiResponse, apiError } from "../utils";

const cfSolve = new Hono<{
	Bindings: { MYBROWSER: any };
	Variables: { start: number };
}>();

cfSolve.get("/", async (c) => {
	const url = c.req.query("url");
	const mode = c.req.query("mode") || "full";
	const timeoutParam = c.req.query("timeout");
	const timeout = timeoutParam ? parseInt(timeoutParam, 10) : 30000;

	if (!url) {
		return apiError(c, 400, "url diperlukan");
	}

	try {
		const browser = await puppeteer.launch(c.env.MYBROWSER);
		const page = await browser.newPage();

		page.setDefaultNavigationTimeout(timeout);
		page.setDefaultTimeout(timeout);

		await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 1 });

		if (mode === "turnstile-min") {
			await page.evaluateOnNewDocument(() => {
				(window as any).__turnstileToken = "";
				const hookTurnstile = () => {
					if (!(window as any).turnstile || (window as any).turnstile.__hooked)
						return;
					const origRender = (window as any).turnstile.render.bind(
						(window as any).turnstile,
					);
					(window as any).turnstile.render = function (
						container: any,
						params: any,
					) {
						if (params && typeof params.callback === "function") {
							const origCb = params.callback;
							params.callback = function (token: string) {
								(window as any).__turnstileToken = token;
								return origCb(token);
							};
						}
						return origRender(container, params);
					};
					(window as any).turnstile.__hooked = true;
				};
				Object.defineProperty(window, "turnstile", {
					configurable: true,
					set(v) {
						this.__ts = v;
						setTimeout(hookTurnstile, 0);
					},
					get() {
						return this.__ts;
					},
				});
			});
		}

		await page.goto(url, { waitUntil: "domcontentloaded", timeout });

		let result: any = {};

		if (mode === "turnstile-min") {
			try {
				await page.waitForFunction(() => !!(window as any).__turnstileToken, {
					timeout: 15000,
				});
			} catch (e) {}

			let turnstileToken = await page.evaluate(
				() => (window as any).__turnstileToken,
			);
			if (!turnstileToken) {
				turnstileToken = await page.evaluate(() => {
					const input = document.querySelector(
						'[name="cf-turnstile-response"]',
					) as HTMLInputElement;
					if (input && input.value) return input.value;
					const input2 = document.querySelector(
						"#turnstile_response",
					) as HTMLInputElement;
					if (input2 && input2.value) return input2.value;
					const input3 = document.querySelector(
						'[name="turnstile"]',
					) as HTMLInputElement;
					if (input3 && input3.value) return input3.value;
					return "";
				});
			}

			if (!turnstileToken) {
				throw new Error("Turnstile token tidak ditemukan");
			}

			const liveUA = await page.evaluate(() => navigator.userAgent);
			result = { token: turnstileToken, user_agent: liveUA };
		} else {
			await new Promise((resolve) => setTimeout(resolve, 5000));

			const liveUA = await page.evaluate(() => navigator.userAgent);
			const cookies = await page.cookies();
			const cookieStr = cookies
				.map((c: any) => `${c.name}=${c.value}`)
				.join("; ");
			const cf_clearance = cookies.find((c: any) => c.name === "cf_clearance");

			result = {
				cookies,
				cookie: cookieStr,
				user_agent: liveUA,
				cf_clearance: cf_clearance?.value || null,
				headers: {
					"user-agent": liveUA,
					cookie: cookieStr,
					"cf-clearance": cf_clearance?.value || "",
				},
			};
		}

		await browser.close();
		return apiResponse(c, 200, "Success", result);
	} catch (e: any) {
		return apiError(c, 500, e.message);
	}
});

export const CfSolve = cfSolve;
