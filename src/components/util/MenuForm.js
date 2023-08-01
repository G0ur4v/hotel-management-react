import React, { useState } from "react";

const MenuForm = ({ onCheckboxChange }) => {
	const [menuItems, setMenuItems] = useState([
		{ id: 1, name: "Item 1", price: 10.99 },
		{ id: 2, name: "Item 2", price: 8.99 },
		{ id: 3, name: "Item 3", price: 12.99 },
	]);

	const handleCheckboxChange = (item) => {
		// Invoke the onCheckboxChange function passed as prop to RoomService
		onCheckboxChange(item);
	};

	return (
		<div>
			<h4>Menu</h4>
			<form>
				{menuItems.map((item) => (
					<div key={item.id} className="form-check">
						<input
							className="form-check-input"
							type="checkbox"
							id={`menuItem_${item.id}`}
							onChange={() => handleCheckboxChange(item)}
						/>
						<label className="form-check-label" htmlFor={`menuItem_${item.id}`}>
							{item.name} - ${item.price}
						</label>
					</div>
				))}
			</form>
		</div>
	);
};

export default MenuForm;
