import { Hono } from "hono";
import { apiResponse, apiError } from "../utils";

const calculate = new Hono<{ Variables: { start: number } }>();

calculate.get("/", (c) => {
	const operation = c.req.query("operation");
	const num1Raw = c.req.query("num1");
	const num2Raw = c.req.query("num2");

	if (!num1Raw || !num2Raw) {
		return apiError(c, 400, "Missing num1 or num2 parameters");
	}

	const num1 = parseFloat(num1Raw);
	const num2 = parseFloat(num2Raw);

	let result;

	switch (operation) {
		case "add":
			result = num1 + num2;
			break;
		case "subtract":
			result = num1 - num2;
			break;
		case "multiply":
			result = num1 * num2;
			break;
		case "divide":
			if (num2 === 0) {
				return apiError(c, 400, "Cannot divide with zero!");
			}
			result = num1 / num2;
			break;
		default:
			return apiError(c, 400, "Invalid operation!");
	}

	return apiResponse(c, 200, "Operation success", result);
});

export const Calculate = calculate;
