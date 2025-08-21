import React, { useState, useEffect, useMemo, useCallback  } from 'react';  
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert, Table, Container, Row, Col, Card, CardBody, Spinner, FormGroup, Form, Input, Label } from 'reactstrap';

import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Vapi from '@vapi-ai/web';
// import './stream.css';
import vpOfIT from '../../assets/images/users/AllisonMcDonald.png';
import { TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { submitBotData, fetchUserBotData } from '../../services/api';

const Playground = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [isSpeechActive, setIsSpeechActive] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [botName, setBotName] = useState('');
  const [errors, setErrors] = useState({});
  const [botData, setBotData] = useState([]);



  // Retrieve the conversationId from the location state
  const tenantId = useSelector(state => state.onboardingReducer.data?.tenant_id || state.login.user?.tenant_id);
  const username = useSelector(state => state.login.user?.username);
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [scenario, setScenario] = useState("");
  const [demeanor, setDemeanor] = useState("Rude");
  const [conversationId, setConversationId] = useState(null);
  
  // New state to store saved data
  const [savedData, setSavedData] = useState({ title: '', companyName: '', scenario: '', demeanor: '' });
  // New state to control the display of the alert
  const [showSaveAlert, setShowSaveAlert] = useState(false);

  const isRecording = useSelector(state => state.conversationReducer.isRecording);
  const vapi = useMemo(() => new Vapi('d082796c-5bec-4ff7-959f-f96fdde16c86'), []);
  // const vapi = useMemo(() => new Vapi('3344e8d5-b60d-4b97-9991-958c54cbb5c4'), []); //saugat
  
  const generateConversationId = () => {
    return `conv-${new Date().getTime()}-${Math.floor(Math.random() * 10000)}`;
  };


  const handleStartRecording = async () => {
    setIsLoading(true);

    // Generate a new conversation ID
    const newConversationId = generateConversationId();
    setConversationId(newConversationId);
    try {
      // Prepare the context message based on the selected demeanor
      const demeanorContent = () => {
  
        return `Imagine you are the HR Director at Alesig Consulting. Your name is Jane.

        You are slightly rude when your work is interrupted. Keep your responses short. You are difficult to book meetings with but will some times will make time if a salesperson sparks your interest.
        
        Here are some of your daily pain points: employee engagement, finding employees, retaining employees, manual tasks around managing the day-to-day operations of a team (payroll, performance management, time tracking, scheduling, compliance, etc)
        
        As you are working, you get distracted by your phone buzzing. You think, "Fuck. Probably another cold caller."
        
        You let it ring for a bit but your curiosity gets the best of you and decide to answer the call.`
      
      };
        await vapi.start({
          "voice": {
            "model": "eleven_turbo_v2",
            "voiceId": "zwM4aguYDiWUJBILCgxd",
            "provider": "11labs",
            "stability": 0.5,
            "similarityBoost": 0.75
          },
          "model": {
            "model": "gpt-4o",
            "messages": [
              {
                "role": "system",
                "content": demeanorContent()
              }
            ],
            "provider": "openai",
            "functions": [],
            "maxTokens": 250,
            "temperature": 0.7
          },
          "recordingEnabled": true,
          "firstMessage": "Hello? Who's this?",
          "voicemailMessage": "",
          "endCallFunctionEnabled": false,
          "endCallMessage": "",
          "transcriber": {
            "model": "nova-2-phonecall",
            "language": "en",
            "provider": "deepgram"
          },
          "metadata":{
            "conversationId": newConversationId,
            "tenantId": 'playground',
            "userName":'playground'
          },
          "serverUrl": "https://api.dev.maraca.io/api/vapi-logs/",
          "clientMessages": [
            "transcript",
            "hang",
            "function-call",
            "speech-update",
            "metadata",
            "conversation-update"
          ],
          "serverMessages": [
            "end-of-call-report",
            "status-update",
            "hang",
            "function-call"
          ],
          "endCallPhrases": [
            "Goodbye."
          ],
          "dialKeypadFunctionEnabled": false,
          "backchannelingEnabled": false,
          "voicemailDetectionEnabled": false,
          "hipaaEnabled": false
        })
        // await vapi.start('34c57dc2-2323-4337-94af-432aa2e80f02'); 
        setIsSpeechActive(true);  // Assuming start triggers speech immediately for demonstration
    } catch (error) {
        console.error('Error starting the call:', error);
        setIsSpeechActive(false);
    }
    setIsLoading(false);
};

const handleExitConversation = async () => {
    setIsLoading(true);
    try {
        await vapi.stop();
        setIsSpeechActive(false);  // Stop speech when exiting
    } catch (error) {
        console.error('Error stopping the call:', error);
    }
    setIsLoading(false);
};

  const fetchBots = useCallback(async () => {
    try {
      const bots = await fetchUserBotData(tenantId, username);
      setBotData(bots);
    } catch (error) {
      console.error('Failed to fetch bot data:', error);
    }
  }, [tenantId, username]);

  useEffect(() => {
    fetchBots();
  }, [fetchBots]);

  useEffect(() => {
    
    vapi.on('speech-start', () => {
      setIsSpeechActive(true);
    });
  
    vapi.on('speech-end', () => {
      setIsSpeechActive(false);
    });
  
    vapi.on('call-start', () => {
      setIsCallActive(true);
    });
  
    vapi.on('call-end', () => {
      setIsCallActive(false);
    });
  
    vapi.on('message', (message) => {
      const transcriptLower = message.transcript?.toLowerCase() ?? "";
      if (transcriptLower.includes("bye") || transcriptLower.includes("hanging up")) {
        setTimeout(() => handleExitConversation(), 1000);
      }
    });
  
    return () => {
      const stopPromise = vapi.stop();
      if (stopPromise && typeof stopPromise.then === 'function') {
        stopPromise.catch(console.error);
      } else {
        console.error('vapi.stop() did not return a promise.');
      }
      vapi.removeAllListeners();
    };
  }, []);
  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {showSaveAlert && (
            <Alert color="success">
              <strong>Bot saved successfully!</strong>
            </Alert>
          )}
  
          <Row className="justify-content-center">
          <Col md="4">
            <Card className="shadow">
              <CardBody>
                <h5 className="card-title text-center">Persona Information</h5>
                <div className="persona-details">
                  <p><strong>Name:</strong> Jane</p>
                  <p><strong>Title:</strong> VP of IT</p>
                  <p><strong>Company:</strong> Alesig Consulting</p>
                </div>
              </CardBody>
            </Card>
          </Col>


  
            <Col md="8">
              <Card className="shadow">
                <CardBody>
                  {isLoading && (
                    <div className="text-center">
                      <Spinner color="primary" />
                      <p>Waiting on server...</p>
                    </div>
                  )}
  
                  <div className="user-icon-container text-center mb-4">
                    <div className="image-container">
                      <img src={vpOfIT} alt="User" className="user-icon-image" />
                      <span className="active-dot" style={{ visibility: isConnected ? 'visible' : 'hidden' }}></span>
                    </div>
                  </div>
  
                  <div className="button-group d-grid gap-2">
                    <Button className="btn-rounded" color="success" onClick={handleStartRecording} disabled={isCallActive}>
                      Start
                    </Button>
                    <Button className="btn-rounded" color="danger" onClick={handleExitConversation} disabled={!isCallActive || !isConnected}>
                      Stop
                    </Button>
                    {isCallActive && (
                      <div className="speech-indicator mt-2">Call In Progress...</div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
  
};

export default Playground;