import React, { useEffect, useState } from "react";
import Navbar from "../components/util/Navbar";
import Table from "../components/util/Table";
import InventoryService from "../server/InventoryService";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InventoryRoom = () => {
	const navigate = useNavigate();

	const [rooms, setRooms] = useState([]);
	const [isUpdating, setIsUpdating] = useState(false);
	const [updatingId, setUpdatingId] = useState(null);
	const [roomNumberSearch, setRoomNumberSearch] = useState("");

	const fetchRooms = () => {
		InventoryService.getRooms()
			.then((response) => {
				console.log("Rooms----------------", response.data);
				setRooms([...response.data]);
			})
			.catch((error) => {
				console.log("inside fetch------- Rooms ", error.data);
				navigate("/");
			});
	};

	useEffect(() => {
		fetchRooms();
	}, []);

	const handleSubmit = (event) => {
		event.preventDefault();
		const roomNumber = event.target.elements.roomNumber.value;
		const roomType = event.target.elements.roomType.value;
		const price = event.target.elements.price.value;
		const available = event.target.elements.available.value;

		if (isUpdating && updatingId) {
			const updatedRoom = {
				roomNumber,
				roomType,
				price,
				available,
			};

			InventoryService.updateRoom(updatedRoom, updatingId)
				.then((response) => {
					if (response.data.success) {
						fetchRooms();
						toast.success(response.data.message);
					} else {
						// show toast
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
			const newRoom = {
				roomNumber,
				roomType,
				price,
				available,
			};

			InventoryService.addRoom(newRoom)
				.then((response) => {
					if (response.data.success) {
						toast.success(response.data.message);
						fetchRooms();
					} else {
						// show toast
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
		InventoryService.deleteRoom(id)
			.then((response) => {
				if (response.data.success) {
					toast.success(response.data.message);
					fetchRooms();
				} else {
					// show toast
					toast.error(response.data.message);
				}
			})
			.catch((error) => {
				console.log(error.data);
			});
	};

	const handleUpdate = (room) => {
		console.log("---------update Room ---", room.id);
		// Set values in the form
		document.getElementById("roomNumber").value = room.roomNumber;
		document.getElementById("roomType").value = room.roomType;
		document.getElementById("price").value = room.price;
		document.getElementById("available").value = room.available
			? "true"
			: "false";
		setIsUpdating(true);
		setUpdatingId(room.id);
	};

	const handleRoomNumberSearch = () => {
		console.log("room number serach ---------", roomNumberSearch);
		InventoryService.getRoomByRoomNumber(roomNumberSearch)
			.then((response) => {
				if (response.data.success) {
					toast.success(response.data.message);
					setRooms([response.data.room]);
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
		<div
			style={{
				background: `url('https://shorturl.at/axLN1') no-repeat center center fixed`,
				backgroundSize: "cover",
				height: "100vh",
			}}
		>
			<Navbar />
			<h1>Inventory Room</h1>
			<div
				className="card-container"
				style={{
					width: "70%",
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
							{isUpdating ? "Update Room" : "Add Room"}
						</h2>
						<form onSubmit={handleSubmit}>
							<div className="form-floating mb-3">
								<input
									type="number"
									className="form-control"
									id="roomNumber"
									placeholder="Enter room number"
									required
									min={0}
								/>
								<label htmlFor="roomNumber">Room Number</label>
							</div>
							<div className="form-floating mb-3">
								<select className="form-select" id="roomType" required>
									<option value="">Select room type</option>
									<option value="Standard">Standard</option>
									<option value="Delux">Delux</option>
									<option value="Suites">Suites</option>
								</select>
								<label htmlFor="roomType">Room Type</label>
							</div>
							<div className="form-floating mb-3">
								<input
									type="number"
									step="1"
									className="form-control"
									id="price"
									placeholder="Enter price"
									required
									min={0}
								/>
								<label htmlFor="price">Price</label>
							</div>
							<div className="form-floating mb-3">
								<select
									className="form-select"
									id="available"

									// style={{
									// 	borderBottom: "1px solid blue", // Add bottom border
									// }}
								>
									<option value={true}>Available</option>
									<option value={false}>Not Available</option>
								</select>
								<label htmlFor="available">Availability</label>
							</div>

							<button type="submit" className="btn btn-primary">
								{isUpdating ? "Update" : "Submit"}
							</button>
						</form>
					</div>
				</div>
				<div className="card mt-4">
					<div className="card-body">
						<h3 className="card-title">ROOMS</h3>
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
						<Table
							items={rooms}
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

export default InventoryRoom;
