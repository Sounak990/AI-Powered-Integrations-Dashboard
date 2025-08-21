import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { fetchUserCumulativeGrades } from "../../services/api";

import { Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import LineApexChart from "../AllCharts/apex/chartapex";
import './metrics.css';

const Apexchart = ({ scenariosData, tenantId, username }) => {
  const [gradesData, setGradesData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log('TTTT: ', tenantId, username)
        const data = await fetchUserCumulativeGrades(tenantId, username);
        setGradesData(data || {}); // Ensure data is an object
      } catch (error) {
        console.error('Error fetching grades data:', error);
        // Set grades data to null or an empty object/array to indicate no data
        setGradesData({}); // Set to empty object in case of error
      }
    };
  
    fetchData();
  }, [tenantId, username]);

  return (
    <React.Fragment>
      <Row>
        <Col lg={6}>
          <Card>
            <CardBody>
              <CardTitle className="mb-4">Performance by Scenarios</CardTitle>
              <LineApexChart dataColors='["--bs-primary", "--bs-success"]' scenariosData={scenariosData}/>
            </CardBody>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
          <CardBody>
            <CardTitle className="mb-4">Average Grades in Categories</CardTitle>
            {gradesData && typeof gradesData === 'object' && Object.keys(gradesData).length > 0 ? (
              <div className="grades-grid">
                {Object.entries(gradesData).map(([key, value]) => (
                  <div key={key} className={`grade-cell grade-${value}`}>
                    <div className="grade-category">{key}</div>
                    <div className="grade-value">{value}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No grade data available to display.</p> // Message when gradesData is invalid or empty
            )}
          </CardBody>

          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default Apexchart;