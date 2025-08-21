import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Card,
  CardBody,
  CardHeader,
  Alert
} from 'reactstrap';
import { useSelector } from 'react-redux';
import Breadcrumbs from '../../../../components/Common/Breadcrumb';

const fetchAssignmentDetails = async (tenantId, assignmentId) => {
  // Dummy data to simulate API response
  return {
    assignment_id: assignmentId,
    title: 'Weekly Sales Training',
    createdAt: '2023-05-20T10:00:00Z'
  };
};

const fetchAssigneeScores = async (tenantId, assignmentId) => {
  // Dummy data to simulate API response
  return {
    feedback: {
      Situation: {
        Grade: "B",
        Observations: "The user provides a clear and specific context by introducing themselves as Jordan calling from Morocco and expressing interest in learning about the sales training program at radiology associates.",
        Recommendations: "Continue to provide clear and concise context when initiating conversations. This helps establish a framework for the discussion."
      },
      Pain: {
        Grade: "B",
        Observations: "The user expresses curiosity about how role plays are incorporated into the sales training program at radiology associates and hints at the potential pain point of limited time for managers due to role plays.",
        Recommendations: "Consider expressing pain points more explicitly to ensure a clearer understanding of the challenges faced in the current sales training process."
      },
      // ... other feedback sections
    },
    objection_feedback: {
      Objections: [
        {
          Objection: "Currently have our own sales training program in place",
          Label: "Okay",
          Feedback: "The salesperson acknowledged the objection, but could have asked follow-up questions to understand more about the current program and emphasize the additional value their platform could provide.",
          Example: "Absolutely, I understand that you have a program in place. Can you share what specific areas or challenges your current program addresses? Our platform is designed to complement existing training by providing immersive and customizable role-playing scenarios that simulate real-world sales interactions."
        },
        // ... other objections
      ],
      OverallGrade: "B"
    },
    discovery_feedback: {
      DiscoveryQuestionsAnalysis: [
        {
          Question: "How are you today?",
          Type: "Close-Ended",
          Quality: "Okay",
          Feedback: "Consider asking an open-ended question to encourage the prospect to share more about their current situation or challenges. For example: What are some of the key challenges your sales team is facing right now?"
        },
        // ... other discovery questions
      ],
      OverallGrade: "B"
    }
  };
};

const AsigneeDetails = () => {
  const [assignment, setAssignment] = useState(null);
  const [assigneeScores, setAssigneeScores] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const tenantId = useSelector((state) => state.onboardingReducer.data?.tenant_id || state.login.user?.tenant_id);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const assignmentData = await fetchAssignmentDetails(tenantId, assignmentId);
        setAssignment(assignmentData);
        const scoresData = await fetchAssigneeScores(tenantId, assignmentId);
        setAssigneeScores(scoresData);
      } catch (error) {
        console.error('Error fetching assignment details:', error);
        setErrorMessage('Error fetching assignment details.');
      }
    };
    
    fetchDetails();
  }, [tenantId, assignmentId]);

  if (!assignment || !assigneeScores) {
    return <p>Loading assignment details...</p>;
  }

  const renderFeedbackSection = (title, feedback) => (
    <Card className="mb-3">
      <CardHeader>{title}</CardHeader>
      <CardBody>
        <p><strong>Grade:</strong> {feedback.Grade}</p>
        <p><strong>Observations:</strong> {feedback.Observations}</p>
        <p><strong>Recommendations:</strong> {feedback.Recommendations}</p>
      </CardBody>
    </Card>
  );

  return (
    <div className="page-content">
      <Container fluid className="container-fluid">
        <Breadcrumbs title="Assignments" breadcrumbItem="Assignment Details" />
        {errorMessage && <Alert color="danger" className="custom-alert">{errorMessage}</Alert>}
        
        <Row>
          <Col lg="12">
            <Card>
              <CardBody>
                <h5>Roleplay Feedback</h5>
                {Object.keys(assigneeScores.feedback).map(key => renderFeedbackSection(key, assigneeScores.feedback[key]))}
                
                <h5>Objection Handling</h5>
                <Table className="custom-table">
                  <thead>
                    <tr>
                      <th>Objection</th>
                      <th>Label</th>
                      <th>Feedback</th>
                      <th>Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assigneeScores.objection_feedback.Objections.map((objection, index) => (
                      <tr key={index}>
                        <td>{objection.Objection}</td>
                        <td>{objection.Label}</td>
                        <td>{objection.Feedback}</td>
                        <td>{objection.Example}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <h5>Discovery Questions Analysis</h5>
                <Table className="custom-table">
                  <thead>
                    <tr>
                      <th>Question</th>
                      <th>Type</th>
                      <th>Quality</th>
                      <th>Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assigneeScores.discovery_feedback.DiscoveryQuestionsAnalysis.map((question, index) => (
                      <tr key={index}>
                        <td>{question.Question}</td>
                        <td>{question.Type}</td>
                        <td>{question.Quality}</td>
                        <td>{question.Feedback}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AsigneeDetails;
