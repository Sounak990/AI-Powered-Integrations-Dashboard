/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import React from "react";
import DownloadIcon from "../../../../assets/images/svg/download.svg";
import ChatWidget from "./ChatWidget";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const SymmaryPageTranscript = ({ conversation }) => {
  return (
    <Card className="bg-card-color w-full !border-none">
      <CardContent className="w-full py-4 ">
        <div className="flex flex-col gap-2 w-full pt-2">
          {/* top div for heading and download button */}
          <div className="flex flex-row items-center justify-between w-full">
            <h4 className="font-semibold text-white text-lg">Transcript</h4>
            <Button
              className="bg-primaryColor/15 !py-2 !px-3 rounded-lg "
              variant="ghost"
            >
              <img src={DownloadIcon} className="w-[14px] h-4" />
            </Button>
          </div>
          <Separator className="w-full bg-white/15" />

          <ChatWidget conversation={conversation} />
        </div>
      </CardContent>
    </Card>
  );
};

export default SymmaryPageTranscript;
