import React, { useState, useEffect } from "react";
import Navbar from "../components/util/Navbar";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReservationService from "../server/ReservationService";

const Reservation = () => {
	const getFormattedDate = (dateString) => {
		const date = new Date(dateString);
		const formattedDate = date.toISOString().split("T")[0];
		return formattedDate;
	};

	const navigate = useNavigate();
	const [reservationData, setReservationData] = useState({
		numberOfChildren: 0,
		numberOfAdults: 1,
		checkInDate: "",
		checkOutDate: "",
		numberOfNights: 0,
		roomNumber: "",
		roomType: "",
	});

	const [guests, setGuests] = useState([]);
	const [reservations, setReservations] = useState([]);
	const [isUpdateMode, setIsUpdateMode] = useState(false); // Track if update mode is active
	const [updateReservationId, setUpdateReservationId] = useState(null); // Track the service ID being updated
	const [roomNumberSearch, setRoomNumberSearch] = useState("");

	useEffect(() => {
		fetchReservations();
	}, []);

	const fetchReservations = () => {
		ReservationService.getActiveReservations()
			.then((response) => {
				setReservations(response.data);
				console.log("---------fetched RoomServices--", response.data);
			})
			.catch((error) => {
				console.log(error);
				navigate("/");
			});
	};
	const handleReservationChange = (e) => {
		const { name, value } = e.target;
		setReservationData((prevData) => ({ ...prevData, [name]: value }));

		if (name === "checkInDate" || name === "checkOutDate") {
			const checkInDate =
				name === "checkInDate"
					? new Date(value)
					: new Date(reservationData.checkInDate);
			if (checkInDate < new Date()) {
				toast.error("Invalid check-in date");
				return;
			}
			const checkOutDate =
				name === "checkOutDate"
					? new Date(value)
					: new Date(reservationData.checkOutDate);

			if (checkOutDate < new Date()) {
				toast.error("Invalid check-out date");
				return;
			}

			if (checkInDate && checkOutDate) {
				if (checkOutDate > checkInDate) {
					const nights = Math.ceil(
						(checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
					);
					setReservationData((prevData) => ({
						...prevData,
						numberOfNights: nights,
					}));
				} else {
					toast.error("Invalid checkIn or checkOut date");
				}
			}
		}
	};

	const handleGuestChange = (index, e) => {
		const { name, value } = e.target;
		setGuests((prevGuests) => {
			const updatedGuests = [...prevGuests];
			updatedGuests[index] = { ...updatedGuests[index], [name]: value };
			return updatedGuests;
		});
	};

	const handleAddGuest = () => {
		setGuests((prevGuests) => [...prevGuests, {}]);
	};

	const handleRemoveGuest = (index, guest) => {
		setGuests((prevGuests) => {
			const updatedGuests = [...prevGuests];
			updatedGuests.splice(index, 1);
			return updatedGuests;
		});

		// call api to remove guest when updating
		if (isUpdateMode && guest.id) {
			ReservationService.removeGuest(guest.id)
				.then((response) => {
					toast.success("Guest removed successfully");
				})
				.catch((error) => {
					toast.error("Error removing guest");
					console.log(error.data);
				});
		}

		console.log("Removed Guest--------", guest);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		// Handle form submission logic here

		// Validate phone number and email for every guest
		const isGuestDataValid = guests.every((guest) => {
			if (!validateEmail(guest.email)) {
				toast.error("Invalid email for a guest name" + guest.name);
				return false;
			}

			if (!validateContactNumber(guest.phoneNumber)) {
				toast.error("Invalid phone number for a guest name" + guest.name);
				return false;
			}

			return true;
		});

		if (!isGuestDataValid) {
			return;
		}

		if (reservationData.numberOfNights <= 0) {
			toast.error("Invalid check-in or check-out date");
			return;
		}
		if (isUpdateMode && updateReservationId) {
			const updatedReservation = {
				...reservationData,
				guests,
			};
			console.log(
				"updated Reservation data --------------------------------------------------------",
				updatedReservation
			);
			// call the update reservation api ---
			ReservationService.updateReservation(
				updatedReservation,
				updateReservationId
			)
				.then((response) => {
					if (response.data.success) {
						fetchReservations();
						toast.success(response.data.message);
					} else {
						toast.error(response.data.message);
					}
					console.log(response.headers);
				})
				.catch((error) => {
					console.log(error.data);
					setIsUpdateMode(false);
					setUpdateReservationId(null);
					navigate("/");
				});

			setIsUpdateMode(false); // Exit update mode

			setUpdateReservationId(null); // Clear the updating id
		} else {
			const newReservation = {
				...reservationData,
				guests,
			};

			// call the add reservation api----------

			ReservationService.addReservation(newReservation)
				.then((response) => {
					if (response.data.success) {
						toast.success(response.data.message);
						fetchReservations();
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

		// setReservations([...reservations, newReservation]);
		console.log("Reservation Data:", reservationData);
		console.log("Guests:", guests);
		console.log("Reservations--- ", reservations);
		// Reset the form
		setReservationData({
			numberOfChildren: 0,
			numberOfAdults: 1,
			checkInDate: "",
			checkOutDate: "",
			numberOfNights: 0,
			roomNumber: "",
		});
		setGuests([]);
	};

	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const validateContactNumber = (contactNumber) => {
		const contactNumberRegex = /^[0-9]{10}$/;
		return contactNumberRegex.test(contactNumber);
	};

	const handleUpdateReservation = (reservation, reservationId) => {
		setReservationData({
			numberOfChildren: reservation.numberOfChildren,
			numberOfAdults: reservation.numberOfAdults,
			checkInDate: getFormattedDate(reservation.checkInDate),
			checkOutDate: getFormattedDate(reservation.checkOutDate),
			numberOfNights: reservation.numberOfNights,
			roomNumber: reservation.roomNumber,
			roomType: reservation.roomType,
		});
		setGuests(reservation.guests);
		setIsUpdateMode(true); // Enter update mode
		setUpdateReservationId(reservationId); // Set the ID of the service being updated
	};

	const handleDeleteReservation = (reservationId) => {
		// Handle delete logic for the given reservationId

		ReservationService.deleteReservation(reservationId)
			.then((response) => {
				if (response.data.success) {
					toast.success(response.data.message);
					fetchReservations();
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
		ReservationService.getReservationById(roomNumberSearch)
			.then((response) => {
				if (response.data.success) {
					toast.success("Reservation fetched Successfully");
					setReservations([response.data.reservation]);
				} else {
					toast.error("Reservation not found");
				}

				console.log("search result -----------", response.data);
			})
			.catch((error) => {
				toast.error("Reservation not found");
				console.log(error.data);
			});

		setRoomNumberSearch("");
	};

	return (
		<div>
			<Navbar />
			<div
				className="container"
				style={{
					display: "flex",
					justifyContent: "center",
				}}
			>
				<div className="card" style={{ width: "50%" }}>
					<div className="card-body">
						<h2 className="card-title">Reservation Form</h2>
						<form onSubmit={handleSubmit}>
							{/* Reservation Details */}
							<div className="row">
								<div className="col-md-6">
									<div className="form-floating mb-3">
										<input
											type="number"
											className="form-control"
											id="numberOfChildren"
											name="numberOfChildren"
											placeholder="Number of Children"
											min={0}
											max={2}
											value={reservationData.numberOfChildren}
											onChange={handleReservationChange}
											required
										/>
										<label htmlFor="numberOfChildren" className="form-label">
											Number of Children
										</label>
									</div>
									<div className="form-floating mb-3">
										<input
											type="number"
											className="form-control"
											id="numberOfAdults"
											name="numberOfAdults"
											placeholder="Number of Adults"
											min={0}
											max={2}
											value={reservationData.numberOfAdults}
											onChange={handleReservationChange}
											required
										/>
										<label htmlFor="numberOfAdults" className="form-label">
											Number of Adults
										</label>
									</div>
									<div className="form-floating mb-3">
										<input
											type="date"
											className="form-control"
											id="checkInDate"
											name="checkInDate"
											placeholder="Check-in Date"
											value={reservationData.checkInDate}
											onChange={handleReservationChange}
											required
										/>
										<label htmlFor="checkInDate" className="form-label">
											Check-in Date
										</label>
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-floating mb-3">
										<input
											type="text"
											className="form-control"
											id="roomNumber"
											name="roomNumber"
											// placeholder="Room Number"
											value={reservationData.roomNumber}
											onChange={handleReservationChange}
											// style={{ pointerEvents: "none" }}
											readOnly
										/>
										<label htmlFor="roomNumber" className="form-label">
											Room Number
										</label>
									</div>

									<div className="form-floating mb-3">
										<input
											type="number"
											className="form-control"
											id="numberOfNights"
											name="numberOfNights"
											// placeholder="Number of Nights"
											value={reservationData.numberOfNights}
											onChange={handleReservationChange}
											readOnly
											required
										/>
										<label htmlFor="numberOfNights" className="form-label">
											Number of Nights
										</label>
									</div>

									<div className="form-floating mb-3">
										<input
											type="date"
											className="form-control"
											id="checkOutDate"
											name="checkOutDate"
											placeholder="Check-out Date"
											value={reservationData.checkOutDate}
											onChange={handleReservationChange}
											required
										/>
										<label htmlFor="checkOutDate" className="form-label">
											Check-out Date
										</label>
									</div>
								</div>
								<div className="form-floating mb-3">
									<select
										className="form-select"
										id="roomType"
										name="roomType"
										value={reservationData.roomType}
										onChange={handleReservationChange}
										disabled={isUpdateMode}
										required
									>
										<option value="">Select room type</option>
										<option value="Standard">Standard</option>
										<option value="Delux">Delux</option>
										<option value="Suites">Suites</option>
									</select>
									<label htmlFor="roomType" className="mx-2">
										Room Type
									</label>
								</div>
							</div>
							{/* Guests */}
							<h3>Guests</h3>
							<button
								type="button"
								className="btn btn-primary"
								onClick={handleAddGuest}
							>
								Add Guest
							</button>
							{guests.map((guest, index) => (
								<div key={index}>
									<h4>Guest {index + 1}</h4>
									<div className="form-floating mb-3">
										<input
											type="text"
											className="form-control"
											id={`guestName${index}`}
											name="name"
											placeholder="Name"
											value={guest.name || ""}
											onChange={(e) => handleGuestChange(index, e)}
											required
										/>
										<label htmlFor={`guestName${index}`} className="form-label">
											Name
										</label>
									</div>
									<div className="form-floating mb-3">
										<input
											type="email"
											className="form-control"
											id={`guestEmail${index}`}
											name="email"
											placeholder="Email"
											value={guest.email || ""}
											onChange={(e) => handleGuestChange(index, e)}
											required
										/>
										<label
											htmlFor={`guestEmail${index}`}
											className="form-label"
										>
											Email
										</label>
									</div>
									<div className="form-floating mb-3">
										<input
											type="number"
											className="form-control"
											id={`guestPhoneNumber${index}`}
											name="phoneNumber"
											placeholder="Phone Number"
											pattern="[0-9]{10}"
											value={guest.phoneNumber || ""}
											onChange={(e) => handleGuestChange(index, e)}
											required
										/>
										<label
											htmlFor={`guestPhoneNumber${index}`}
											className="form-label"
										>
											Phone Number
										</label>
									</div>
									<div className="form-floating mb-3">
										<input
											type="text"
											className="form-control"
											id={`guestAddress${index}`}
											name="address"
											placeholder="Address"
											value={guest.address || ""}
											onChange={(e) => handleGuestChange(index, e)}
											required
										/>
										<label
											htmlFor={`guestAddress${index}`}
											className="form-label"
										>
											Address
										</label>
									</div>
									<div className="form-floating mb-3">
										<select
											className="form-select"
											id={`guestGender${index}`}
											name="gender"
											placeholder="Gener"
											value={guest.gender || ""}
											onChange={(e) => handleGuestChange(index, e)}
											required
										>
											<option value="">Select Gender</option>
											<option value="Male">Male</option>
											<option value="Female">Female</option>
											<option value="Other">Other</option>
										</select>
										<label
											htmlFor={`guestGender${index}`}
											className="form-label"
										>
											Gender
										</label>
									</div>
									<button
										type="button"
										className="btn btn-danger"
										onClick={() => handleRemoveGuest(index, guest)}
									>
										Remove Guest
									</button>
								</div>
							))}

							<div>
								<button type="submit" className="btn btn-success mt-3">
									Submit
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>

			<div className="card mx-4 my-4">
				<div className="card-body">
					<h3>Reservation Details</h3>
					<div className="mb-3">
						<div className="input-group">
							<input
								type="number"
								className="form-control"
								placeholder="Enter Reservation Id"
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
								<th>Room Number</th>
								<th>Guest Details</th>
								<th>Check-in Date</th>
								<th>Check-out Date</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{reservations.map((reservation, index) => (
								<tr key={index}>
									<td>{reservation.roomNumber}</td>
									<td>
										<ol>
											{reservation.guests.map((guest, guestIndex) => (
												<li key={guestIndex}>
													<div>
														<td>Name: {guest.name}</td>
													</div>
													<div>
														<td>Email: {guest.email}</td>
													</div>
													<div>
														<td>Phone Number: {guest.phoneNumber}</td>
													</div>
													<div>
														<td>Address: {guest.address}</td>
													</div>
													<div>
														<td>Gender: {guest.gender}</td>
													</div>
													<hr></hr>
												</li>
											))}
										</ol>
									</td>
									<td>{getFormattedDate(reservation.checkInDate)}</td>
									<td>{getFormattedDate(reservation.checkOutDate)}</td>
									<td>
										<button
											type="button"
											className="btn btn-primary"
											onClick={() =>
												handleUpdateReservation(reservation, reservation.id)
											}
										>
											Update
										</button>
									</td>
									<td>
										<button
											type="button"
											className="btn btn-danger"
											onClick={() => handleDeleteReservation(reservation.id)}
										>
											Delete
										</button>
									</td>
								</tr>
							))}{" "}
						</tbody>
					</table>
				</div>
			</div>

			<ToastContainer />
		</div>
	);
};

export default Reservation;
