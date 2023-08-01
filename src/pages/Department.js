import { useEffect, useState } from "react";
import Table from "../components/util/Table";
import Navbar from "../components/util/Navbar";
import DepartmentService from "../server/DepartmentService";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Report from "../components/report/Report";

const Department = () => {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [items, setItems] = useState([]);
	const [isFormSubmitted, setIsFormSubmitted] = useState(false);
	const [isError, setIsError] = useState(false);
	const [response, setResponse] = useState();
	const [isUpdating, setIsUpdating] = useState(false);
	const [updatingDepartmentId, setUpdatingDepartmentId] = useState(null);

	const fetchDepartments = () => {
		DepartmentService.getDepartments()
			.then((response) => {
				console.log("Departments----------------", response.data);
				setItems([...response.data]);
			})
			.catch((error) => {
				navigate("/");
			});
	};

	useEffect(() => {
		fetchDepartments();
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();

		if (isUpdating && updatingDepartmentId) {
			const updatedItem = {
				name,
				description,
			};

			// call the update api----
			DepartmentService.updateDepartment(updatedItem, updatingDepartmentId)
				.then((response) => {
					setResponse(response);
					if (response.data.success) {
						setIsFormSubmitted(true);
						fetchDepartments();
						toast.success(response.data.message);
					} else {
						toast.error(response.data.message);
						setIsError(true);
					}
					console.log(response.headers);
				})
				.catch((error) => {
					navigate("/");
					console.log(error.data);
					setIsUpdating(false);
					setUpdatingDepartmentId(null);
				});

			setName("");
			setDescription("");
			setIsUpdating(false);
			setUpdatingDepartmentId(null);
		} else {
			const newItem = {
				name,
				description,
			};

			DepartmentService.createDepartment(newItem)
				.then((response) => {
					setResponse(response);
					if (response.data.success) {
						setIsFormSubmitted(true);
						fetchDepartments();
						toast.success(response.data.message);
					} else {
						toast.error(response.data.message);
						setIsError(true);
					}
					console.log(response.headers);
				})
				.catch((error) => {
					navigate("/");
					console.log(error.data);
				});

			setName("");
			setDescription("");
		}
	};

	const handleDelete = (id) => {
		DepartmentService.deleteDepartment(id)
			.then((response) => {
				console.log("Delete Response", response);
				fetchDepartments();
				toast.success(response.data.message);
			})
			.catch((error) => {
				console.log(error.data);
			});
	};

	const handleUpdate = (department) => {
		console.log("---------update Department ---", department.id);
		setName(department.name);
		setDescription(department.description);
		setIsUpdating(true);
		setUpdatingDepartmentId(department.id);
	};

	return (
		<div
			style={{
				background: `url('https://shorturl.at/axLN1') no-repeat center center fixed`,
				backgroundSize: "cover",
				height: "100vh",
				overflow: "auto",
			}}
		>
			<Navbar></Navbar>
			<Report />
			<div className="container mt-4">
				<div
					className="card"
					style={{
						boxShadow:
							"0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
						opacity: "0.9",
					}}
				>
					<div className="card-body">
						<h3 className="card-title">
							{isUpdating ? "Update Department" : "Add Department"}
						</h3>
						<form onSubmit={handleSubmit}>
							<div className="form-floating mb-3">
								<input
									type="text"
									className="form-control"
									id="name"
									placeholder="Enter department name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
								/>
								<label htmlFor="name">Name</label>
							</div>
							<div className="form-floating mb-3">
								<textarea
									className="form-control"
									id="description"
									rows="3"
									placeholder="Enter department description"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									required
								></textarea>
								<label htmlFor="description">Description</label>
							</div>
							<div>
								<button type="submit" className="btn btn-primary mt-2">
									{isUpdating ? "Update" : "Submit"}
								</button>
							</div>
						</form>
					</div>
				</div>
				<div className="card mt-4">
					<div className="card-body">
						<h3 className="card-title">Departments</h3>
						<Table
							items={items}
							// tableHeading="Departments"
							onDelete={handleDelete}
							onUpdate={handleUpdate}
						/>
					</div>
				</div>
			</div>
			<ToastContainer />
		</div>
	);
};

export default Department;
