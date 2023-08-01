import axiosInstance from "../interceptor/AxiosInstance";

const INVENTORY_BASE_URL = "http://localhost:8005/inventory";
const AUTH_BASE_URL = "http://localhost:8005/auth";

class InventoryService {
	// ITEM CONTROLLER
	addItem(item) {
		return axiosInstance.post(INVENTORY_BASE_URL + "/addItem", item);
	}

	updateItem(item, id) {
		return axiosInstance.put(INVENTORY_BASE_URL + "/updateItem/" + id, item);
	}

	deleteItem(id) {
		return axiosInstance.delete(INVENTORY_BASE_URL + "/deleteItem/" + id);
	}

	getItems() {
		console.log("-----------------inside inventory method-----------");
		return axiosInstance.get(INVENTORY_BASE_URL + "/getItems");
	}

	getItemById(id) {
		console.log("-----------------inside inventory method-----------");
		return axiosInstance.get(INVENTORY_BASE_URL + "/getItems/" + id);
	}

	//  ROOM CONTROLLER

	addRoom(room) {
		return axiosInstance.post(INVENTORY_BASE_URL + "/addRoom", room);
	}

	updateRoom(room, id) {
		return axiosInstance.put(INVENTORY_BASE_URL + "/updateRoom/" + id, room);
	}

	deleteRoom(id) {
		return axiosInstance.delete(INVENTORY_BASE_URL + "/deleteRoom/" + id);
	}

	getRooms() {
		console.log("-----------------inside inventory method-----------");
		return axiosInstance.get(INVENTORY_BASE_URL + "/getAllRooms");
	}

	getRoomByRoomNumber(roomNumber) {
		return axiosInstance.get(
			INVENTORY_BASE_URL + "/getRoomByRoomNumber/" + roomNumber
		);
	}

	// STAFF CONTROLLER
	addStaff(staff) {
		return axiosInstance.post(INVENTORY_BASE_URL + "/addStaff", staff);
	}

	updateStaff(staff, id) {
		return axiosInstance.put(INVENTORY_BASE_URL + "/updateStaff/" + id, staff);
	}

	deleteStaff(id) {
		return axiosInstance.delete(INVENTORY_BASE_URL + "/deleteStaff/" + id);
	}

	getAllStaff() {
		console.log("-----------------inside inventory method-----------");
		return axiosInstance.get(INVENTORY_BASE_URL + "/getAllStaff");
	}
}

export default new InventoryService();
