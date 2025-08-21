/* eslint-disable react/prop-types */
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";
import CalenderIcon from "../../../assets/images/svg/calender.svg";
import PersonIcon from "../../../assets/images/svg/person.svg";
import voiceData from "@/components/bots/voiceData";

const PreviousAssignmentItem = ({
  name,
  title,
  typeOfCall,
  completionDate,
  assignedBy,
}) => {
  const picture = voiceData["Allison McDonald"].picture; // Fallback to default picture
  return (
    <Card className="bg-card-color !border-none !p-0">
      <CardContent className="flex flex-col gap-4 w-full !p-0">
        <Separator className="bg-mutedtext text-mutedtext w-full mt-3" />
        {/* image and type of call div */}
        <div className="flex flex-row items-center justify-between">
          {/* image and name */}
          <div className="flex flex-row items-center gap-3">
            <img src={picture} className="h-10 w-10 rounded-full" />
            {/* name in column */}
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-base ">Alena Korsgaard</p>
              <p className="font-normal text-sm text-white/55">
                President at softtech
              </p>
            </div>
          </div>
          <Badge className="bg-[#BDFF4B]/20 text-[#BDFF4B] !p-2 rounded-md !border-none">
            Cold Call
          </Badge>
        </div>
        {/* completion date and assigned by div */}
        <div className="flex flex-row items-stretch gap-5 justify-between">
          <div className="w-full  bg-[#00D29E]/10 rounded-lg flex flex-col gap-2 p-3">
            <p className="text-xs font-semibold">Completion Date</p>
            <div className="flex flex-row items-center gap-2">
              <img src={CalenderIcon} className="h-[18px] w-[18px]" />
              <p className="text-white text-sm">26 Jun, 2024</p>
            </div>
          </div>
          <div className="w-full  bg-[#00D29E]/10 rounded-lg flex flex-col gap-2 p-3">
            <p className="text-xs font-semibold">Assigned by</p>
            <div className="flex flex-row items-center gap-2">
              <img src={PersonIcon} className="h-[18px] w-[18px]" />
              <p className="text-white text-sm">Angela Davis</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviousAssignmentItem;
