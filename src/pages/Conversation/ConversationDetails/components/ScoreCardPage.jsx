import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import AudioPlayer from "./AudioPlayer";

// Import the icons (assuming you have SVG or icon components available)
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"; // Replace with your icon library

const ScoreCardPage = ({ conversation }) => {
  const feedback = conversation.feedback || {};
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const renderIcon = (answer) => {
    switch (answer) {
      case "Good":
        return <CheckCircle className="text-green-500 w-6 h-6" />;
      case "Bad":
        return <XCircle className="text-red-500 w-6 h-6" />;
      case "Okay":
        return <AlertCircle className="text-yellow-500 w-6 h-6" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 w-full h-max pt-4">
      {/* left side tab */}
      <div className="col-span-1 md:col-span-7 flex flex-col gap-2">
        {Object.entries(feedback).map(([question, details], index) => (
          <Card key={index} className="bg-card-color !border-none w-full rounded-xl mb-4">
            <CardContent className="w-full flex flex-col gap-2 pt-3">
              <div className="flex items-center gap-2">
                <p className="font-normal text-lg flex-1">{question}</p>
                {renderIcon(details.Answer)}
              </div>
              <button
                onClick={() => toggleAccordion(index)}
                className="text-primaryColor font-semibold self-start mt-2"
              >
                {expandedIndex === index ? "Hide Details" : "Click for Details"}
              </button>
              {expandedIndex === index && (
                <p className="font-normal text-base text-white/75 w-full pt-3">
                  {details.Explanation}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* right side tab */}
      <div className="col-span-1 md:col-span-5 flex flex-col gap-4">
        {/* Audio player */}
        <AudioPlayer audioUrl={conversation.recordingUrl} />
      </div>
    </div>
  );
};

export default ScoreCardPage;
