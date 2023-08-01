import axios from "axios";

const AUTH_BASE_URL = "http://localhost:8005/auth";

class Authentication {
	registerUser(user) {
		return axios.post(AUTH_BASE_URL + "/register", user);
	}

	loginUser(user) {
		return axios.post(AUTH_BASE_URL + "/token", user);
	}
}

export default new Authentication();
