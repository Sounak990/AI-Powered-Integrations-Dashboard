/* eslint-disable react/prop-types */
import { Badge } from "@/components/ui/badge";
import React from "react";
import HappyFace from "../../../assets/images/svg/Smile with heart icon.svg";
import InquisitiveFace from "../../../assets/images/svg/inquisitive-face.svg";
import RudeFace from "../../../assets/images/svg/rude-face.svg";
import SkepticFace from "../../../assets/images/svg/skeptic-face.svg";

const BotMood = ({ botMood }) => {
  return (
    <>
      {botMood === "Friendly" && (
        <Badge className="bg-primaryColor/20 w-max rounded-lg flex flex-row items-center gap-2 py-2 text-[12px] leading-[14.4px] !border-none !font-normal">
          <img src={HappyFace} alt="happy face" />
          <p className="text-primaryColor text-xs">Friendly</p>
        </Badge>
      )}

      {botMood === "Inquisitive" && (
        <Badge className="bg-[#BDFF4B]/20 w-max rounded-lg flex flex-row items-center gap-2 py-2 text-[12px] leading-[14.4px] !border-none !font-normal">
          <img src={InquisitiveFace} alt="happy face" />
          <p className="text-primaryColor text-xs">Inquisitive</p>
        </Badge>
      )}

      {botMood === "Rude" && (
        <Badge className="bg-[#EA2525]/20 text-[#EA2525] w-max rounded-lg flex flex-row items-center gap-2 py-2 text-[12px] leading-[14.4px] !border-none !font-normal">
          <img src={RudeFace} alt="happy face" />
          <p className=" text-xs">Rude</p>
        </Badge>
      )}

      {botMood === "Skeptic" && (
        <Badge className="bg-[#FEDC2B]/20 text-[#FEDC2B] w-max rounded-lg flex flex-row items-center gap-2 py-2 text-[12px] leading-[14.4px] !border-none !font-normal">
          <img src={SkepticFace} alt="happy face" />
          <p className="primaryColor text-xs">Skeptic</p>
        </Badge>
      )}
    </>
  );
};

export default BotMood;
