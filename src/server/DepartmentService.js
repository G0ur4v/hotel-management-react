import axiosInstance from "../interceptor/AxiosInstance";

const DEPT_BASE_URL = "http://localhost:8005/department";
const AUTH_BASE_URL = "http://localhost:8005/auth";

class DepartmentService {
	createDepartment(department) {
		console.log("inside -- DepartmentService create Method-----");
		return axiosInstance.post(DEPT_BASE_URL + "/save", department);
	}

	getDepartments() {
		console.log("-----------------inside getDepartment method-----------");
		return axiosInstance.get(DEPT_BASE_URL + "/get");
	}

	deleteDepartment(id) {
		console.log("--------inside delete Department------------");
		return axiosInstance.delete(DEPT_BASE_URL + "/delete/" + id);
	}

	updateDepartment(department, id) {
		console.log("----------------inside update department---------");
		return axiosInstance.put(DEPT_BASE_URL + "/update/" + id, department);
	}

	adminAccess() {
		console.log("inside -- DepartmentService admin Method-----");
		return axiosInstance.get(AUTH_BASE_URL + "/admin");
	}
}

export default new DepartmentService();
