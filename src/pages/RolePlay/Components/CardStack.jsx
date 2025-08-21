/* eslint-disable react/prop-types */
import voiceData from "@/components/bots/voiceData";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CardContent } from "@mui/material";
import React from "react";

const CardStack = ({ data, currentIndex, setCurrentIndex }) => {
  return (
    <div className="flex items-center justify-center relative">
      <div className="relative w-[400px] lg:w-[500px] h-64 my-12">
        {data.map((notification, index) => {
          const offset = (index - currentIndex + data.length) % data.length;
          const zIndex = data.length - offset;

          const picture =
            voiceData[notification.name]?.picture ||
            voiceData["Allison McDonald"].picture; // Fallback to default picture

          return (
            <Card
              key={notification.index}
              className={` bg-[#171936] absolute w-full h-full rounded-lg shadow-lg p-2 text-left text-white transition-transform duration-300 ${
                offset === 0 ? "scale-105" : ""
              }`}
              style={{
                zIndex: zIndex,
                transform: `translateX(${offset * 5}px) translateY(${
                  offset * 5
                }px)`,
                opacity: offset === 0 ? 1 : 0.8,
              }}
            >
              <CardContent className="flex flex-row justify-between gap-3 h-full">
                {/* left div */}
                <div className="flex flex-col">
                  {notification.name && (
                    <img
                      src={picture}
                      className="h-[70px] w-[70px] rounded-full"
                    />
                  )}
                  <p className="font-semibold text-lg text-white">
                    {notification.name}
                  </p>
                  <p className="text-base text-white/55 font-normal">
                    {notification.title}
                  </p>
                  <p className="text-base text-white/55 font-normal">
                    {notification.company}
                  </p>
                </div>
                {/* right div */}
                <div className="flex flex-col p-3 justify-between h-full ">
                  <Badge
                    className={`!p-2 text-white rounded-lg !border-none ${
                      notification.status === "pending"
                        ? "bg-yellow-500/55"
                        : "bg-green-500/55"
                    } `}
                  >
                    {notification.status}
                  </Badge>

                  <Badge className="!p-2 !border-none rounded-lg bg-[#BDFF4B]/20 text-[#BDFF4B] ">
                    Cold Call
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CardStack;
