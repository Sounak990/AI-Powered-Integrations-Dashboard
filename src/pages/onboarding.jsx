import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { submitOnboardingForm } from "../store/actions";
import { Card, CardBody, Col, Container, Row } from "reactstrap"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import chainwideLogo from "../assets/images/chainwide/logo-dark.png"

const FormLayouts = () => {
	const [tenant, setTenant] = useState('');
	const [error, setError] = useState('');
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!tenant.trim()) {
			setError('Tenant field is required');
			return;
		}
		dispatch(submitOnboardingForm({ tenant }, navigate));
	};

	// Custom styles
	const styles = {
		container: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			height: '100vh',
		},
		card: {
			border: '1px solid #ddd',
			borderRadius: '4px',
			padding: '20px',
			width: '100%',
			maxWidth: '400px',
			marginBottom: '20px',
			boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
			backgroundColor: '#fff',
		},
		title: {
			textAlign: 'center',
			marginBottom: '20px',
		},
		input: {
			width: '100%',
			padding: '10px',
			marginBottom: '10px',
			borderRadius: '4px',
			border: '1px solid #ccc',
		},
		button: {
			width: '100%',
			padding: '10px',
			border: 'none',
			borderRadius: '4px',
			backgroundColor: '#007bff',
			color: '#fff',
			cursor: 'pointer',
		},
		error: {
			color: 'red',
			textAlign: 'center',
			marginBottom: '10px',
		}
	};

	return (
		<div style={styles.container}>
			<Container>
				<Row className="justify-content-center">
					<Col md={8} lg={6} xl={5}>
						<Card className="bg-card-color rounded-xl" >
							<CardBody>
								<div className="p-2 bg-card-color text-white">
									<img
										src={chainwideLogo}
										alt=""
										className=" mx-auto w-64"
									/>
									<h4 style={styles.title} className="text-lg">Onboarding</h4>
									<form onSubmit={handleSubmit}>
										<div>
											<Input
												style={styles.input}
												type="text"
												name="tenant"
												placeholder="Enter Your Tenant Name"
												value={tenant}
												onChange={(e) => setTenant(e.target.value)}
											/>
											{error && <div style={styles.error}>{error}</div>}
										</div>
										<Button type="submit" className="w-full">Submit</Button>
									</form>
								</div>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
		// <Card className="bg-card-color rounded-xl" >
		// 	<CardBody>
		// 		<div className="p-2 bg-card-color text-white">
		// 			<h5 style={styles.title}>Chainwide Onboarding</h5>
		// 			<form onSubmit={handleSubmit}>
		// 				<div>
		// 					<input
		// 						style={styles.input}
		// 						type="text"
		// 						name="tenant"
		// 						placeholder="Enter Your Tenant Name"
		// 						value={tenant}
		// 						onChange={(e) => setTenant(e.target.value)}
		// 					/>
		// 					{error && <div style={styles.error}>{error}</div>}
		// 				</div>
		// 				<button type="submit" style={styles.button}>Submit</button>
		// 			</form>
		// 		</div>
		// 	</CardBody>
		// </Card>
		// <div style={styles.container}>
		//   <div style={styles.card}>
		//     <h5 style={styles.title}>Chainwide Onboarding</h5>
		//     <form onSubmit={handleSubmit}>
		//       <div>
		//         <input
		//           style={styles.input}
		//           type="text"
		//           name="tenant"
		//           placeholder="Enter Your Tenant Name"
		//           value={tenant}
		//           onChange={(e) => setTenant(e.target.value)}
		//         />
		//         {error && <div style={styles.error}>{error}</div>}
		//       </div>
		//       <button type="submit" style={styles.button}>Submit</button>
		//     </form>
		//   </div>
		// </div>
	);
};

export default FormLayouts;
