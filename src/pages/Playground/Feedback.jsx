import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card, CardBody, Collapse, Alert, Spinner } from 'reactstrap';
import './styles/Reports.css';
import { stopGradingPlayground, resetCustomerPersonaDataPlayground } from '../../store/playground/actions';

const Feedback = () => {
    const dispatch = useDispatch();
    const gradedResponse = useSelector(state => state.conversationPlaygroundReducer.gradedResponse);
    const isGradingInProgress = useSelector(state => state.conversationPlaygroundReducer.isGradingInProgress);
    
    const [openCategory, setOpenCategory] = useState(null);

    const toggleCategory = (category) => {
        setOpenCategory(openCategory === category ? null : category);
    };

    useEffect(() => {
        if (gradedResponse) {
            dispatch(stopGradingPlayground());
            dispatch(resetCustomerPersonaDataPlayground());

        }
    }, [gradedResponse, dispatch]);

    console.log('GRADED Response', gradedResponse, 'Type of gradedResponse:', typeof gradedResponse);

    return (
        <React.Fragment>
            <div className="page-feedback">
                <Container fluid>
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody style={{ minHeight: '300px' }}>
                                    <h4 className="card-title mb-4">Feedback Details</h4>
                                    {isGradingInProgress && <div className="text-center"><Spinner /></div>}
                                    {!isGradingInProgress && gradedResponse && (
                                        <div className="accordion">
                                            {Object.entries(gradedResponse).map(([category, details], index) => (
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
                                    {!isGradingInProgress && !gradedResponse && (
                                        <Alert color="info">Please complete Step 1 and Step 2 and hit Grade to view feedback.</Alert>
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

export default Feedback;
