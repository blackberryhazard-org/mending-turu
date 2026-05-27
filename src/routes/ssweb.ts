import { Hono } from "hono";
import puppeteer from "@cloudflare/puppeteer";
import { apiResponse, apiError } from "../utils";

const ssweb = new Hono<{
	Bindings: { MYBROWSER: any };
	Variables: { start: number };
}>();

ssweb.get("/", async (c) => {
	const url = c.req.query("url");
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

		await page.goto(url, { waitUntil: "domcontentloaded", timeout });

		await new Promise((resolve) => setTimeout(resolve, 2000));

		const screenshotBuffer = await page.screenshot({
			type: "png",
			fullPage: false,
		});

		await browser.close();

		const formData = new FormData();
		const blob = new Blob([screenshotBuffer as Uint8Array], {
			type: "image/png",
		});
		formData.append("file", blob, "screenshot.png");

		const uploadRes = await fetch("https://v2.convertapi.com/upload", {
			method: "POST",
			body: formData,
		});

		if (!uploadRes.ok) {
			const errorText = await uploadRes.text();
			return apiError(c, 500, `Upload gagal: ${errorText}`);
		}

		const data = (await uploadRes.json()) as any;

		return apiResponse(c, 200, "Success", { url: data.Url });
	} catch (e: any) {
		return apiError(c, 500, e.message);
	}
});

export const Ssweb = ssweb;
