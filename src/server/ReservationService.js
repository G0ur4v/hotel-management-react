import axiosInstance from "../interceptor/AxiosInstance";

const RESERVATION_BASE_URL = "http://localhost:8005/reservation";
const AUTH_BASE_URL = "http://localhost:8005/auth";

class ReservationService {
	addReservation(reservation) {
		return axiosInstance.post(
			RESERVATION_BASE_URL + "/addReservation",
			reservation
		);
	}

	updateReservation(reservation, id) {
		return axiosInstance.put(
			RESERVATION_BASE_URL + "/updateReservation/" + id,
			reservation
		);
	}

	deleteReservation(id) {
		return axiosInstance.delete(
			RESERVATION_BASE_URL + "/deleteReservation/" + id
		);
	}

	getAvailableRooms() {
		return axiosInstance.get(RESERVATION_BASE_URL + "/getAvailableRooms");
	}

	getReservationById(reservationId) {
		return axiosInstance.get(
			RESERVATION_BASE_URL + "/getReservationById/" + reservationId
		);
	}

	getActiveReservations() {
		return axiosInstance.get(RESERVATION_BASE_URL + "/getActiveReservations");
	}

	generateBill(bill) {
		return axiosInstance.post(RESERVATION_BASE_URL + "/generateBill", bill);
	}

	getNotPaidBills() {
		return axiosInstance.get(RESERVATION_BASE_URL + "/getNotPaidBills");
	}

	setPaidForBill(billId) {
		return axiosInstance.post(
			RESERVATION_BASE_URL + "/setPaidForBill/" + billId
		);
	}

	getReport(days) {
		return axiosInstance.get(RESERVATION_BASE_URL + "/report/" + days);
	}

	removeGuest(guestId) {
		return axiosInstance.delete(
			RESERVATION_BASE_URL + "/deleteGuest/" + guestId
		);
	}

	getPaymentOrderId(amount) {
		return axiosInstance.get("http://localhost:8005/payment/" + amount);
	}
}

export default new ReservationService();
