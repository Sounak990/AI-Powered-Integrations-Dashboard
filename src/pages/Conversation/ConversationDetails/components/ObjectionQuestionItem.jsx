/* eslint-disable react/prop-types */
import React from "react";
import { Separator } from "@/components/ui/separator";

const ObjectionQuestionItem = ({
  objection,
  objectionHandling,
  feedback,
  example,
}) => {
  return (
    <div className="w-full flex flex-col gap-1">
      {/* question */}
      <div className="flex flex-row  gap-2">
        <p className="font-normal text-base leading-6 text-white/80">
          <span className="font-semibold text-base text-white">Objection: </span>
          {objection}
        </p>
      </div>
      {/* quality */}
      <div className="flex flex-row  gap-2">
        <p className="font-normal text-base leading-6 text-white/80">
          <span className="font-semibold text-base text-white">Objection Handling: </span>
          {objectionHandling}
        </p>
      </div>
      {/* feedback */}
      <div className="flex flex-row  gap-2">
        <p className="font-normal text-base leading-6 text-white/80">
          <span className="font-semibold text-base text-white">Feedback: </span>
          {feedback}
        </p>
      </div>
      {/* example */}
      <div className="flex flex-row  gap-2">
        <p className="font-normal text-base leading-6 text-white/80">
          <span className="font-semibold text-base text-white">Example: </span>
          {example}
        </p>
      </div>
      <Separator className="w-full bg-mutedtext my-2" />
    </div>
  );
};

export default ObjectionQuestionItem;
