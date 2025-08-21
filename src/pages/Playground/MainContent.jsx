import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, Button, Spinner, Alert } from "reactstrap";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaMicrophone } from 'react-icons/fa';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { 
  connectWebSocketPlayground, 
  disconnectWebSocketPlayground, 
  startRecordingPlayground, 
  stopRecordingPlayground,
  exitConversationPlayground ,
  resetAudioDataPlayground,
  sendTranscriptDataPlayground,
  startGradingPlayground
} from '../../store/playground/actions';
import './styles/stream.css';

let mediaRecorder = null; // Global variable to manage MediaRecorder

const MainContent = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const isConnected = useSelector(state => state.conversationPlaygroundReducer.isConnected);
  const isRecording = useSelector(state => state.conversationPlaygroundReducer.isRecording);
  const [audioData, setAudioData] = useState(null);
  const audioBlob = useSelector(state => state.conversationPlaygroundReducer.audioBlob);
  const [isLoading, setIsLoading] = useState(false);
  const [serverProcessing, setServerProcessing] = useState(false);
  const [hasStartedRecording, setHasStartedRecording] = useState(false);
  const sessionId = document.cookie.replace(/(?:(?:^|.*;\s*)session_id\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const backgroundInformation = useSelector(state => state.conversationPlaygroundReducer.customerPersonaData.backgroundInformation);
  const industry = useSelector(state => state.conversationPlaygroundReducer.customerPersonaData.industry);
  const objections = useSelector(state => state.conversationPlaygroundReducer.customerPersonaData.objections);
  const objectives = useSelector(state => state.conversationPlaygroundReducer.customerPersonaData.objectives);  
  const profile = useSelector(state => state.conversationPlaygroundReducer.customerPersonaData.profile);
  const title = useSelector(state => state.conversationPlaygroundReducer.customerPersonaData.title);

  if (!browserSupportsSpeechRecognition) {
    return null
  }

  useEffect(() => {
    const payload = {
      sessionId,
      backgroundInformation,
      industry,
      objections,
      objectives,
      profile,
      title
    };

    dispatch(connectWebSocketPlayground({ payload }));
  }, [dispatch, sessionId, backgroundInformation, industry, objections, objectives, profile, title]);
  
  useEffect(() => {
    // Handling audio blob availability
    if (audioBlob && audioBlob.size > 0) {
      setIsLoading(false);
      setServerProcessing(false);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioPlayer = new Audio(audioUrl);
  
      // Playing audio and logging
      audioPlayer.play()
        .then(() => console.log('Playback started'))
        .catch(e => console.error('Playback error:', e));
    }
  }, [audioBlob]);
  
  useEffect(() => {
    // Logging state changes for debugging
    console.log("isConnected State:", isConnected);
    console.log("isRecording State:", isRecording);
    console.log("serverProcessing State:", serverProcessing);
  }, [isConnected, isRecording, serverProcessing]);
  

  const handlestartRecordingPlayground = () => {
    console.log("handlestartRecordingPlayground called");
    resetTranscript();
    setHasStartedRecording(true);
    dispatch(startRecordingPlayground());
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = event => {
          console.log('Component: Audio data available', event.data.size);
        };
        mediaRecorder.start();
        console.log('Component: MediaRecorder started');
      })
      .catch(error => {
        console.error('Component: Error accessing the microphone', error);
      });
  };

  const handleStopAndSendAudio = () => {
    console.log('Component: handleStopAndSendAudio - Start');
    SpeechRecognition.stopListening();
    console.log('Transcript Data:', transcript);
    dispatch(sendTranscriptDataPlayground(transcript)); 
    // resetTranscript();
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop(); // This will also trigger the last ondataavailable
    }
    dispatch(stopRecordingPlayground());
    setHasStartedRecording(false);
    setIsLoading(true);
    setServerProcessing(true);
};

  const handleexitConversationPlayground = () => {
    console.log('Component: handleexitConversationPlayground - Start');
    stopMediaRecorder();
    dispatch(startGradingPlayground());
    dispatch(stopRecordingPlayground());
    dispatch(exitConversationPlayground());
    dispatch(resetAudioDataPlayground());
    console.log('Component: handleexitConversationPlayground - End');
  };

  const stopMediaRecorder = () => {
    console.log('Component: stopMediaRecorder - Start');
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      console.log('Component: Stopping MediaRecorder - State:', mediaRecorder.state);
      mediaRecorder.stop();
      SpeechRecognition.abortListening()
      mediaRecorder.stream.getTracks().forEach(track => {
        console.log('Component: Stopping track:', track.kind);
        track.stop();
      });
    } else {
      console.log('Component: MediaRecorder is inactive or null');
    }
    mediaRecorder = null;
    console.log('Component: stopMediaRecorder - End');
  };


  return (
    <>
      <Card className="shadow w-100">
        <CardBody>
          {/* Loading Indicator */}
          {isLoading && (
            <div className="text-center">
              <Spinner color="primary" />
              <p>Waiting on server...</p>
            </div>
          )}
          <div className="mb-3 w-100 d-flex justify-content-end">
            <Button color="primary" onClick={handleexitConversationPlayground} disabled={isRecording || !isConnected || serverProcessing} className="saveexit-button-spacing">
              Grade
            </Button>
          </div>    
          <h4 className="text-center mb-4">Say Hi and Hit send:</h4>
          <div className="mic-icon-container text-center mb-4">
            {isRecording ? <FaMicrophone className="mic-icon glowing" /> : <FaMicrophone className="mic-icon" />}
          </div>
          <div className="button-group d-grid gap-2">
          <Button color="primary" onClick={handlestartRecordingPlayground} disabled={isRecording || !isConnected || serverProcessing}>
            Start Recording
          </Button>
          <Button color="success" onClick={handleStopAndSendAudio} disabled={!isRecording || !isConnected}>Send</Button>
            {/* <Button color="danger" onClick={handleexitConversationPlayground}>Exit Conversation</Button> */}
          </div>
          <div className="text-center mt-4">
            <span className="status-label">Status:</span> {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </CardBody>
      </Card>
    </>

  );
};

export default MainContent;
