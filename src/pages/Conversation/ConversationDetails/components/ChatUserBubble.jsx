/* eslint-disable react/prop-types */
import React from "react";
import ProfileImage from "../../../../assets/images/bot-profile-picture.png";

const ChatUserBubble = ({ message, chatImage }) => {
  return (
    <div className="w-full flex flex-row-reverse items-center gap-2 h-max ">
      <img src={ProfileImage} alt="chate image bot" className="w-8 h-8" />
      <div className="max-w-[400px] w-max px-3 py-3 rounded-xl bg-[#293725]">
        <p className="text-sm font-normal leading-4 text-wrap">{message}</p>
      </div>
    </div>
  );
};

export default ChatUserBubble;
