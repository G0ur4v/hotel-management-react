import React, { useState, useEffect } from "react";
import Navbar from "../components/util/Navbar";
import Room from "../server/Room";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RoomService = () => {
	const navigate = useNavigate();
	const [guestName, setGuestName] = useState("");
	const [roomNumber, setRoomNumber] = useState("");
	const [orderedItems, setOrderedItems] = useState([
		{
			name: "",
			description: "",
			quantity: 0,
			price: 0.0,
		},
	]);
	const [completed, setCompleted] = useState(false);
	const [roomServices, setRoomServices] = useState([]);
	const [isUpdateMode, setIsUpdateMode] = useState(false); // Track if update mode is active
	const [updateServiceId, setUpdateServiceId] = useState(null); // Track the service ID being updated
	const [roomNumberSearch, setRoomNumberSearch] = useState("");
	useEffect(() => {
		fetchRoomServices();
	}, []);

	const fetchRoomServices = () => {
		Room.getActiveRoomServices()
			.then((response) => {
				setRoomServices(response.data);
				console.log("---------fetched RoomServices--", response.data);
			})
			.catch((error) => {
				console.log(error);
				navigate("/");
			});
	};

	const handleItemChange = (index, field, value) => {
		const updatedItems = [...orderedItems];
		updatedItems[index][field] = value;
		setOrderedItems(updatedItems);
	};

	const handleAddItem = () => {
		setOrderedItems([
			...orderedItems,
			{
				name: "",
				description: "",
				quantity: 0,
				price: 0.0,
			},
		]);
	};

	const handleRemoveItem = (index, item) => {
		const updatedItems = [...orderedItems];
		updatedItems.splice(index, 1);
		setOrderedItems(updatedItems);
		// call api to remove guest when updating
		if (isUpdateMode && item.id) {
			Room.removeOrderedItem(item.id)
				.then((response) => {
					toast.success("Item removed successfully");
				})
				.catch((error) => {
					toast.error("Error removing Item");
					console.log(error.data);
				});
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		// Perform actions with the form data
		console.log("---------------isUpdateMode ", isUpdateMode);
		if (isUpdateMode && updateServiceId) {
			// Update mode: Handle update logic for the service
			const updatedService = {
				guestName,
				roomNumber,
				orderedItems: [...orderedItems],
				completed,
			};

			// Call the update service API with updatedService
			Room.updateRoomService(updatedService, updateServiceId)
				.then((response) => {
					if (response.data.success) {
						fetchRoomServices();
						toast.success(response.data.message);
					} else {
						toast.error(response.data.message);
					}
					console.log(response.headers);
				})
				.catch((error) => {
					console.log(error.data);
					setIsUpdateMode(false);
					setUpdateServiceId(null);
					navigate("/");
				});

			// ...
			setIsUpdateMode(false); // Exit update mode
			setUpdateServiceId(null); // Clear the update service ID
		} else {
			const newService = {
				guestName,
				roomNumber,
				orderedItems: [...orderedItems],
				completed,
			};

			console.log(
				"----------------------------------------newService ",
				newService
			);

			// call add roomService api
			Room.addRoomService(newService)
				.then((response) => {
					if (response.data.success) {
						toast.success(response.data.message);
						fetchRoomServices();
					} else {
						toast.error(response.data.message);
					}
					console.log(response.headers);
				})
				.catch((error) => {
					console.log(error);
					navigate("/");
				});
		}
		// Reset form fields
		setGuestName("");
		setRoomNumber("");
		setOrderedItems([
			{
				name: "",
				description: "",
				quantity: 0,
				price: 0.0,
			},
		]);
		setCompleted(false);
	};

	const handleUpdate = (serviceId, service) => {
		// Handle update mode when the update button is clicked
		setGuestName(service.guestName);
		setRoomNumber(service.roomNumber);
		setOrderedItems(service.orderedItems);
		setCompleted(service.completed);
		setIsUpdateMode(true); // Enter update mode
		setUpdateServiceId(serviceId); // Set the ID of the service being updated
	};

	const handleDelete = (serviceId) => {
		// Handle delete logic for the given serviceId
		console.log("Delete service:", serviceId);
		Room.deleteRoomService(serviceId)
			.then((response) => {
				if (response.data.success) {
					toast.success(response.data.message);
					fetchRoomServices();
				} else {
					toast.error(response.data.message);
				}
			})
			.catch((error) => {
				console.log(error.data);
			});
	};

	const handleRoomNumberSearch = () => {
		console.log("room number serach ---------", roomNumberSearch);
		Room.getActiveRoomServiceByRoomNumber(roomNumberSearch, false)
			.then((response) => {
				if (response.data.success) {
					toast.success(response.data.message);
					setRoomServices([response.data.roomService]);
				} else {
					toast.error(response.data.message);
				}
			})
			.catch((error) => {
				console.log(error.data);
			});

		setRoomNumberSearch("");
	};

	return (
		<div>
			<Navbar />
			<div
				className="container my-4"
				style={{
					display: "flex",
					justifyContent: "center",
				}}
			>
				<div className="card" style={{ width: "100%" }}>
					<div className="card-body">
						<h4 className="card-title">Room Service</h4>

						<form onSubmit={handleSubmit}>
							<div className="mb-3">
								<div className="form-floating">
									<input
										type="text"
										className="form-control"
										id="guestName"
										placeholder="Guest Name"
										value={guestName}
										onChange={(e) => setGuestName(e.target.value)}
										required
									/>
									<label htmlFor="guestName">Guest Name</label>
								</div>
							</div>
							<div className="mb-3">
								<div className="form-floating">
									<input
										type="number"
										className="form-control"
										id="roomNumber"
										placeholder="Room Number"
										value={roomNumber}
										onChange={(e) => setRoomNumber(e.target.value)}
										required
									/>
									<label htmlFor="roomNumber">Room Number</label>
								</div>
							</div>
							<div className="mb-3">
								<label className="form-label">Ordered Items</label>
								{orderedItems.map((item, index) => (
									<div key={index} className="row mb-2">
										<div className="col">
											<div className="form-floating">
												<input
													type="text"
													className="form-control"
													placeholder="Name"
													value={item.name}
													onChange={(e) =>
														handleItemChange(index, "name", e.target.value)
													}
													required
												/>
												<label htmlFor={`itemName_${index}`}>Name</label>
											</div>
										</div>
										<div className="col">
											<div className="form-floating">
												<input
													type="text"
													className="form-control"
													placeholder="Description"
													value={item.description}
													onChange={(e) =>
														handleItemChange(
															index,
															"description",
															e.target.value
														)
													}
													required
												/>
												<label htmlFor={`itemDescription_${index}`}>
													Description
												</label>
											</div>
										</div>
										<div className="col">
											<div className="form-floating">
												<input
													type="number"
													className="form-control"
													placeholder="Quantity"
													min={1}
													value={item.quantity}
													onChange={(e) =>
														handleItemChange(
															index,
															"quantity",
															parseInt(e.target.value)
														)
													}
													required
												/>
												<label htmlFor={`itemQuantity_${index}`}>
													Quantity
												</label>
											</div>
										</div>
										<div className="col">
											<div className="form-floating">
												<input
													type="number"
													step="0.01"
													className="form-control"
													placeholder="Price"
													min={0}
													value={item.price}
													onChange={(e) =>
														handleItemChange(
															index,
															"price",
															parseFloat(e.target.value)
														)
													}
													required
												/>
												<label htmlFor={`itemPrice_${index}`}>Price</label>
											</div>
										</div>
										<div className="col">
											{index === orderedItems.length - 1 && (
												<button
													className="btn btn-primary btn-sm"
													onClick={handleAddItem}
												>
													Add Item
												</button>
											)}
											{index !== orderedItems.length - 1 && (
												<button
													className="btn btn-danger btn-sm"
													onClick={() => handleRemoveItem(index, item)}
												>
													Remove
												</button>
											)}
										</div>
									</div>
								))}
							</div>
							<div className="d-flex align-items-center justify-content-center mb-3">
								<div className="form-check">
									<input
										className="form-check-input"
										type="checkbox"
										id="completed"
										checked={completed}
										hidden
										onChange={(e) => setCompleted(e.target.checked)}
									/>
									<label
										className="form-check-label"
										htmlFor="completed"
										hidden
									>
										Completed
									</label>
								</div>
							</div>
							<button type="submit" className="btn btn-primary">
								{isUpdateMode ? "Update" : "Submit"}
							</button>
						</form>

						<div className="mt-4">
							<h5> Active Room Services</h5>
							<div className="mb-3">
								<div className="input-group">
									<input
										type="number"
										className="form-control"
										placeholder="Enter Room Number"
										value={roomNumberSearch}
										onChange={(e) => setRoomNumberSearch(e.target.value)}
									/>
									<button
										className="btn btn-primary ms-2"
										style={{ width: "150px" }}
										onClick={handleRoomNumberSearch}
									>
										Search
									</button>
								</div>
							</div>
							<table className="table table-striped">
								<thead>
									<tr>
										<th>Guest Name</th>
										<th>Room Number</th>
										<th>Ordered Items</th>
										<th>Completed</th>
										<th>Actions</th>{" "}
										{/* New column for update and delete buttons */}
									</tr>
								</thead>
								<tbody>
									{roomServices.map((service, index) => (
										<tr key={index}>
											<td>{service.guestName}</td>
											<td>{service.roomNumber}</td>
											<td>
												<ol>
													{service.orderedItems.map((item, i) => (
														<li key={i}>
															Name: {item.name}, Description: {item.description}
															, Quantity: {item.quantity}, Price: {item.price}
														</li>
													))}
												</ol>
											</td>
											<td>{service.completed ? "Yes" : "No"}</td>
											<td>
												{/* Update button */}
												<button
													className="btn btn-primary btn-sm me-2"
													onClick={() => handleUpdate(service.id, service)}
												>
													Update
												</button>
												{/* Delete button */}
												<button
													className="btn btn-danger btn-sm"
													onClick={() => handleDelete(service.id)}
												>
													Delete
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			<ToastContainer />
		</div>
	);
};

export default RoomService;
