import React, { useEffect, useState } from "react";
import Navbar from "../util/Navbar";
import "./Report.css";
import ReservationService from "../../server/ReservationService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Report = () => {
	const [data, setData] = useState({ reservations: 0, revenue: 0 });
	const [days, setDays] = useState("30");

	const fetchReport = () => {
		ReservationService.getReport(days)
			.then((response) => {
				setData(response.data);
				console.log("---------fetched report --", response.data);
				toast.success("Report Fetched");
			})
			.catch((error) => {
				console.log(error);
				// navigate("/");
			});
	};
	useEffect(() => {
		fetchReport();
	}, []);

	const handleFetchReport = () => {
		fetchReport(days);
	};
	// Function to handle changes in the input field
	const handleDaysChange = (e) => {
		setDays(e.target.value);
	};

	return (
		<div>
			<div style={{ maxWidth: "600px", margin: "0 auto" }}></div>
			<div class="container d-flex align-items-center justify-content-center flex-wrap">
				<div class="box">
					<div class="body">
						<div class="imgContainer">
							<img src="https://shorturl.at/ltDN2" alt="" />
						</div>
						<div class="content d-flex flex-column align-items-center justify-content-center">
							<div>
								<h3 class="text-white fs-5">Total Sales</h3>
								<p class="fs-6 text-white">{data.revenue.toFixed(2)}</p>
							</div>
						</div>
					</div>
				</div>
				<div class="box">
					<div class="body">
						<div class="imgContainer">
							<img src="https://shorturl.at/jHKO7" alt="" />
						</div>
						<div class="content d-flex flex-column align-items-center justify-content-center">
							<div>
								<h3 class="text-white fs-5">Total Reservation</h3>
								<p class="fs-6 text-white">{data.reservations}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* add a input feild with floating labels to in input for noOfDays */}
			<div className="container mt-4">
				<div className="row justify-content-center">
					<div className="col-md-6">
						<div className="form-floating mb-3">
							<input
								type="text"
								className="form-control"
								id="days"
								name="days"
								value={days}
								placeholder="Enter Days"
								onChange={handleDaysChange}
								required
							/>
							<label htmlFor="noOfDays">Enter Days</label>
						</div>
					</div>
					<div className="col-md-6">
						<button className="btn btn-primary" onClick={handleFetchReport}>
							Fetch Report
						</button>
					</div>
				</div>
			</div>
			<ToastContainer />
		</div>
	);
};

export default Report;
