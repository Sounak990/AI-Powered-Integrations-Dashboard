/* eslint-disable react/prop-types */
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
// import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap';

const MetricCard = ({ title, value, unit, color, icon }) => (

  <Card className={`bg-[${color}]/20 !border-none w-full py-2`}>
    <CardContent className="flex flex-row items-center !py-2">
      {/* main column layout */}
      <div className="flex flex-row gap-2">
        {/* image */}
        <img src={icon} className="w-[35px] h-[35px] " />
        {/* metric column */}
        <div className="flex flex-col gap-3">
          {/* title */}
          <p className="font-semibold text-white  text-sm">{title}</p>
          {/* metrics and unit row */}
          <div className="flex flex-row flex-wrap items-center gap-2">
            <p className={`text-[${color}] font-semibold text-2xl`}>{value}</p>
            {unit && (
              <p className="font-normal text-sm text-mutedtext">{unit}</p>
            )}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default MetricCard;
