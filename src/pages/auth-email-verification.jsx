import React from "react"
import { Link } from "react-router-dom"
import { Card, CardBody, Col, Container, Row } from "reactstrap"

// import images
// import logodark from "../assets/images/logo-dark.png"
// import logolight from "../assets/images/logo-light.png"
import chainwideLogo from "../assets/images/chainwide/logo-dark.png"

const EmailVerification = () => {

  //meta title
  document.title="Email Verification | Chainwide - Future of Sales";

  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mb-5 text-muted flex sm:flex-row flex-col">
                <Link to="dashboard" className="d-block auth-logo">
                  <img
                    src={chainwideLogo}
                    alt=""
                    className=" mx-auto w-80"
                  />
                </Link>
                <p className="mt-2 text-white">Unlock Seamless AI Integration with Just an API Key today!</p>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="bg-card-color rounded-xl" >
                <CardBody>
                  <div className="p-2 bg-card-color text-white">
                    <div className="text-center flex flex-row gap-4">
                      <div className="avatar-md mx-auto min-w-fit">
                        <div className="avatar-title rounded-circle bg-light aspect-square">
                          <i className="bx bxs-envelope h1 mb-0 text-primary"></i>
                        </div>
                      </div>
                      <div className="p-2 break-normal">
                        <h4>Verify your email</h4>
                        <p>
                          {/* <span className="fw-semibold">
                            example@abc.com
                          </span> */}
                          Please check your Inbox or Spam folder for the verification link.
                        </p>
                        {/* <div className="mt-4">
                          <a
                            href="/"
                            className="btn btn-success w-md"
                          >
                            Verify email
                          </a>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Didn&apos;t receive an email ?{" "}
                  <a href="#" className="fw-medium text-primary">
                    {" "}
                    Resend{" "}
                  </a>{" "}
                </p>
                <p>
                  © {new Date().getFullYear()} Chainwide
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}
export default EmailVerification
