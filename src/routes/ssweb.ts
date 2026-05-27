import { Hono } from "hono";
import puppeteer from "@cloudflare/puppeteer";

const ssweb = new Hono<{ Bindings: { MYBROWSER: any } }>();

ssweb.get("/", async (c) => {
	const url = c.req.query("url");
	const timeoutParam = c.req.query("timeout");
	const timeout = timeoutParam ? parseInt(timeoutParam, 10) : 30000;

	if (!url) {
		return c.json({ status: false, message: "url diperlukan" }, 400);
	}

	try {
		const browser = await puppeteer.launch(c.env.MYBROWSER);
		const page = await browser.newPage();

		page.setDefaultNavigationTimeout(timeout);
		page.setDefaultTimeout(timeout);

		await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 1 });

		await page.goto(url, { waitUntil: "domcontentloaded", timeout });

		await new Promise((resolve) => setTimeout(resolve, 2000));

		// In Cloudflare Workers, puppeteer returns Uint8Array for buffer
		const screenshotBuffer = await page.screenshot({
			type: "png",
			fullPage: false,
		});

		await browser.close();

		const formData = new FormData();
		// Cloudflare Workers fetch API natively supports Blob inside FormData
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
			return c.json(
				{ status: false, message: `Upload gagal: ${errorText}` },
				500,
			);
		}

		const data = (await uploadRes.json()) as any;

		return c.json({
			status: true,
			data: {
				url: data.Url,
			},
		});
	} catch (e: any) {
		return c.json({ status: false, message: e.message }, 500);
	}
});

export const Ssweb = ssweb;
