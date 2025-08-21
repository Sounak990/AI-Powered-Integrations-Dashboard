import React from 'react';

const PersonalityIcons = ({ personalityType }) => {
    const getIconClass = (type) => {
        switch (type) {
            case 'rude':
                return 'bx bx-angry';
            case 'friendly':
                return 'bx bx-smile';
            case 'skeptic':
                return 'bx bx-meh';
            case 'inquisitive':
                return 'bx bx-question-mark';
            default:
                return '';
        }
    };

    return (
        <div className="personality-icon">

            <i className={getIconClass(personalityType)}></i>
        </div>
    );
};

export default PersonalityIcons;
