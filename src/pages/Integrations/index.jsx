// import React, { useState } from "react";
// import PropTypes from 'prop-types';
// import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from "reactstrap";
// import { useSelector } from "react-redux";
// import { sendSalesforceCredentials } from "../../services/api";

// const SalesforceModal = ({ isOpen, toggle }) => {
//   const [clientId, setClientId] = useState('');
//   const [clientSecret, setClientSecret] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const tenantId = useSelector((state) => state.onboardingReducer.data?.tenant_id || state.login.user?.tenant_id);
//   const username = useSelector((state) => state.login.user?.username);

//   const handleSave = async () => {
//     setIsLoading(true);
//     try {
//       const response = await sendSalesforceCredentials(clientId, clientSecret, tenantId, username);
//       console.log('Response from backend:', response);
//       // Handle response here (e.g., show a success message, close the modal, etc.)
//       toggle();
//     } catch (error) {
//       console.error('Failed to send credentials:', error);
//       // Handle error here (e.g., show an error message)
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} toggle={toggle}>
//       <ModalHeader toggle={toggle}>Salesforce Authentication</ModalHeader>
//       <ModalBody>
//         <Form>
//           <FormGroup>
//             <Label for="clientId">Client ID</Label>
//             <Input
//               type="text"
//               name="clientId"
//               id="clientId"
//               value={clientId}
//               onChange={(e) => setClientId(e.target.value)}
//             />
//           </FormGroup>
//           <FormGroup>
//             <Label for="clientSecret">Client Secret</Label>
//             <Input
//               type="password"
//               name="clientSecret"
//               id="clientSecret"
//               value={clientSecret}
//               onChange={(e) => setClientSecret(e.target.value)}
//             />
//           </FormGroup>
//         </Form>
//       </ModalBody>
//       <ModalFooter>
//         <Button color="primary" onClick={handleSave} disabled={isLoading}>
//           {isLoading ? 'Saving...' : 'Save'}
//         </Button>{' '}
//         <Button color="secondary" onClick={toggle}>Cancel</Button>
//       </ModalFooter>
//     </Modal>
//   );
// };

// SalesforceModal.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   toggle: PropTypes.func.isRequired,
// };

// export default SalesforceModal;
