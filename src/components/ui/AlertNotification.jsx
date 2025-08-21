import Alert from "@mui/material/Alert";

const AlertNotification = ({ message, type, onClose }) => (
    <Alert 
      severity={type} 
      onClose={onClose}
      style={{ position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 1000 }}
    >
      {message}
    </Alert>
  );
  
export default AlertNotification;