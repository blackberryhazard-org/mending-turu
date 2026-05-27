import type { Context } from "hono";

function randomRange(min: number, max: number) {
	const minCeiled = Math.ceil(min);
	const maxFloored = Math.floor(max);

	return Math.floor(Math.random() * (maxFloored - minCeiled + 1)) + minCeiled;
}

export const CREDITS = {
	name: "TURU REST API",
	version: "0.1.2",
	author: "indra87g",
};

export function apiResponse(
	c: Context,
	code: number,
	message: string,
	data?: any,
) {
	const start = c.get("start") || Date.now();
	const latency = Date.now() - start;

	const res: any = {
		status: true,
		code,
		message,
	};

	if (data !== undefined) {
		res.data = data;
	}

	res.meta = {
		endpoint: new URL(c.req.url).pathname,
		latency,
		timestamp: Math.floor(Date.now() / 1000),
	};

	res.credits = CREDITS;

	// Use c.json directly, as Hono implicitly infers the correct response Content-Type
	// We have to cast code as any for custom status codes or just assume it is mapped by Hono properly if it's standard
	return c.json(res, code as any);
}

export function apiError(c: Context, code: number, message: string) {
	const start = c.get("start") || Date.now();
	const latency = Date.now() - start;

	return c.json(
		{
			status: false,
			code,
			message,
			meta: {
				endpoint: new URL(c.req.url).pathname,
				latency,
				timestamp: Math.floor(Date.now() / 1000),
			},
			credits: CREDITS,
		},
		code as any,
	);
}

export { randomRange };
