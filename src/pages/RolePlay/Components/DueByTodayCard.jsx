import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";
import CardStack from "./CardStack";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import PhoneIcon from "../../../assets/images/svg/phone-white.svg";
import { useEffect } from "react";

const DueByTodayCard = ({ data, onBotSelect, onOpenCallDialog }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
  };

  const prevCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
  };

  useEffect(() => {
    if (data && data.length > 0) {
      onBotSelect(data[currentIndex]);
    }
  }, [currentIndex, data]);

  return (
    <Card className="bg-card-color w-full h-max !border-none">
      <CardHeader>
        <CardTitle className="text-left">Due by Today</CardTitle>
      </CardHeader>
      <Separator className="w-full text-mutedtext" />
      <CardContent className="w-full flex flex-col h-[600px] justify-between">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full h-max">
            <CardStack
              data={data}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
          </div>
        </div>
        <div className="flex flex-col w-full h-max">
          <Button
            className="bg-primaryColor text-white flex flex-row items-center gap-3 w-max self-center"
            onClick={onOpenCallDialog}
            disabled={data[currentIndex]?.status === "completed"}
          >
            <img src={PhoneIcon} className="h-5 w-5" />
            <p>Call</p>
          </Button>
          <div className="flex flex-row items-center justify-between w-full h-max">
            <Button
              className="bg-primaryColor/15 text-primaryColor"
              onClick={prevCard}
              disabled={data.length === 0}
            >
              Back
            </Button>
            <Button
              className="bg-primaryColor/15 text-primaryColor"
              onClick={nextCard}
              disabled={data.length === 0}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DueByTodayCard;
