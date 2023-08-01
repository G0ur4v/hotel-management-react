import BillForm from "../components/bill/BillForm";
import Navbar from "../components/util/Navbar";

const Dashboard = () => {
	return (
		<div
			style={{
				background: `url('https://shorturl.at/axLN1') no-repeat center center fixed`,
				backgroundSize: "cover",
				height: "100vh",
				overflow: "auto",
			}}
		>
			<Navbar />
			<BillForm />
		</div>
	);
};

export default Dashboard;
