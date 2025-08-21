import React, { useState, useEffect } from 'react';
import {
  Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Button, Spinner, Alert
} from 'reactstrap';

const PersonaModal = ({ isOpen, toggle, onSave, persona, loading, error }) => {
  const [personaData, setPersonaData] = useState({ name: '', painPoints: '', objections: '' });

  useEffect(() => {
    if (persona) {
      setPersonaData(persona);
    } else {
      setPersonaData({ name: '', painPoints: '', objections: '' });
    }
  }, [persona]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonaData({ ...personaData, [name]: value });
  };

  const handleSave = () => {
    onSave(personaData);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>{persona ? 'Edit Persona' : 'Add Persona'}</ModalHeader>
      <ModalBody>
        {error && <Alert color="danger">{error}</Alert>}
        <FormGroup>
          <Label for="personaName">Persona Name</Label>
          <Input
            type="text"
            name="name"
            id="personaName"
            value={personaData.name}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="personaPainPoints">Painpoints/Challenges</Label>
          <Input
            type="textarea"
            name="painPoints"
            id="personaPainPoints"
            value={personaData.painPoints}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="personaObjections">Typical Objections</Label>
          <Input
            type="textarea"
            name="objections"
            id="personaObjections"
            value={personaData.objections}
            onChange={handleInputChange}
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSave} disabled={loading}>
          {loading ? <Spinner size="sm" /> : 'Save'}
        </Button>{' '}
        <Button color="secondary" onClick={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
};

export default PersonaModal;
