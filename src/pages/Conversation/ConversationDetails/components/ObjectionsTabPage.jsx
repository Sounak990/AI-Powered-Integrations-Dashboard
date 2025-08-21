import React from "react";
import DiscoveryQuestionCard from "./DiscoveryQuestionCard";
import { Card, CardContent } from "@/components/ui/card";
import AudioPlayer from "./AudioPlayer";
import ObjectionQuestionCard from "./ObjectionQuestionCard";

const ObjectionsTabPage = ({ conversation }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 w-full h-max pt-4">
      {/* left side tab */}
      <div className="col-span-1 md:col-span-7 flex flex-col gap-2">
        {/* discovery questions card */}
        <ObjectionQuestionCard
          objectionList={conversation.objection_feedback?.Objections}
        />
      </div>

      {/* right side tab */}
      <div className="col-span-1 md:col-span-5 flex flex-col gap-4">
        {/* overall grade card */}
        <Card className="bg-card-color !border-none w-full rounded-xl">
          <CardContent className="w-full flex flex-col gap-3 pt-3">
            <p className="font-normal text-lg">Overall Grade</p>
            <p className="font-semibold text-[40px] text-primaryColor leading-[49px]">
              {conversation.objection_feedback?.OverallGrade}
            </p>
          </CardContent>
        </Card>

        <AudioPlayer audioUrl={conversation.recordingUrl} />
      </div>
    </div>
  );
};

export default ObjectionsTabPage;
