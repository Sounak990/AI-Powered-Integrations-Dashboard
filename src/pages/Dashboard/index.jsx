import React, { useState, useEffect } from 'react';
import {
  Col,
  Container,
  Row,
  Button,
  Card,
  CardBody,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  Spinner,
  Alert,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { fetchUserScenarios, fetchFeedbackReport } from '../../services/api';
import { useSelector } from 'react-redux';
import './Dashboard.css'; // Assuming you have a separate CSS file for styles
import Apexchart from './visualizations';

const ScenarioDetailsModal = ({ scenario, isOpen, toggle }) => {
  if (!scenario) return null; // To avoid rendering modal if scenario is null

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Scenario Details</ModalHeader>
      <ModalBody>
        <p><strong>Background Information:</strong> {scenario.backgroundInformation}</p>
        <p><strong>Customer Profile:</strong> {scenario.customerProfile}</p>
        <p><strong>Customer Specific Info:</strong> {scenario.customerSpecificInfo}</p>
        <p><strong>Objections:</strong> {scenario.objections}</p>
        <p><strong>Objectives:</strong> {scenario.objectives}</p>
      </ModalBody>
    </Modal>
  );
};

const LoadingIndicator = () => (
  <div className="text-center">
    <Spinner color="primary" />
  </div>
);

const ErrorMessage = ({ message }) => (
  <Alert color="danger">
    Error: {message}
  </Alert>
);

const Dashboard = () => {
  // Meta title
  document.title = 'Dashboard | Chainwide - AI Middleware';

  const navigate = useNavigate();

  const [scenarios, setScenarios] = useState([]); // State to store fetched scenarios
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const tenantId = useSelector((state) => state.onboardingReducer.data?.tenant_id || state.login.user?.tenant_id);
  const username = useSelector((state) => state.login.user?.username);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');

  const handleViewClick = (scenario) => {
    setSelectedScenario(scenario.scenario); // Assuming scenario is an object with a scenario property
    setModalOpen(true);
  };

  const handlePracticeSalesClick = () => {
    navigate('/practice-sales');
  };

  useEffect(() => {
    // Fetch scenarios from the backend using the API function
    fetchUserScenarios(tenantId, username)
      .then((data) => {
        // Set the fetched scenarios in the state
        setScenarios(data.scenarios);
      })
      .catch((error) => {
        console.error('Error fetching scenarios:', error);
      });
  }, [tenantId, username]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setReportLoading(true);
        const data = await fetchFeedbackReport(username, tenantId);
    
        if (!data || data.length === 0) {
          setFeedback("noData");
        } else {
          setFeedback(data);
        }
      } catch (err) {
        console.error('Error fetching feedback report:', err);
        setReportError("Failed to fetch report: " + err.message);
      } finally {
        setReportLoading(false);
      }
    };
  
    if (username && tenantId) {
      fetchReports();
    }
  }, [username, tenantId]);
  


  const handleStartClick = (scenario) => {
    console.log("Starting scenario with ID:", scenario.scenario_id); // Log scenario ID
    navigate('/practice-sales', { state: { scenario: scenario.scenario, scenarioId: scenario.scenario_id } });
  };

  const renderScenarioCards = () => (
    scenarios.map((scenario, index) => (
      <Col md="6" lg="4" key={index} className="mb-4">
        <Card className="scenario-card shadow-sm">
          <CardBody>
            <h5 className="card-title">{scenario.scenario.title}</h5>
            <p className="card-text">Some details about the scenario...</p>
            <Button className="btn btn-success rounded-pill mr-2" onClick={() => handleViewClick(scenario)}>View</Button>
            <Button className="btn btn-primary rounded-pill" onClick={() => handleStartClick(scenario)}>Start</Button>
          </CardBody>
        </Card>
      </Col>
    ))
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Warning or Notice */}
                    <Alert color="warning">
            <strong>Notice:</strong> Use Chrome or Firefox for best experience
          </Alert>
          <Breadcrumbs title="Dashboard" breadcrumbItem="Dashboards" />
          {loading && <LoadingIndicator />}
          {/* {error && <ErrorMessage message={error} />} */}
          {!loading && !error && (
            <Row>
              <Col lg="4">
                <Card className="shadow-sm border-0">
                  <CardBody className="p-4">
                    <Button
                      onClick={handlePracticeSalesClick}
                      className="btn btn-soft-primary rounded-pill hover-effect w-100"
                    >
                      Practice Sales
                    </Button>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
          {!loading && !error && (
            <Row>
              <Col lg="12">
                <Card className="shadow-sm border-0">
                <CardBody className="p-4">
                  {/* Check if feedback is 'noData' and render message or Apexchart */}
                  {feedback === "noData" ? (
                    <p>No data yet</p>
                  ) : (
                    <Apexchart scenariosData={feedback} tenantId={tenantId} username={username}/>
                  )}
                </CardBody>
                </Card>
              </Col>
            </Row>
          )}
          {!loading && !error && (
            <Row className="tailored-roleplay">
              <Col lg="12">
                <h4 className="mb-4 section-header">Curated Roleplay For You</h4>
                <Row>
                  {renderScenarioCards()}
                </Row>
              </Col>
            </Row>
          )}
          {!loading && !error && (
            <Row className="assigned-roleplay">
              <Col lg="12">
                <h4 className="mb-4 section-header">Assigned Roleplay Scenario</h4>
                <Card className="shadow-sm border-0">
                  <CardBody className="p-4">
                    {scenarios.length === 0 ? (
                      <p>No Scenario assigned</p>
                    ) : (
                      <Table striped responsive className="custom-table">
                        <thead>
                          <tr>
                            <th>Assigned Scenario</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scenarios.map((scenario, index) => (
                            <tr key={index}>
                              <td>{scenario.scenario.title}</td>
                              <td>
                                <Button className="btn btn-success rounded-pill mr-2" onClick={() => handleViewClick(scenario)}>View</Button>
                                <Button
                                  className="btn btn-primary rounded-pill"
                                  onClick={() => handleStartClick(scenario)} // Pass scenario here
                                >
                                  Start
                                </Button>
                              </td>
                            </tr>
                          ))}
                          {/* Add more rows as needed */}
                        </tbody>
                      </Table>
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </div>
      <ScenarioDetailsModal
        scenario={selectedScenario}
        isOpen={isModalOpen}
        toggle={() => setModalOpen(!isModalOpen)}
      />
    </React.Fragment>
  );
};

export default Dashboard;
