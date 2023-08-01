import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Table from "../util/Table";
import ReservationService from "../../server/ReservationService";
import PaymentService from "../../server/PaymentService";

const BillForm = () => {
	const navigate = useNavigate();
	const [billData, setBillData] = useState({
		guestName: "",
		phoneNumber: "",
		roomNumber: "",
	});
	const [bills, setBills] = useState([]);

	useEffect(() => {
		fetchBils();
	}, []);

	const fetchBils = () => {
		ReservationService.getNotPaidBills()
			.then((response) => {
				const formattedBills = response.data.map((bill) => ({
					...bill,
					billDate: getFormattedDate(bill.billDate),
					netAmount: Math.round(bill.netAmount),
					taxes: Math.round(bill.taxes),
					totalAmount: Math.round(bill.totalAmount),
				}));
				setBills(formattedBills);

				console.log("---------fetched Bills--", response.data);
			})
			.catch((error) => {
				console.log(error);
				navigate("/");
			});
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setBillData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Perform actions with the form data
		console.log(billData);
		if (!validateContactNumber(billData.phoneNumber)) {
			toast.error("Enter valid phone number");
			return;
		}
		// setBills([...bills, billData]);
		ReservationService.generateBill(billData)
			.then((response) => {
				if (response.data.success) {
					response.data.bill.billDate = getFormattedDate(
						response.data.bill.billDate
					);
					response.data.bill.netAmount =
						response.data.bill.netAmount.toFixed(2);
					fetchBils();
					toast.success(response.data.message);

					// setBills([...bills, response.data.bill]);
				} else {
					toast.error(response.data.message);
				}
				console.log("Response data---", response.data.bill);
			})
			.catch((error) => {
				console.log(error);
				navigate("/");
			});
		// Reset form fields
		setBillData({
			guestName: "",
			phoneNumber: "",
			roomNumber: "",
		});
	};

	const getFormattedDate = (dateString) => {
		const date = new Date(dateString);
		const formattedDate = date.toISOString().split("T")[0];
		return formattedDate;
	};

	const validateContactNumber = (contactNumber) => {
		const contactNumberRegex = /^[0-9]{10}$/;
		return contactNumberRegex.test(contactNumber);
	};

	return (
		<div className="my-4">
			<div
				className="d-flex justify-content-center "
				// style={{ minHeight: "100vh" }}
			>
				<div className="card shadow" style={{ width: "40%" }}>
					<div className="card-body">
						<h5 className="card-title">Bill Form</h5>
						<form onSubmit={handleSubmit}>
							<div className="form-floating mb-3">
								<input
									type="text"
									className="form-control"
									id="guestName"
									name="guestName"
									value={billData.guestName}
									placeholder="Guest Name"
									onChange={handleChange}
									required
								/>
								<label htmlFor="guestName">Guest Name</label>
							</div>
							<div className="form-floating mb-3">
								<input
									type="number"
									className="form-control"
									id="phoneNumber"
									name="phoneNumber"
									pattern="[0-9]{10}"
									value={billData.phoneNumber}
									placeholder="Phone Number"
									onChange={handleChange}
									required
								/>
								<label htmlFor="phoneNumber">Phone Number</label>
							</div>
							<div className="form-floating mb-3">
								<input
									type="number"
									className="form-control"
									id="roomNumber"
									name="roomNumber"
									placeholder="Room Number"
									value={billData.roomNumber}
									onChange={handleChange}
									required
								/>
								<label htmlFor="roomNumber">Room Number</label>
							</div>
							<button type="submit" className="btn btn-primary">
								Generate Bill
							</button>
							{/* amount, userName, email, contact */}
						</form>
					</div>
				</div>
			</div>

			<div className="d-flex justify-content-center ">
				<div className="card mt-4 shadow " style={{ minWidth: "40%" }}>
					<div className="card-body">
						<h3 className="card-title">Bill Details</h3>
						<Table items={bills} billTable={true} />
					</div>
				</div>
			</div>
			<ToastContainer />
		</div>
	);
};

export default BillForm;
