import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Authentication from "../../server/Authentication";
const Login = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		username: "",
		// email: "",
		password: "",
	});

	const [isFormSubmitted, setIsFormSubmitted] = useState(false); // state variable for form submission status
	const [isError, setIsError] = useState(false); // state variable for error status
	const [validationErrors, setValidationErrors] = useState({});
	const [response, setResponse] = useState();

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		const errors = {};

		if (!formData.username.trim()) {
			errors.username = "Username is required";
		}

		// if (!formData.email.trim()) {
		// 	errors.email = "Email is required";
		// } else if (!isValidEmail(formData.email)) {
		// 	errors.email = "Invalid email format";
		// }

		if (!formData.password.trim()) {
			errors.password = "Password is required";
		}

		if (Object.keys(errors).length > 0) {
			setValidationErrors(errors);
		} else {
			// Perform login logic or API call

			Authentication.loginUser(formData)
				.then((response) => {
					// login success logic
					setResponse(response);
					if (response.data.success) {
						setIsFormSubmitted(true);
						// setting the token in local storage
						localStorage.setItem("token", response.data.token);
						console.log("token generated ----- " + response.data.token);
						// redirecting to dashboard
						navigate("/dashboard");
					} else {
						setIsError(true);
					}
					console.log(response.data);
				})
				.catch((error) => {
					// login error logic
					// setResponse(response);
					// // setIsError(true); // set the error status to true
					console.log(error.data);
				});

			console.log("Form submitted:", formData);
			// Reset form data and validation errors
			setFormData({
				username: "",
				// email: "",
				password: "",
			});
			setValidationErrors({});
		}
	};

	const isValidEmail = (email) => {
		// Basic email format validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	return (
		<section className="vh-100" style={{ backgroundColor: "#eee" }}>
			<div className="container h-100">
				<div className="row d-flex justify-content-center align-items-center h-100">
					<div className="col-lg-12 col-xl-11">
						<div className="card text-black" style={{ borderRadius: "25px" }}>
							<div className="card-body p-md-5">
								<div className="row justify-content-center">
									<div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
										<p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
											Login
										</p>
										{isFormSubmitted && (
											<div className="alert alert-success" role="alert">
												{response.data.message}
											</div>
										)}
										{isError && (
											<div className="alert alert-danger" role="alert">
												Failed to submit the form. Please try again.
												<br />
												{response.data.message}
											</div>
										)}

										<form className="mx-1 mx-md-4" onSubmit={handleSubmit}>
											<div className="d-flex flex-row align-items-center mb-4">
												<i className="fas fa-user fa-lg me-3 fa-fw"></i>
												<div className="form-outline flex-fill mb-0">
													<input
														type="text"
														id="username"
														name="username"
														className="form-control"
														placeholder="Username"
														value={formData.username}
														onChange={handleInputChange}
													/>
													{validationErrors.username && (
														<div className="text-danger">
															{validationErrors.username}
														</div>
													)}
												</div>
											</div>

											{/* <div className="d-flex flex-row align-items-center mb-4">
													<i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
													<div className="form-outline flex-fill mb-0">
														<input
															type="email"
															id="email"
															name="email"
															className="form-control"
															placeholder="Your Email"
														/>
													</div>
												</div> */}

											<div className="d-flex flex-row align-items-center mb-4">
												<i className="fas fa-lock fa-lg me-3 fa-fw"></i>
												<div className="form-outline flex-fill mb-0">
													<input
														type="password"
														id="password"
														name="password"
														className="form-control"
														placeholder="Password"
														value={formData.password}
														onChange={handleInputChange}
													/>
													{validationErrors.password && (
														<div className="text-danger">
															{validationErrors.password}
														</div>
													)}
												</div>
											</div>

											{/* <div className="d-flex flex-row align-items-center mb-4">
												<i className="fas fa-users fa-lg me-3 fa-fw"></i>
												<div className="form-outline flex-fill mb-0">
													<select
														className="form-select"
														id="role"
														aria-label="Role"
													>
														<option value="">Select Role</option>
														<option value="ROLE_ADMIN">Admin</option>
														<option value="ROLE_MANAGER">Manager</option>
														<option value="ROLE_RECEPTIONIST">
															Receptionist
														</option>
													</select>
												</div>
											</div> */}

											<div className="d-flex justify-content-center  mb-3 mb-lg-4">
												<i class="fas fa-sign-in-alt fa-lg mt-3 fa-fw"></i>
												<button
													type="submit"
													className="btn btn-primary btn-md "
													style={{ width: "100%", marginLeft: "5%" }}
												>
													Login
												</button>
											</div>
											<div className="form-check d-flex justify-content-center mb-5">
												<label className="form-check-label">
													(Don't have a account)
													<Link to="/register" className="nav-link">
														Register Now
													</Link>
												</label>
											</div>
										</form>
									</div>
									<div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
										<img
											src="https://rb.gy/ussc3"
											className="img-fluid"
											alt="Sample image"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Login;
