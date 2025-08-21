import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  Col,
  Container,
  Row,
  CardBody,
  CardTitle,
  Label,
  Button,
  Form,
  Input,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { submitSupportForm } from "../../store/support/actions";

const Support = props => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector(state => state.supportReducer); // Replace 'supportReducer' with your actual reducer name

  const tenantId = useSelector(state => 
    state.onboardingReducer.data?.tenant_id || state.login.user?.tenant_id
    );

    const username = useSelector(state => 
    state.login.user?.username
    );

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const supportFormData = {
        full_name: formData.fullName,  // Change key to match the backend model
        email: formData.email,
        message: formData.message
    };
    const payload = { 
      formData: supportFormData, 
      tenantId, 
      username 
    };
    dispatch(submitSupportForm(payload));
};


  const handleCancel = () => {
    setFormData({ fullName: '', email: '', message: '' });
  };

  document.title = "Support Form | Chainwide - AI Middleware";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Support" breadcrumbItem="Support Form" />
          <Row>
            <Col lg={6}>
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">Feedback Form</CardTitle>

                  <Form onSubmit={handleFormSubmit}>
                    <div className="mb-3">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter Your Full Name"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        type="email"
                        className="form-control"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter Your Email"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="message">Message</Label>
                      <Input
                        type="textarea"
                        className="form-control"
                        id="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="5"
                        placeholder="Your message"
                        required
                      />
                    </div>

                    <div className="d-flex justify-content-start">
                      <Button type="submit" color="primary" className="me-2" disabled={loading}>
                        Submit
                      </Button>
                      <Button type="button" color="secondary" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </div>
                  </Form>
                  {loading && <div>Loading...</div>}
                  {error && <div>Error: {error}</div>}
                  {message && <div>Message: {message}</div>}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Support;
