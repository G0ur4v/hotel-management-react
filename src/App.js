import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/authentication/Login";
import Registration from "./components/authentication/Registration";
import Dashboard from "./pages/Dashboard";
import Department from "./pages/Department";
import InventoryItem from "./pages/InventoryItem";
import InventoryRoom from "./pages/InventoryRoom";
import InventoryStaff from "./pages/InventoryStaff";
import Reservation from "./pages/Reservation";
import RoomService from "./pages/RoomService";
import Report from "./components/report/Report";

function App() {
	return (
		<div className="App">
			{/* <Navbar /> */}

			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/register" element={<Registration />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/department" element={<Department />} />
				<Route path="/report" element={<Report />} />
				<Route path="/inventory/item" element={<InventoryItem />} />
				<Route path="/inventory/staff" element={<InventoryStaff />} />
				<Route path="/inventory/room" element={<InventoryRoom />} />
				<Route path="/reservation" element={<Reservation />} />
				<Route path="/room-service" element={<RoomService />} />
			</Routes>
		</div>
	);
}

export default App;
