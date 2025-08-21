import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Table, Card, CardBody, Alert } from 'reactstrap';
import { useSelector } from 'react-redux';
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import Doughnut from './Charts/doughnut';
import { fetchAssignmentDetails, fetchRoleplayMetrics } from '../../../services/api';

const AssignmentDetails = () => {
  const [assignment, setAssignment] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const { assignmentId } = useParams();
  const tenantId = useSelector((state) => state.onboardingReducer.data?.tenant_id || state.login.user?.tenant_id);

  useEffect(() => {
    const fetchDetailsAndMetrics = async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        // Fetch assignment details
        const assignmentData = await fetchAssignmentDetails(tenantId, assignmentId);
        setAssignment(assignmentData);

        // Fetch metrics for the assignment
        const metricsData = await fetchRoleplayMetrics(tenantId, assignmentId);
        // Filter out metrics with future dates and include metrics until today's date
        const filteredMetrics = metricsData.data.filter(metric => {
          const metricDate = new Date(metric.date);
          // Get today's date with time set to 00:00:00
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          // Include dates up to and including today
          return metricDate <= today;
        });

        setMetrics(filteredMetrics);
      } catch (error) {
        console.error('Error fetching assignment details or metrics:', error);
        setErrorMessage('Error fetching assignment details or metrics.');
      }
      setLoading(false);
    };

    fetchDetailsAndMetrics();
  }, [tenantId, assignmentId]);

  const calculateCompletionStatus = (metrics) => {
    if (!metrics || !metrics.length) return { completed: 0, pending: 0 };

    let completed = 0;
    let pending = 0;

    metrics.forEach((metric) => {
      if (metric.met_target) {
        completed++;
      } else {
        pending++;
      }
    });

    return { completed, pending };
  };

  const { completed, pending } = calculateCompletionStatus(metrics);

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Assignments" breadcrumbItem="Assignment Details" />
        {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
        
        {loading ? (
          <p>Loading assignment details...</p>
        ) : (
          <>
            <Card>
              <CardBody>
                <Row>
                  <Col lg="6">
                    <h4>{assignment?.title}</h4>
                    <p><strong>Start Date:</strong> {new Date(assignment?.start_date).toLocaleDateString()}</p>
                    <p><strong>End Date:</strong> {new Date(assignment?.end_date).toLocaleDateString()}</p>
                    <p><strong>Frequency:</strong> {assignment?.frequency}</p>
                    <p><strong>Role Plays Per Day:</strong> {assignment?.role_plays_per_day}</p>
                  </Col>
                  <Col lg="6">
                    <Doughnut
                      dataColors={['#34c38f', '#f46a6a']}
                      data={{
                        labels: ['Completed', 'Pending'],
                        datasets: [
                          {
                            data: [completed, pending],
                            backgroundColor: ['#34c38f', '#f46a6a'],
                          },
                        ],
                      }}
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h5>Assignee Metrics</h5>
                <Table className="custom-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Date</th>
                      <th>Completed</th>
                      <th>Required</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.length > 0 ? (
                      metrics.map((data, index) => (
                        <tr key={index}>
                          <td>{data.email}</td>
                          <td>{new Date(data.date).toLocaleDateString()}</td>
                          <td>{data.completed_roleplays}</td>
                          <td>{data.required_roleplays}</td>
                          <td>{data.met_target ? 'Met' : 'Pending'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">No metrics available.</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </>
        )}
      </Container>
    </div>
  );
};

export default AssignmentDetails;
