/* eslint-disable react/prop-types */
// CompetitorTab.js
import React, { useState } from "react";
import CompetitorItem from "./CompetitorItem";

const CompetitorTab = ({ competitors }) => {
  return (
    <div className="flex flex-row gap-4 w-full h-max items-stretch flex-wrap ">
      {competitors.map((competitor, index) => {
        return <CompetitorItem key={index} itemData={competitor} />;
      })}
    </div>
  );
};

export default CompetitorTab;
