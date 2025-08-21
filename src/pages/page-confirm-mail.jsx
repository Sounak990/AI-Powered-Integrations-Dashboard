import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

// import images
// import logodark from "../assets/images/logo-dark.png";
// import logolight from "../assets/images/logo-light.png";
import chainwideLogo from "../assets/images/chainwide/logo-dark.png"

const ConfirmMail = () => {
	//meta title
	document.title = "Confirm Mail | Chainwide - AI Middleware";

	return (
		<React.Fragment>
			<div className="account-pages my-5 pt-sm-5">
				<Container>
					<Row>
						<Col lg={12}>
							<div className="text-center mb-5 text-muted flex sm:flex-row flex-col">
								<Link to="dashboard" className="d-block auth-logo">
									<img src={chainwideLogo} alt="" className=" mx-auto w-80" />
								</Link>
								<p className="mt-3 text-white">Unlock Seamless AI Integration with Just an API Key today!</p>
							</div>
						</Col>
					</Row>
					<Row className="justify-content-center">
						<Col md={8} lg={6} xl={5}>
							<Card className="bg-card-color rounded-xl" >
								<CardBody>
									<div className="p-2 bg-card-color text-white">
										<div className="text-center flex flex-row gap-2 justify-between">
											<div className="avatar-md mx-auto min-w-fit">
												<div className="avatar-title rounded-circle bg-light aspect-square">
													<i className="bx bx-mail-send h1 mb-0 text-primary"></i>
												</div>
											</div>
											<div className="p-2 mt-3">
												<h4>Success !</h4>
												<div className="mt-4">
													<Link to="/login" className="btn btn-success">
														Back to Login
													</Link>
												</div>
											</div>
										</div>
									</div>
								</CardBody>
							</Card>
							<div className="mt-5 text-center">
								<p>© {new Date().getFullYear()} Chainwide</p>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
		</React.Fragment>
	);
};

export default ConfirmMail;
