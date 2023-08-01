import axiosInstance from "../interceptor/AxiosInstance";

const ROOM_BASE_URL = "http://localhost:8005/room";
const AUTH_BASE_URL = "http://localhost:8005/auth";

class Room {
	addRoomService(roomService) {
		return axiosInstance.post(ROOM_BASE_URL + "/addRoomService", roomService);
	}

	updateRoomService(roomService, id) {
		return axiosInstance.put(
			ROOM_BASE_URL + "/updateRoomService/" + id,
			roomService
		);
	}

	deleteRoomService(id) {
		return axiosInstance.delete(ROOM_BASE_URL + "/deleteRoomService/" + id);
	}

	getActiveRoomServices() {
		return axiosInstance.get(ROOM_BASE_URL + "/getActiveRoomServices");
	}

	getActiveRoomServiceByRoomNumber(roomNumber, completed) {
		return axiosInstance.get(
			ROOM_BASE_URL + "/getRoomService/" + roomNumber + "/" + completed
		);
	}

	removeOrderedItem(id) {
		return axiosInstance.delete(ROOM_BASE_URL + "/deleteOrderedItemById/" + id);
	}
}

export default new Room();
