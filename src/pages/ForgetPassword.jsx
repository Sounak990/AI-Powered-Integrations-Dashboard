import React, { useEffect } from "react";
import { Row, Col, CardBody, Card, Alert, Container, Form, Label, FormFeedback } from "reactstrap";
import { Input } from "@/components/ui/input";
import { useNavigate, Link } from 'react-router-dom';
import * as Yup from "yup";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { resetPassword, resetPasswordFailure } from "../store/forget-password/actions"; // Import resetPassword action
import profileImg from "../assets/images/profile-img.png";
import logoImg from "../assets/images/logo.svg";
import chainwideLogo from "../assets/images/chainwide/logo-125.png";
import { Button } from "@/components/ui/button";

const ForgetPasswordPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { resetSuccess, resetError, loading } = useSelector(state => ({
        resetSuccess: state.resetPasswordReducer.message,
        resetError: state.resetPasswordReducer.error,
        loading: state.resetPasswordReducer.loading,
    }));

    useEffect(() => {
        if (resetSuccess && !loading) {
            navigate('/auth-email-verification'); // Navigate to success page
        }
    }, [resetSuccess, loading, navigate]);

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Invalid email address format")
                .required("Please Enter Your Email"),
        }),
        onSubmit: (values) => {
            dispatch(resetPassword(values.email)); // Dispatch the resetPassword action
        }
    });
  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="fas fa-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden bg-[#04051B]">
                <div className="bg-primaryColor/20">
                  <Row>
                    <Col className="col-7">
                      <div className="text-primaryColor p-4">
                        <h5 className="text-primaryColor">Welcome Back !</h5>
                        <p>Sign in to continue to Chainwide.</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profileImg} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-transparent backdrop-brightness-50">
                          <img
                            src={chainwideLogo}
                            alt=""
                            className="rounded-circle"
                            height="34"
                          />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                {/* Include Alert for Success or Error Messages */} 
                    {resetSuccess && <Alert color="success">Password reset email sent successfully.</Alert>}
                    {resetError && <Alert color="danger">{resetError}</Alert>}
                    <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <div className="mb-3">
                        <Label className="form-label text-white">Email</Label>
                        <Input
                          name="email"
                          className="text-slate-200"
                          placeholder="Enter email"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email ? true : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                        ) : null}
                      </div>
                      <Row className="mb-3">
                        <Col className="text-end">
                          <Button
                            type="submit"
                          >
                            Reset
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Go back to{" "}
                  <Link
                    to="/login"
                    className="font-weight-medium text-primary"
                  >
                    Login
                  </Link>{" "}
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
  );
};

export default ForgetPasswordPage;
