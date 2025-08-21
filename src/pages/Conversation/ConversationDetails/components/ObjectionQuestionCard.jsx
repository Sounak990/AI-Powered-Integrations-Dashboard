/* eslint-disable react/prop-types */
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import DiscoveryQuestionItem from "./DiscoveryQuestionItem";
import { Separator } from "@/components/ui/separator";
import ObjectionQuestionItem from "./ObjectionQuestionItem";

const ObjectionQuestionCard = ({  objectionList }) => {
  return (
    <Card className="bg-card-color !border-none w-full">
      <CardContent className="flex flex-col gap-2 w-full pt-3">
        <p className="text-primaryColor font-normal text-lg">
          Objection Feedback
        </p>
        <Separator className="w-full text-mutedtext" />
        <div className="w-full flex flex-col">
          {objectionList &&
            objectionList.map((objection, index) => {
              return (
                <ObjectionQuestionItem
                  key={index}
                  objection={objection.Objection}
                  objectionHandling={objection.Label}
                  feedback={objection.Feedback}
                  example={objection.Example}
                />
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ObjectionQuestionCard;
