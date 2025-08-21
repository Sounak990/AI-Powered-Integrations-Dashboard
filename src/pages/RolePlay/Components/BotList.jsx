import React, { useEffect } from 'react';
import { Table } from 'reactstrap';
import vpOfIT from '../../../assets/images/users/AllisonMcDonald.png';
import './styles/BotList.css'

const BotList = ({ notifications, handleUseBot }) => {
  return (
    <div className="table-responsive">
      <Table hover className="buyer-bots">
        <tbody>
          {notifications.map((notification, index) => (
            <tr 
              key={index} 
              className={`bot-cell ${notification.status === 'completed' ? 'disabled-bot' : ''}`}
              onClick={notification.status !== 'completed' ? () => handleUseBot(notification) : null} // Disable click if status is 'completed'
            >
              <td className='bot-photo'>
                <img className="avatar-sm rounded-circle"
                  src={vpOfIT}
                  alt={notification.name || notification.assignment_id}
                />
              </td>
              <td className='bot-details'>
                <p className='bot-name'>
                  {console.log('Rendering bot:', notification)}
                  {/* Always show the name regardless of the status */}
                  {notification.name || notification.message}
                </p>
                <p className='bot-job'>
                  {/* Show title and company */}
                  {notification.title ? `${notification.title} at ${notification.company || ''}` : notification.assignment_id}
                </p>
                <div className='bot-attributes'>
                  <span>{'Cold Call'}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {notifications.length === 0 && <p>No notifications available.</p>}
    </div>
  );
};

export default BotList;