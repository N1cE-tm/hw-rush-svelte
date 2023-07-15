import axios from "axios";

export const api = axios.create({
	baseURL: "./api",
	headers: {
		"Content-Type": "application/json;charset=UTF-8",
		"Access-Control-Allow-Origin": "*",
	},
});

export default api;
