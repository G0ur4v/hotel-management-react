import { Link } from "react-router-dom";

const Navbar = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.href = "/";
	};
	return (
		// <!-- Navbar -->
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			{/* <!-- Container wrapper --> */}
			<div className="container-fluid">
				{/* <!-- Toggle button --> */}
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarSupportedContent"
					aria-controls="navbarSupportedContent"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<i className="fas fa-bars"></i>
				</button>

				{/* <!-- Collapsible wrapper --> */}
				<div className="collapse navbar-collapse" id="navbarSupportedContent">
					{/* <!-- Navbar brand --> */}
					<a className="navbar-brand mt-2 mt-lg-0" href="#">
						<img
							src="https://shorturl.at/flmz4"
							height="45"
							alt="Logo"
							loading="lazy"
						/>
					</a>
					{/* <!-- Left links --> */}
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						<li className="nav-item">
							<Link to="/dashboard" className="nav-link">
								Dashboard
							</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to="/reservation">
								Reservation
							</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to="/room-service">
								Room-Service
							</Link>
						</li>
						<li className="nav-item dropdown">
							<a
								className="nav-link dropdown-toggle"
								href="#"
								id="navbarDropdownInventory"
								role="button"
								data-bs-toggle="dropdown"
								aria-expanded="false"
							>
								Inventory
							</a>
							<ul
								className="dropdown-menu"
								aria-labelledby="navbarDropdownInventory"
							>
								<li>
									<Link className="dropdown-item" to="/inventory/item">
										Item
									</Link>
								</li>
								<li>
									<Link className="dropdown-item" to="/inventory/room">
										Room
									</Link>
								</li>
								<li>
									<Link className="dropdown-item" to="/inventory/staff">
										Staff
									</Link>
								</li>
							</ul>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to="/department">
								Department
							</Link>
						</li>
						{/* <li className="nav-item">
							<Link className="nav-link" to="/report">
								Report
							</Link>
						</li> */}
					</ul>
					{/* <!-- Left links --> */}
				</div>
				{/* <!-- Collapsible wrapper --> */}

				{/* <!-- Right elements --> */}
				<div className="d-flex align-items-center">
					{/* <!-- Avatar --> */}
					<div className="dropdown">
						<a
							className="dropdown-toggle d-flex align-items-center hidden-arrow"
							href="#"
							id="navbarDropdownMenuAvatar"
							role="button"
							data-bs-toggle="dropdown"
							aria-expanded="false"
						>
							<img
								src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
								className="rounded-circle"
								height="25"
								alt="Black and White Portrait of a Man"
								loading="lazy"
							/>
						</a>
						<ul
							className="dropdown-menu dropdown-menu-end"
							aria-labelledby="navbarDropdownMenuAvatar"
						>
							<li>
								<a className="dropdown-item" href="#">
									My profile
								</a>
							</li>
							<li>
								<a className="dropdown-item" href="#">
									Settings
								</a>
							</li>
							<li>
								<a className="dropdown-item" href="#" onClick={handleLogout}>
									Logout
								</a>
							</li>
						</ul>
					</div>
				</div>
				{/* <!-- Right elements --> */}
			</div>
			{/* <!-- Container wrapper --> */}
		</nav>

		// <!-- Navbar -->
	);
};

export default Navbar;
