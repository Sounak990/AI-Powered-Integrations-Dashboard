/* eslint-disable react/prop-types */
import React from "react";
import { Badge } from "@/components/ui/badge";

const Status = ({ status }) => {
	return (
		<>
			{status === "active" && (
				<Badge className="bg-primaryColor/20 w-[70px] rounded-lg flex flex-row items-center justify-center gap-2 py-2 text-[12px] leading-[14.4px] !border-none !font-normal">
					<p className="text-primaryColor text-xs truncate">Active</p>
				</Badge>
			)}

			{status === "inactive" && (
				<Badge className="bg-[#EA2525]/20 text-[#EA2525] w-[70px] rounded-lg flex flex-row items-center justify-center gap-2 py-2 text-[12px] leading-[14.4px] !border-none !font-normal">
					<p className="text-xs truncate">Inactive</p>
				</Badge>
			)}

			{status === "failed" && (
				<Badge className="bg-[#EA2525]/20 text-[#EA2525] w-[70px] rounded-lg flex flex-row items-center justify-center gap-2 py-2 text-[12px] leading-[14.4px] !border-none !font-normal">
					<p className="text-xs truncate">Failed</p>
				</Badge>
			)}

			{(status === "pending" || status === null) && (
				<Badge className="bg-[#FEDC2B]/20 text-[#FEDC2B] w-[70px] rounded-lg flex flex-row items-center justify-center gap-2 py-2 text-[12px] leading-[14.4px] !border-none !font-normal">
					<p className="text-xs truncate">Syncing</p>
				</Badge>
			)}

			{status === "syncing" && (
				<Badge className="bg-[#FEDC2B]/20 text-[#FEDC2B] w-[70px] rounded-lg flex flex-row items-center justify-center gap-2 py-2 text-[12px] leading-[14.4px] !border-none !font-normal">
					<p className="text-xs truncate">Syncing</p>
				</Badge>
			)}
		</>
	);
};

export default Status;
