// components/PracticeSales.js

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap';
import { FaUser, FaTasks } from 'react-icons/fa';
import { useNavigate, useLocation, useParams   } from 'react-router-dom';
import SalesEvaluation from './evaluation'; // Import SalesEvaluation
import { fetchScenariosByTenantAndUsernameApi } from '../../services/api'; // Import the new API function
import { useSelector } from 'react-redux';
import './styles/PracticeSales.css';

const PracticeSales = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scenarioId =  location.state?.scenarioId
  console.log('SCNEARIO', location)
  const selectedScenario = location.state?.scenario; // Retrieve passed scenario data
  const [scenarios, setScenarios] = useState([]); // State to hold the fetched scenarios
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [startCountdown, setStartCountdown] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const tenantId = useSelector(state => state.onboardingReducer.data?.tenant_id || state.login.user?.tenant_id);
  const username = useSelector(state => state.login.user?.username);

    // Add state variable for scenario_id
  const [selectedScenarioId, setSelectedScenarioId] = useState(null);

  useEffect(() => {
    // Fetch scenarios when the component mounts
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      const scenariosData = await fetchScenariosByTenantAndUsernameApi(tenantId, username);
      setScenarios(scenariosData.scenarios);
    } catch (error) {
      console.error('Error fetching scenarios:', error);
    }
  };

  const handleEvaluationToggle = () => {
    if (!showEvaluation) {
      const newConversationId = generateConversationId();
      setConversationId(newConversationId);
      setSelectedScenarioId(scenarioId);
      console.log('SELECTEd',scenarioId)
      navigate(`/practice-sales/${newConversationId}`, { state: { scenarioId: scenarioId, conversationId: newConversationId } });
    }

    setShowEvaluation(!showEvaluation);
    setStartCountdown(!startCountdown);
  };

  const generateConversationId = () => {
    return `conv-${new Date().getTime()}-${Math.floor(Math.random() * 10000)}`;
  };

  return (
    <Container fluid className="page-content practice-sales">
      <Row>
        <Col lg="12">
          {selectedScenario ? (
            // Display the selected scenario details
            <Card className="sales-scenario-card">
              <CardBody>
                <h4 className="scenario-title">{selectedScenario.title}</h4>
                <p><FaUser /> <strong>Context:</strong> {selectedScenario.backgroundInformation}</p>
                <p><strong>User Persona:</strong> {selectedScenario.customerSpecificInfo}</p>
                <p><strong>Customer Profile:</strong>{selectedScenario.customerProfile}</p>
                <p><strong>Objectives:</strong> {selectedScenario.objectives}</p>
                <p><strong>Objections:</strong> {selectedScenario.objections}</p>
                <Button color="primary" onClick={handleEvaluationToggle}>
                  {showEvaluation ? 'Pause Evaluation' : 'Start Evaluation'}
                </Button>
                {showEvaluation && <SalesEvaluation start={startCountdown} />}
              </CardBody>
            </Card>
          ) : (
            // Display when no scenario is selected
            <Card className="sales-scenario-card">
              <CardBody>
                <p>No scenario selected</p>
              </CardBody>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};  

export default PracticeSales;
