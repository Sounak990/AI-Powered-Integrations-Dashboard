import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import PreviousAssignmentItem from "./PreviousAssignmentItem";
const roleplayAssignments = [
  {
    name: "Alena Korsgaard",
    title: "President at softtech",
    completionDate: "26 Jun, 2024",
    assignedBy: "Angela Davis",
    type: "Cold Call",
  },
  {
    name: "Alena Korsgaard",
    title: "President at softtech",
    completionDate: "26 Jun, 2024",
    assignedBy: "Angela Davis",
    type: "Cold Call",
  },
  {
    name: "Alena Korsgaard",
    title: "President at softtech",
    completionDate: "26 Jun, 2024",
    assignedBy: "Angela Davis",
    type: "Cold Call",
  },
  {
    name: "Alena Korsgaard",
    title: "President at softtech",
    completionDate: "26 Jun, 2024",
    assignedBy: "Angela Davis",
    type: "Cold Call",
  },
];
const PreviousAssignments = () => {
  return (
    <Card className="w-full md:w-2/4 flex flex-col gap-4 bg-card-color !border-none ">
      <CardHeader>
        <CardTitle className="text-left">
          Previous Roleplay Assignments
        </CardTitle>

        {roleplayAssignments.map((roleplayAssignment, index) => {
          return <PreviousAssignmentItem key={index} />;
        })}
      </CardHeader>
    </Card>
  );
};

export default PreviousAssignments;
