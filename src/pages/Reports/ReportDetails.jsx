import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Card, CardBody, Collapse } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import './Reports.css';
import { fetchSpecificFeedback } from '../../services/api'; // Import your API service for fetching specific feedback

const ReportDetails = () => {
    const tenantId = useSelector(state => state.onboardingReducer.data?.tenant_id || state.login.user?.tenant_id);
    const username = useSelector(state => state.login.user?.username);
    const { conversationId } = useParams();
    const [specificFeedback, setSpecificFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openCategory, setOpenCategory] = useState(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            setLoading(true);
            try {
                const data = await fetchSpecificFeedback(username, tenantId, conversationId);
                setSpecificFeedback(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (username && tenantId) {
            fetchFeedback();
        }
    }, [username, tenantId, conversationId]);

    const toggleCategory = (category) => {
        setOpenCategory(openCategory === category ? null : category);
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
                                    {loading && <p>Loading...</p>}
                                    {error && <p>Error: {error}</p>}
                                    {!loading && !error && !specificFeedback && (
                                        <p>No feedback found for conversation ID: {conversationId}</p>
                                    )}
                                    {specificFeedback && (
                                        <div className="accordion">
                                            {Object.entries(specificFeedback.feedback).map(([category, details], index) => (
                                            <div key={index} className="accordion-item">
                                                <div className="accordion-title" onClick={() => toggleCategory(category)}>
                                                    <span>{category} - Grade: {details.Grade}</span>
                                                    <span className="accordion-toggle">{openCategory === category ? '-' : '+'}</span>
                                                </div>
                                                <Collapse isOpen={openCategory === category}>
                                                    <div className="accordion-content">
                                                        <h5>Observations</h5>
                                                        <p>{details.Observations}</p>
                                                        <h5>Recommendations</h5>
                                                        <p>{details.Recommendations}</p>
                                                    </div>
                                                </Collapse>
                                            </div>
                                            ))}
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default ReportDetails;
