import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Card, CardBody, FormGroup, Label } from "reactstrap";
import { connectWebSocketPlayground, setCustomerPersonaDataPlayground } from '../../store/playground/actions';
import { useDispatch } from 'react-redux';
import './styles/Sidebar.css'

// Yup schema for validation
const CustomerSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  industry: Yup.string().required('Industry is required'),
  profile: Yup.string().required('Profile is required'),
  objections: Yup.string().required('Objections are required'),
  // Adding new fields for "About You" section
  backgroundInformation: Yup.string().required('Background Information is required'),
  objectives: Yup.string().required('Objectives are required'),
});

const CustomerPersonaSidebar = () => {
  const dispatch = useDispatch();

  const [isSaved, setIsSaved] = useState(false); 


  return (
    <Formik
    initialValues={{
      title: '',
      industry: '',
      profile: '',
      objections: '',
      backgroundInformation: '',
      objectives: ''
    }}
    validationSchema={CustomerSchema}
    onSubmit={(values, actions) => {
      console.log(values);
      // Dispatch action to save data to Redux
      dispatch(setCustomerPersonaDataPlayground(values));
      actions.setSubmitting(false);
      setIsSaved(true);
  }}
  >
      {({ errors, touched, isSubmitting }) => (
        <Card>
          <CardBody>
            <Form>
              <div className="about-section">
                <div className="about-header">
                  <hr />
                  <h5>About Customer</h5>
                </div>
                <FormGroup>
                  <Label for="title">Customer Persona Information</Label>
                  <Field name="title" type="text" readOnly={isSaved} className={`form-control ${errors.title && touched.title ? 'is-invalid' : ''} ${isSaved ? 'saved-class' : ''}`} />
                  <ErrorMessage name="title" component="div" className="invalid-feedback" />
                  <small className="text-muted">
                      Title: CTO, VP of Sales
                    </small>
                </FormGroup>
                <FormGroup>
                  <Label for="industry">Industry</Label>
                  <Field name="industry" type="text" readOnly={isSaved} className={`form-control ${errors.industry && touched.industry ? 'is-invalid' : ''} ${isSaved ? 'saved-class' : ''}`} />
                  <ErrorMessage name="industry" component="div" className="invalid-feedback" />
                  <small className="text-muted">
                      Sector: Aerospace, Cloud, Consulting
                    </small>
                </FormGroup>
                <FormGroup>
                  <Label for="profile">Customer Persona Profile</Label>
                  <Field name="profile" as="textarea" readOnly={isSaved} className={`form-control ${errors.profile && touched.profile ? 'is-invalid' : ''} ${isSaved ? 'saved-class' : ''}`} />
                  <ErrorMessage name="profile" component="div" className="invalid-feedback" />
                  <small className="text-muted">
                      Describe the needs and objectives of the customer persona.
                    </small>
                </FormGroup>
                <FormGroup>
                  <Label for="objections">Objections</Label>
                  <Field name="objections" as="textarea" readOnly={isSaved} className={`form-control ${errors.objections && touched.objections ? 'is-invalid' : ''} ${isSaved ? 'saved-class' : ''}`} />
                  <ErrorMessage name="objections" component="div" className="invalid-feedback" />
                  <small className="text-muted">
                      Possible Objections from customer
                    </small>
                </FormGroup>
              </div>

              {/* "About You" Section */}
              <div className="about-section">
                <div className="about-header">
                  <hr />
                  <h5>About You</h5>
                </div>
                <FormGroup>
                  <Label for="backgroundInformation">Background Information</Label>
                  <Field name="backgroundInformation" as="textarea" readOnly={isSaved} className={`form-control ${errors.backgroundInformation && touched.backgroundInformation ? 'is-invalid' : ''} ${isSaved ? 'saved-class' : ''}`} />
                  <ErrorMessage name="backgroundInformation" component="div" className="invalid-feedback" />
                  <small className="text-muted">
                        A brief about the product/service you are selling and the market context.
                      </small>
                </FormGroup>
                <FormGroup>
                  <Label for="objectives">Objectives</Label>
                  <Field name="objectives" as="textarea" readOnly={isSaved} className={`form-control ${errors.objectives && touched.objectives ? 'is-invalid' : ''} ${isSaved ? 'saved-class' : ''}`} />
                  <ErrorMessage name="objectives" component="div" className="invalid-feedback" />
                  <small className="text-muted">
                        Specific goals the salesperson should aim to achieve in the roleplay.
                      </small>
                </FormGroup>
              </div>

              <Button type="submit" color="primary" disabled={isSubmitting || isSaved}>
                {isSubmitting ? 'Submitting...' : 'Save'}
              </Button>
            </Form>
          </CardBody>
        </Card>
      )}
    </Formik>
  );
};

export default CustomerPersonaSidebar;
