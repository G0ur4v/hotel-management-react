import React, { useEffect, useState } from "react";
import Navbar from "../components/util/Navbar";
import Table from "../components/util/Table";
import InventoryService from "../server/InventoryService";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InventoryItem = () => {
	const navigate = useNavigate();
	const [items, setItems] = useState([]);
	const [isUpdating, setIsUpdating] = useState(false);
	const [updatingId, setUpdatingId] = useState(null);

	const fetchItems = () => {
		InventoryService.getItems()
			.then((response) => {
				console.log("Items----------------", response.data);
				setItems([...response.data]);
			})
			.catch((error) => {
				navigate("/");
				console.log("inside fetch------- Items ", error.data);
			});
	};

	useEffect(() => {
		fetchItems();
	}, []);

	const handleSubmit = (event) => {
		event.preventDefault();
		const name = event.target.elements.name.value;
		const description = event.target.elements.description.value;
		const quantity = event.target.elements.quantity.value;
		const price = event.target.elements.price.value;

		if (isUpdating && updatingId) {
			const updatedItem = {
				name,
				description,
				quantity,
				price,
			};

			// call the update api----
			InventoryService.updateItem(updatedItem, updatingId)
				.then((response) => {
					if (response.data.success) {
						fetchItems();
						toast.success(response.data.message);
					} else {
						// show toast
						toast.error(response.data.message);
					}
					console.log(response.headers);
				})
				.catch((error) => {
					navigate("/");
					console.log(error.data);
					setIsUpdating(false);
					setUpdatingId(null);
				});

			setIsUpdating(false);
			setUpdatingId(null);
		} else {
			const newItem = {
				name,
				description,
				quantity,
				price,
			};

			InventoryService.addItem(newItem)
				.then((response) => {
					if (response.data.success) {
						fetchItems();
						toast.success(response.data.message);
					} else {
						// show toast
						toast.error(response.data.message);
					}
					console.log(response.headers);
				})
				.catch((error) => {
					navigate("/");
					console.log(error.data);
				});
		}
		event.target.reset();
	};

	const handleDelete = (id) => {
		InventoryService.deleteItem(id)
			.then((response) => {
				if (response.data.success) {
					fetchItems();
					toast.success(response.data.message);
				} else {
					// show toast
					toast.error(response.data.message);
				}
			})
			.catch((error) => {
				console.log(error.data);
			});
	};

	const handleUpdate = (item) => {
		console.log("---------update Department ---", item.id);
		// want to set value in the form
		document.getElementById("name").value = item.name;
		document.getElementById("description").value = item.description;
		document.getElementById("quantity").value = item.quantity;
		document.getElementById("price").value = item.price;
		setIsUpdating(true);
		setUpdatingId(item.id);
	};

	return (
		<div
			style={{
				background: `url('https://shorturl.at/axLN1') no-repeat center center fixed`,
				backgroundSize: "cover",
				height: "100vh",
			}}
		>
			<Navbar />
			<h1>Inventory Item</h1>
			<div
				className="card-container"
				style={{
					width: "70%",
					margin: "0 auto",
				}}
			>
				<div
					className="card"
					style={{
						boxShadow:
							"0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
						opacity: "0.9",
					}}
				>
					<div className="card-body">
						<h2 className="card-title text-center">
							{isUpdating ? "Update Item" : "Add Item"}
						</h2>
						<form onSubmit={handleSubmit}>
							<div className="form-floating mb-3">
								<input
									type="text"
									className="form-control"
									id="name"
									placeholder="Enter item name"
									required
								/>
								<label htmlFor="name">Name</label>
							</div>
							<div className="form-floating mb-3">
								<textarea
									className="form-control"
									id="description"
									rows="3"
									placeholder="Enter item description"
									required
								></textarea>
								<label htmlFor="description">Description</label>
							</div>
							<div className="form-floating mb-3">
								<input
									type="number"
									className="form-control"
									id="quantity"
									placeholder="Enter quantity"
									required
								/>
								<label htmlFor="quantity">Quantity</label>
							</div>
							<div className="form-floating mb-3">
								<input
									type="number"
									step="0.01"
									className="form-control"
									id="price"
									placeholder="Enter price"
									required
								/>
								<label htmlFor="price">Price</label>
							</div>
							<button type="submit" className="btn btn-primary">
								{isUpdating ? "Update" : "Submit"}
							</button>
						</form>
					</div>
				</div>
				<div className="card mt-4">
					<div className="card-body">
						<h3 className="card-title">Inventory Items</h3>
						<Table
							items={items}
							onDelete={handleDelete}
							onUpdate={handleUpdate}
						/>
					</div>
				</div>
			</div>
			<ToastContainer />
		</div>
	);
};

export default InventoryItem;
