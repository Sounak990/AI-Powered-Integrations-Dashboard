/* eslint-disable react/prop-types */
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import DiscoveryQuestionItem from "./DiscoveryQuestionItem";
import { Separator } from "@/components/ui/separator";

const DiscoveryQuestionCard = ({ questionsList }) => {
  return (
    <Card className="bg-card-color !border-none w-full">
      <CardContent className="flex flex-col gap-2 w-full pt-3">
        <p className="text-primaryColor font-normal text-lg">
          Discovery Question Analysis
        </p>
        <Separator className="w-full text-mutedtext" />
        <div className="w-full flex flex-col">
          {questionsList &&
            questionsList.map((analysis, index) => {
              return (
                <DiscoveryQuestionItem
                  key={index}
                  question={analysis.Question}
                  quality={analysis.Quality}
                  feedback={analysis.Feedback}
                />
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DiscoveryQuestionCard;
