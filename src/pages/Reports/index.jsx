import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Card, CardBody, Table, Spinner, Alert } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import ReportDetails from './ReportDetails';
import { useNavigate } from 'react-router-dom';
import { fetchFeedbackReport } from '../../services/api';
import { formatDistanceToNow, parseISO } from 'date-fns';

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

const Reports = () => {
    const navigate = useNavigate();
    const tenantId = useSelector(state => state.onboardingReducer.data?.tenant_id || state.login.user?.tenant_id);
    const username = useSelector(state => state.login.user?.username);
    const firstname = useSelector(state => state.login.user?.firstName);
    const lastname = useSelector(state => state.login.user?.lastName);
    const email = useSelector(state => state.login.user?.email);   

    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeReport, setActiveReport] = useState(null);

    const isDataFetched = !loading && !error;

    useEffect(() => {
        console.log('useEffect triggered');
        console.log(`Username: ${username}, Tenant ID: ${tenantId}`);
    
        const fetchReports = async () => {
            console.log('fetchReports function started');
            setLoading(true);
            try {
                console.log('Attempting to fetch data');
                const response = await fetchFeedbackReport(username, tenantId);
                const fetchedData = response.data; // Access the 'data' property

                console.log('Data received from fetchFeedbackReport:', fetchedData);

                
    
                if (!fetchedData || !Array.isArray(fetchedData) || fetchedData.length === 0) {
                    console.log('Data is null, not an array, or empty');
                    setFeedback([]);
                    setError(null); 
                } else {
                    console.log('Setting feedback state with data:', fetchedData);
                    setFeedback(fetchedData);
                }
            } catch (err) {
                console.error('Error caught in fetchFeedbackReport:', err);
                if (err.response && err.response.status === 404) {
                    console.log('Error is 404, setting feedback to empty array');
                    setFeedback([]);
                    setError(null); 
                } else {
                    console.log('Setting error state with:', err.response?.data?.detail);
                    setError(err.response?.data?.detail);
                }
            } finally {
                console.log('Setting loading to false');
                setLoading(false);
            }
        };
    
        if (username && tenantId) {
            console.log('Username and Tenant ID are present, calling fetchReports');
            fetchReports();
        } else {
            console.log('Username or Tenant ID is missing');
        }
    }, [username, tenantId]);
    
    const handleViewClick = (conversation_id) => {
        setActiveReport(conversation_id);
        navigate(`/${conversation_id}/reportdetails`);
    };

    const formatGeneratedOn = (dateString) => {
        const date = parseISO(dateString + 'Z');
        return formatDistanceToNow(date, { addSuffix: true });
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Reports" breadcrumbItem="Feedback Report" />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    {loading && <LoadingIndicator />}
                                    {error && <ErrorMessage message={error} />}
                                    {!loading && !error && feedback.length === 0 && (
                                        <div className="text-center">
                                            No reports available.
                                        </div>
                                    )}
                                    {!loading && !error && feedback.length > 0 && (
                                        <Table bordered responsive className="styled-table">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Generated On</th>
                                                    <th>Scenario ID</th>
                                                    <th>Conversation ID</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {feedback.map((report, index) => (
                                                    <tr key={index}>
                                                        <td>{firstname} {lastname}</td>
                                                        <td>{email}</td>
                                                        <td>{report.generated_on ? formatGeneratedOn(report.generated_on) : 'Not Available'}</td>
                                                        <td>{report.scenario_id}</td>
                                                        <td>{report.conversation_id}</td>
                                                        <td>
                                                            <button
                                                                className="view-button"
                                                                onClick={() => handleViewClick(report.conversation_id)}
                                                            >
                                                                View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    )}
                                    {activeReport && <ReportDetails conversation_id={activeReport} />}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
    
};

export default Reports;
