import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Table,
  Alert,
  Card,
  CardBody,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { submitScenarioApi, fetchScenariosApi, fetchUsersByTenant, assignUsersToScenario } from '../../services/api';
import './Scenariostyles.css';

const Scenario = () => {
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);
  const [errorMessage, setErrorMessage] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [assignUserModalVisible, setAssignUserModalVisible] = useState(false);
  const toggleAssignUserModal = () => setAssignUserModalVisible(!assignUserModalVisible);

  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [currentScenarioId, setCurrentScenarioId] = useState(null);
  const isadmin = useSelector((state) => state.login.user?.is_admin);
  const tenantId = useSelector((state) => state.onboardingReducer.data?.tenant_id || state.login.user?.tenant_id);
  const username = useSelector((state) => state.login.user?.username);

  // Function to fetch scenarios based on tenant_id
  const fetchScenarios = async () => {
    try {
      const scenariosData = await fetchScenariosApi(tenantId);
      setScenarios(scenariosData.scenarios);
    } catch (error) {
      console.error('Error fetching scenarios:', error);
    }
  };

  const handleSubmit = async () => {
    const title = document.getElementById('title').value;
    const backgroundInformation = document.getElementById('backgroundInformation').value;
    const customerSpecificInfo = document.getElementById('customerSpecificInfo').value;
    const customerProfile = document.getElementById('customerProfile').value;
    const objectives = document.getElementById('objectives').value;
    const objections = document.getElementById('objections').value;

    if (title && backgroundInformation && customerSpecificInfo && customerProfile && objectives && objections) {
      const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      // Generate two random digits (00-99)
      const randomDigits = String(Math.floor(Math.random() * 100)).padStart(2, '0');
      const nextScenarioId = `SC-${randomLetter}${randomDigits}`;

      const newScenario = {
        tenant_id: tenantId,
        username: username,
        scenario_id: nextScenarioId,
        scenario: {
          title,
          backgroundInformation,
          customerSpecificInfo,
          customerProfile,
          objectives,
          objections,
        },
      };

      // Send the scenario data to the backend
      try {
        await submitScenarioApi(newScenario, tenantId, username);
        // Close the modal
        toggleModal();

        // Clear success and error messages
        setSuccessMessage('');
        setErrorMessage('');

        // Fetch scenarios to get the updated list
        fetchScenarios();

        // Set success message after fetching scenarios
        setSuccessMessage('Scenario submitted successfully');
      } catch (error) {
        console.error('Error submitting scenario:', error);
        // Handle error here, show an error message, etc.
      }
    } else {
      setErrorMessage('All fields are required.');
    }
  };

  
  const handleAssignUserClick = async (scenarioId) => {
    setCurrentScenarioId(scenarioId);
    console.log('Current Scenario ID set to:', scenarioId);

    try {
        const usersData = await fetchUsersByTenant(tenantId);
        setUsersData(usersData);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
    setAssignUserModalVisible(true);
};


  const handleCheckboxChange = (userEmail, isChecked) => {
    let updatedSelectedUsers;
    if (isChecked) {
        // Add the user to the list of selected users
        updatedSelectedUsers = [...selectedUsers, userEmail];
    } else {
        // Remove the user from the list of selected users
        updatedSelectedUsers = selectedUsers.filter((email) => email !== userEmail);
    }
    setSelectedUsers(updatedSelectedUsers);
    console.log(`Selected User Email: ${userEmail}, Selected: ${isChecked}`);
};

  
  const handleAssignUsers = async () => {
    console.log('Assigning users to Scenario ID:', currentScenarioId);
    console.log('Selected Users:', selectedUsers);

    try {
        const response = await assignUsersToScenario(tenantId, selectedUsers, currentScenarioId);
        console.log('Users assigned successfully', response);

        // Update your component state or UI as needed
        setSuccessMessage('Users assigned successfully');
    } catch (error) {
        console.error('Error while assigning users:', error);
        setErrorMessage('Error while assigning users');
    }

    setAssignUserModalVisible(false);
  };

  useEffect(() => {
    // Fetch scenarios when the component loads
    fetchScenarios();
  }, [tenantId]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid className="container-fluid">
          <Breadcrumbs title="Scenarios" breadcrumbItem="Scenario List" />

          {successMessage && <Alert color="success" className="custom-alert">{successMessage}</Alert>}
          {errorMessage && <Alert color="danger" className="custom-alert">{errorMessage}</Alert>}

          <Row>
            <Col lg="12">
              {isadmin && (
                <Button color="primary" className="custom-button" onClick={toggleModal}>
                  Create Custom Scenario
                </Button>
              )}

              <Modal isOpen={modal} toggle={toggleModal} className="custom-modal">
                <ModalHeader toggle={toggleModal}>Create Scenario</ModalHeader>
                <ModalBody>
                  {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                  <FormGroup>
                    <Label for="title">Scenario Title</Label>
                    <Input type="text" id="title" required />
                  </FormGroup>

                    {/* Create a section called "About You" */}

                    <div className="about-section">
                    <div className="about-header">
                      <hr />
                      <h5>About You</h5>
                    </div>
                    <FormGroup>
                      <Label for="backgroundInformation">Background Information</Label>
                      <Input type="textarea" id="backgroundInformation" required />
                      <small className="text-muted">
                        A brief about the product/service you are selling and the market context.
                      </small>
                    </FormGroup>
                    <FormGroup>
                      <Label for="objectives">Objectives</Label>
                      <Input type="textarea" id="objectives" required />
                      <small className="text-muted">
                        Specific goals the salesperson should aim to achieve in the roleplay.
                      </small>
                    </FormGroup>
                  </div>
                  <div className="about-section">
                    <div className="about-header">
                      <hr />
                      <h5>About Customer</h5>
                    </div>

                    <FormGroup>
                      <Label for="customerSpecificInfo">Customer Persona Information</Label>
                      <Input
                        type="text"
                        id="customerSpecificInfo"
                        placeholder="CTO of Cloud company"
                        required
                        style={{ color: '#999', fontStyle: 'italic' }}
                      />
                      <small className="text-muted">
                        Please enter the title and industry of the persona in the format "X of Y company."
                      </small>
                    </FormGroup>
                  <FormGroup>
                    <Label for="customerProfile">Customer Persona Profile</Label>
                    <Input type="textarea" id="customerProfile" required />
                    <small className="text-muted">
                      Describe the needs and objectives of the customer persona.
                    </small>
                  </FormGroup>
                  <FormGroup>
                    <Label for="objections">Objections</Label>
                    <Input type="textarea" id="objections" required />
                    <small className="text-muted">
                      Objections from customer
                    </small>
                  </FormGroup>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="secondary" onClick={toggleModal}>
                    Cancel
                  </Button>
                  <Button color="primary" onClick={handleSubmit}>
                    Submit
                  </Button>
                </ModalFooter>
              </Modal>
              <Card>
                <CardBody>
                {Array.isArray(scenarios) && scenarios.length > 0 ? (
                <Table className="custom-table">
                  <thead>
                    <tr>
                      <th>Scenario Title</th>
                      <th>Scenario ID</th>
                      <th>Action</th>
                      <th>Assign Scenario</th> {/* New column header */}
                    </tr>
                  </thead>
                  <tbody>
                  {scenarios.map((scenario, index) => (
                    <tr key={`${scenario.tenant_id}-${scenario.scenario_id}-${index}`}>
                        <td>{scenario.scenario.title}</td>
                        <td>{scenario.scenario_id}</td>
                        <td>
                            <Button color="primary" size="sm">
                                View
                            </Button>
                        </td>
                        <td>
                            <Button 
                                color="success" 
                                size="sm" 
                                onClick={() => handleAssignUserClick(scenario.scenario_id)}
                            >
                                Assign Users
                            </Button>
                        </td>
                    </tr>
                  ))}

                  </tbody>
                </Table>
                ) : (
                  <p>No scenarios available.</p>
                )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <Modal isOpen={assignUserModalVisible} toggle={toggleAssignUserModal} className="custom-modal">
        <ModalHeader toggle={toggleAssignUserModal}>Assign Users</ModalHeader>
        <ModalBody>
          {/* Display the list of users with checkboxes here */}
          {usersData.map((user) => (
            <div key={user.id}>
              <Label>
              <Input
                type="checkbox"
                onChange={(e) => handleCheckboxChange(user.email, e.target.checked)}
                checked={selectedUsers.includes(user.email)}
              />

                {user.name} ({user.email})
              </Label>
            </div>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleAssignUserModal}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleAssignUsers}>
            OK
          </Button>
        </ModalFooter>
      </Modal>

    </React.Fragment>
  );
};

export default Scenario;
