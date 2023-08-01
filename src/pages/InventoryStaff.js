import React, { useEffect, useState } from "react";
import Navbar from "../components/util/Navbar";
import Table from "../components/util/Table";
import InventoryService from "../server/InventoryService";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InventoryStaff = () => {
	const navigate = useNavigate();

	const [staffs, setStaffs] = useState([]);
	const [isUpdating, setIsUpdating] = useState(false);
	const [updatingId, setUpdatingId] = useState(null);

	const fetchStaffs = () => {
		InventoryService.getAllStaff()
			.then((response) => {
				console.log("Staffs----------------", response.data);

				setStaffs([...response.data]);
			})
			.catch((error) => {
				console.log("inside fetch------- Staffs ", error.data);
				navigate("/");
			});
	};

	useEffect(() => {
		fetchStaffs();
	}, []);

	const handleSubmit = (event) => {
		event.preventDefault();
		const name = event.target.elements.name.value;
		const email = event.target.elements.email.value;
		const position = event.target.elements.position.value;
		const departmentId = event.target.elements.departmentId.value;
		const contactNumber = event.target.elements.contactNumber.value;
		const workDescription = event.target.elements.workDescription.value;

		// Email validation
		if (!validateEmail(email)) {
			toast.error("Invalid email address");
			return;
		}

		// Contact number validation
		if (!validateContactNumber(contactNumber)) {
			toast.error("Invalid contact number");
			return;
		}

		if (isUpdating && updatingId) {
			const updatedStaff = {
				name,
				email,
				position,
				departmentId,
				contactNumber,
				workDescription,
			};

			InventoryService.updateStaff(updatedStaff, updatingId)
				.then((response) => {
					if (response.data.success) {
						fetchStaffs();
						toast.success(response.data.message);
					} else {
						toast.error(response.data.message);
					}
					console.log(response.headers);
				})
				.catch((error) => {
					console.log(error.data);
					setIsUpdating(false);
					setUpdatingId(null);
					navigate("/");
				});

			setIsUpdating(false);
			setUpdatingId(null);
		} else {
			const newStaff = {
				name,
				email,
				position,
				departmentId,
				contactNumber,
				workDescription,
			};

			InventoryService.addStaff(newStaff)
				.then((response) => {
					if (response.data.success) {
						toast.success(response.data.message);
						fetchStaffs();
					} else {
						toast.error(response.data.message);
					}
					console.log(response.headers);
				})
				.catch((error) => {
					console.log(error.data);
					navigate("/");
				});
		}

		event.target.reset();
	};

	const handleDelete = (id) => {
		InventoryService.deleteStaff(id)
			.then((response) => {
				if (response.data.success) {
					toast.success(response.data.message);
					fetchStaffs();
				} else {
					toast.error(response.data.message);
				}
			})
			.catch((error) => {
				console.log(error.data);
			});
	};

	const handleUpdate = (staff) => {
		console.log("---------update Staff ---", staff.id);
		// Set values in the form
		document.getElementById("name").value = staff.name;
		document.getElementById("email").value = staff.email;
		document.getElementById("position").value = staff.position;
		document.getElementById("departmentId").value = staff.departmentId;
		document.getElementById("contactNumber").value = staff.contactNumber;
		document.getElementById("workDescription").value = staff.workDescription;
		setIsUpdating(true);
		setUpdatingId(staff.id);
	};

	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const validateContactNumber = (contactNumber) => {
		const contactNumberRegex = /^[0-9]{10}$/;
		return contactNumberRegex.test(contactNumber);
	};

	return (
		<div
			style={{
				background: `url('https://shorturl.at/axLN1') no-repeat center center fixed`,
				backgroundSize: "cover",
				height: "100vh",
			}}
		>
			<Navbar />
			<h1>Inventory Staff</h1>
			<div
				className="card-container"
				style={{
					width: "80%",
					margin: "0 auto",
				}}
			>
				<div
					className="card"
					style={{
						boxShadow:
							"0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
						opacity: "0.9",
					}}
				>
					<div className="card-body">
						<h2 className="card-title text-center">
							{isUpdating ? "Update Staff" : "Add Staff"}
						</h2>
						<form onSubmit={handleSubmit}>
							<div className="form-floating mb-3">
								<input
									type="text"
									className="form-control"
									id="name"
									placeholder="Enter name"
									required
								/>
								<label htmlFor="name">Name</label>
							</div>
							<div className="form-floating mb-3">
								<input
									type="email"
									className="form-control"
									id="email"
									placeholder="Enter email"
									required
								/>
								<label htmlFor="email">Email</label>
							</div>
							<div className="form-floating mb-3">
								<input
									type="text"
									className="form-control"
									id="position"
									placeholder="Enter position"
									required
								/>
								<label htmlFor="position">Position</label>
							</div>
							<div className="form-floating mb-3">
								<input
									type="number"
									className="form-control"
									id="departmentId"
									placeholder="Enter department ID"
									required
									min={1}
								/>
								<label htmlFor="departmentId">Department ID</label>
							</div>
							<div className="form-floating mb-3">
								<input
									type="text"
									className="form-control"
									id="contactNumber"
									placeholder="Enter contact number"
									required
									pattern="[0-9]{10}"
								/>
								<label htmlFor="contactNumber">Contact Number</label>
							</div>
							<div className="form-floating mb-3">
								<textarea
									className="form-control"
									id="workDescription"
									placeholder="Enter work description"
									rows={3}
									required
								></textarea>
								<label htmlFor="workDescription">Work Description</label>
							</div>

							<button type="submit" className="btn btn-primary">
								{isUpdating ? "Update" : "Submit"}
							</button>
						</form>
					</div>
				</div>
				<div className="card mt-4">
					<div className="card-body">
						<h3 className="card-title">STAFF</h3>
						<Table
							items={staffs}
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

export default InventoryStaff;
