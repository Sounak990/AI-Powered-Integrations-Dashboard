/* eslint-disable react/prop-types */

import React from "react";

const TabBar = ({ menuList, setActiveTab, activeTab }) => {
  return (
    <div className="flex items-center border-b gap-3 border-gray-700">
      {menuList.map((tab) => (
        <div key={tab} className="relative">
          <button
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-2 font-normal text-base ${
              activeTab === tab ? "text-primaryColor" : "text-white/55"
            }`}
          >
            {tab}
          </button>
          {activeTab === tab && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primaryColor rounded-md"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TabBar;
