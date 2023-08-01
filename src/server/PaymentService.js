import React, { useState } from "react";
import useRazorpay from "react-razorpay";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReservationService from "./ReservationService";

const PaymentService = ({ amount, userName, email, contact, billId }) => {
	const navigate = useNavigate();
	const [order, setOrder] = useState();
	const [paymentSuccess, setPaymentSuccess] = useState(false);
	const [buttonText, setButtonText] = useState("Make Payment");
	const [buttonColor, setButtonColor] = useState("btn-primary");
	// const createOrder = async (amount) => {
	// 	return await fetch("http://localhost:8006/payment/" + amount, {
	// 		mode: "no-cors",
	// 		method: "GET",
	// 	});
	// };

	const setPaidForBill = (billId) => {
		ReservationService.setPaidForBill(billId)
			.then((response) => {
				if (response.data.success) {
					toast.success("Payment Success!");
					setPaymentSuccess(true);
					setButtonText("Paid");
					setButtonColor("btn-success");
				} else {
					toast.error("Payment Failed!");
				}
			})
			.catch((error) => {
				console.log(error);
				navigate("/");
			});
	};

	const Razorpay = useRazorpay();

	const handlePayment = async () => {
		ReservationService.getPaymentOrderId(amount)
			.then((response) => {
				setOrder(response.data);
			})
			.catch((error) => {
				// navigate("/");
			});
		console.log("---------amount inside payment-------", order);

		const options = {
			key: "rzp_test_Uj39upN4G9uX5p",
			amount: amount * 100,
			currency: "INR",
			name: userName,
			description: "Test Transaction",
			image: "",
			order_id: order,
			handler: function (response) {
				// Payment success logic

				// Access payment details from the response object
				const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
					response;
				// Perform any additional actions based on the payment success
				setPaidForBill(billId);

				// TODO: Call an API endpoint to handle the payment success and perform necessary server-side actions
			},
			prefill: {
				name: userName,
				email: email,
				contact: contact,
			},
			notes: {
				address: "ABC, Delhi",
			},
			theme: {
				color: "#3399cc",
			},
		};

		const rzp1 = new Razorpay(options);

		rzp1.on("payment.failed", function (response) {
			// Payment failure logic
			toast.error("Payment Failed!");
			// Access error details from the response object
			const {
				error: { code, description, source, step, reason },
				metadata: { order_id, payment_id },
			} = response;
			// Perform any additional actions based on the payment failure

			// TODO: Call an API endpoint to handle the payment failure and perform necessary server-side actions
		});

		rzp1.open();
	};

	return (
		<div>
			<button
				className={`btn btn-sm ${buttonColor}`}
				onClick={paymentSuccess ? undefined : handlePayment}
				disabled={paymentSuccess}
			>
				{buttonText}
			</button>
			<ToastContainer />
		</div>
	);
};

export default PaymentService;
