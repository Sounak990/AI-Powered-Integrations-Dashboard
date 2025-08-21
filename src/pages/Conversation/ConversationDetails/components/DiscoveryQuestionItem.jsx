/* eslint-disable react/prop-types */
import { Separator } from "@/components/ui/separator";
import React from "react";

const DiscoveryQuestionItem = ({ question, quality, feedback }) => {
  return (
    <div className="w-full flex flex-col gap-1">
      {/* question */}
      <div className="flex flex-row  gap-2">
        <p className="font-normal text-base leading-6 text-white/80">
          <span className="font-semibold text-base text-white">Question: </span>
          {question}
        </p>
      </div>
      {/* quality */}
      <div className="flex flex-row  gap-2">
        <p className="font-normal text-base leading-6 text-white/80">
          <span className="font-semibold text-base text-white">Quality: </span>
          {quality}
        </p>
      </div>
      {/* feedback */}
      <div className="flex flex-row  gap-2">
        <p className="font-normal text-base leading-6 text-white/80">
          <span className="font-semibold text-base text-white">Feedback: </span>
          {feedback}
        </p>
      </div>
      <Separator className="w-full bg-mutedtext my-2" />
    </div>
  );
};

export default DiscoveryQuestionItem;
