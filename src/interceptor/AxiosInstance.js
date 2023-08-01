import axios from "axios";
const axiosInstance = axios.create({
	baseURL: "", // Replace with your API base URL
});

axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token"); // Retrieve the token from local storage
		console.log(
			"inside interceptor-------------------------------------",
			token
		);
		if (token) {
			config.headers.Authorization = `Bearer ${token}`; // Attach the token to the request headers
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default axiosInstance;
