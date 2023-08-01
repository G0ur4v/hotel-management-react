import React from "react";
import PaymentService from "../../server/PaymentService";

const Table = ({ items, tableHeading, onDelete, onUpdate, billTable }) => {
	if (items.length === 0) {
		return <div>No items to display.</div>;
	}

	const keys = Object.keys(items[0]).filter((key) => key !== "paid"); // Exclude "paid" key

	const handleDelete = (id) => {
		onDelete(id);
	};

	const handleUpdate = (item) => {
		onUpdate(item);
	};

	const getAmount = (amount) => {
		amount = parseFloat(amount); // Convert amount to a number
		amount = Math.round(amount); // Round the amount to the nearest integer
		// Apply toFixed method
		return amount;
	};

	return (
		<div className="container">
			<h2>{tableHeading}</h2>
			<table className="table">
				<thead>
					<tr>
						{keys.map((key) => (
							<th key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
						))}
						{!billTable && <th>Action</th>}
					</tr>
				</thead>
				<tbody>
					{items.map((item, index) => (
						<tr key={index}>
							{keys.map((key) => (
								<td key={key}>
									{item[key] !== null ? item[key].toString() : ""}
								</td>
							))}
							{!billTable && (
								<td>
									<button
										className="btn btn-primary btn-sm update-btn mx-2"
										onClick={() => handleUpdate(item)}
									>
										Update
									</button>
									<button
										className="btn btn-danger btn-sm delete-btn"
										onClick={() => handleDelete(item.id)}
									>
										Delete
									</button>
								</td>
							)}
							{billTable && !item.paid && (
								<td>
									<PaymentService
										amount={getAmount(item.netAmount)}
										userName={"Gourav Patel"}
										email={"gourav@gmail.com"}
										contact={"8319539388"}
										billId={item.billNumber}
									/>
								</td>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Table;
