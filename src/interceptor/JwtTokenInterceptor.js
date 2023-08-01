const JwtTokenInterceptor = (config) => {
	const token = localStorage.getItem("token"); // Retrieve the token from local storage
	if (token) {
		config.headers.Authorization = `Bearer ${token}`; // Attach the token to the request headers
	}
	return config;
};

export default JwtTokenInterceptor;
