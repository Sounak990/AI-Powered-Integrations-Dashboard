// GradingTab.js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Card, CardBody, CardHeader, FormGroup, Label, Input, Button, Table, Spinner, Alert
} from 'reactstrap';
import { uploadGradingFile } from '../../../services/api';

const GradingTab = ({ tenantId, username }) => {
  const [gradingFile, setGradingFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const gradingFiles = useSelector((state) => state.kbReducer?.data?.filter(file => file.type === 'grading') || []);

  const handleGradingFileChange = (e) => {
    setGradingFile(e.target.files[0]);
  };

  const submitGradingFile = async () => {
    if (gradingFile) {
      setLoading(true);
      try {
        const response = await uploadGradingFile(gradingFile, tenantId, username);
        setSuccessMessage(response.message);
        setAlertVisible(true);
        setGradingFile(null);
      } catch (error) {
        console.error('Error uploading grading file:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const onDismiss = () => setAlertVisible(false);

  return (
    <Card className="mb-3">
      <CardHeader>Grading</CardHeader>
      <CardBody>
        <Alert color="success" isOpen={alertVisible} toggle={onDismiss}>
          {successMessage}
        </Alert>
        <FormGroup>
          <Label for="gradingFile">Upload Grading File</Label>
          <Input type="file" name="file" id="gradingFile" onChange={handleGradingFileChange} />
        </FormGroup>
        <Button color="primary" onClick={submitGradingFile} disabled={loading}>
          {loading ? <Spinner size="sm" /> : 'Submit'}
        </Button>
        <Table className="mt-3" striped>
          <thead>
            <tr>
              <th>File Name</th>
            </tr>
          </thead>
          <tbody>
            {gradingFiles.map((file, index) => (
              <tr key={index}>
                <td>{file.external_response.name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default GradingTab;
