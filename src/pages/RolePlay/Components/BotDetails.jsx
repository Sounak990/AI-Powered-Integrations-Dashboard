import React, { useEffect } from 'react';
import vpOfIT from '../../../assets/images/users/AllisonMcDonald.png';

const BotDetails = ({
  botName,
  title,
  companyName,
  scenario,
  isCallActive,
  isConnected,
  status, // Add status prop to determine if the bot is completed
  handleStartRecording,
  handleExitConversation
}) => {

  useEffect(() => {
    console.log('BotDetails props updated:', { botName, title, companyName, scenario, isCallActive, isConnected, status });
  }, [botName, title, companyName, scenario, isCallActive, isConnected, status]);

  return (
    botName === '' ? (
      <div className="no-active-bot-container center-content">
        Select a buyer bot to start practicing!
        <div><i className="bx bx-phone-call ringing-phone"></i></div>
      </div>
    ) : (
      <div className="active-bot-call">
        <div className="active-header">
          <div className="active-name center-text">{botName}</div>
          <div className="active-occupation center-text">{title} at {companyName}</div>
        </div>

        <div className="user-icon-container text-center mb-4">
          <div className="image-container">
            <img src={vpOfIT} alt="User" className="user-icon-image" />
            <span className="active-dot" style={{ visibility: isConnected ? 'visible' : 'hidden' }}></span>
          </div>
        </div>

        <div className='active-attributes center-content'>
          <span className='center-content'>
            <i className="personality-icon bx bx-phone-call"></i>
            Cold Call
          </span>
        </div>

        <div className="active-scenario">
          <div className="scenario-title center-text">Scenario</div>
          <div className="scenario-description center-text">{scenario}</div>
        </div>

        <div className="call-button-container">
          {!isCallActive ? (
            <button 
              className="call-button" 
              onClick={handleStartRecording} 
              disabled={isCallActive || status === 'completed'} // Disable button if call is active or bot is completed
            >
              Call
            </button>
          ) : (
            <button 
              className="end-call-button" 
              onClick={handleExitConversation} 
              disabled={!isCallActive || !isConnected}
            >
              End Call
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default BotDetails;
