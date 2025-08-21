import React from 'react';
import voiceData from '../../../components/bots/voiceData.js'; // Import the voice data

const BotDetails = ({ bot, isConnected, isCallActive, onStartCall, onEndCall, personalityIcon, onEdit, onDelete }) => {
  if (!bot || !bot.botName || !bot.title || !bot.companyName) {
    return (
      <div className="no-active-bot-container center-content">
        Select or create a buyer bot to start practicing!
        <div><i className="bx bx-phone-call ringing-phone"></i></div>
      </div>
    );
  }

  const picture = voiceData[bot.personName]?.picture || voiceData["Allison McDonald"].picture; // Fallback to default picture

  return (
    <div className="active-bot-call">
      <div className="active-options">
        <div>
          <i className="bx bx-edit" onClick={onEdit}></i>
        </div>
        <div>
          <i className="bx bx-trash" onClick={() => onDelete(bot.bot_id)}></i>
        </div>
      </div>

      <div className="active-header">
        <div className="active-name center-text">{bot.botName}</div>
        <div className="active-occupation center-text">{bot.title} at {bot.companyName}</div>
      </div>

      <div className="user-icon-container text-center mb-4">
        <div className="image-container">
          <img src={picture} alt={bot.personName} className="user-icon-image" />
          <span className="active-dot" style={{ visibility: isConnected ? 'visible' : 'hidden' }}></span>
        </div>
      </div>

      <div className="active-attributes center-content">
        <span className="center-content">
          <i className={`personality-icon ${personalityIcon(bot.demeanor)}`}></i>
          {bot.demeanor}
        </span>
        <span className="center-content">
          <i className="personality-icon bx bx-phone-call"></i>
          Cold Call
        </span>
      </div>

      <div className="active-scenario">
        <div className="scenario-title center-text">Scenario</div>
        <div className="scenario-description center-text">{bot.scenario}</div>
      </div>

      <div className="call-button-container">
        {!isCallActive ? (
          <button className="call-button" onClick={onStartCall} disabled={isCallActive}>
            Call {bot.botName}
          </button>
        ) : (
          <button className="end-call-button" onClick={onEndCall} disabled={!isCallActive || !isConnected}>
            End Call
          </button>
        )}
      </div>
    </div>
  );
};

export default BotDetails;
