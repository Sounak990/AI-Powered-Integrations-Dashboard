/* eslint-disable react/prop-types */
import React, { useState } from "react";
import Status from './Status';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { RefreshCw, RotateCw, Trash2 } from "lucide-react";
import DataDisplayCell from "./DataDisplayCell";

const toTitleCase = (str) => {
	return str.replace(/\w\S*/g, (txt) => {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

const IntegrationItemType1 = ({ data, integrationName, deleteIntegration, syncData, refreshIntegration, confirmIntegration }) => {
	const [active, setActive] = React.useState(false);
	const [open, setOpen] = useState(false);

	return (
		<>
			<button className="relative hover:bg-[#04051B] hover:text-[#00CC99] w-full px-10 py-3 flex items-center justify-between bg-[#04051B]" onClick={() => setOpen(true)}>
				<div className="flex items-center gap-1">
					<span className="font-medium text-inherit">{data.integration_name}</span>
					{data.integration_sync_status === "failed" && <span className="animate-ping relative -top-2.5 inline-flex rounded-full bg-sky-400 opacity-75 h-1 w-1"></span>}
				</div>
				<div className="flex items-center gap-6">
					<Status status={data.integration_status} />
				</div>
			</button>
			<Dialog
				open={open}
				onOpenChange={setOpen}
				className="!bg-card-color !border-none"
			>
				<DialogContent className="max-w-full w-[90%] sm:w-[500px] lg:w-[700px] max-h-[90vh] overflow-y-auto !bg-card-color !border-none">
					<DialogHeader className="text-left">
						<DialogTitle>{integrationName || (data.provider && toTitleCase(data.provider)) || ''} Integration</DialogTitle>
					</DialogHeader>
					<Separator className="bg-gray-600  w-full" />
					<div className="w-full flex flex-row gap-4">
						<div className="flex flex-col justify-center gap-4 grow ">
							<div className="flex flex-col justify-center flex-shrink">
								<div className="text-xl text-left truncate">{data.integration_name}</div>
								<div className="text-sm text-left text-slate-400 text-pretty">{data.integration_description}</div>
							</div>
							<div className="grid grid-cols-1 gap-2">
								<DataDisplayCell label="Client ID" value={data.client_id} />
								<DataDisplayCell label="Client Secret" value={data.client_secret} sensitive />
								<DataDisplayCell label="API Key" value={data.api_key} sensitive />
								<div className="flex flex-col gap-0.5 mb-0.5 py-2 px-3 rounded-md backdrop-brightness-[0.3] border-2 border-slate-800">
									<div className="text-xs text-left text-slate-500">OAuth Scopes</div>
									<div className="text-base text-left break-words w-[90%] text-wrap flex flex-row gap-1">
										{data.oauth_scopes?.split(',').map((scope, index) => (
											<div className="border rounded-2xl px-2 bg-gray-700/50" key={index}>{scope}</div>
										))}
										{!data.oauth_scopes?.length && <div className="text-base text-left break-words w-[90%] text-wrap">Not Set</div>}
									</div>
								</div>
								<DataDisplayCell label="Nango Integration ID" value={data.nango_integration_id} />
								<DataDisplayCell label="Message" value={data.message} />
							</div>
						</div>
						<div className="h-full justify-between flex flex-col gap-4">
							<div className="flex flex-col min-w-24 gap-2 justify-center">
								{data.integration_status === 'active' || data.integration_status === 'pending' ?
									<>
										{/* <Button className="h-8 w-28 flex flex-row items-center gap-2 px-2.5" onClick={() => refreshIntegration(data.integration_id)}>
											<RotateCw size={18} strokeWidth={3}/>
											Refresh
										</Button> */}
										<Button className="h-8 w-28 flex flex-row items-center gap-2 px-2.5" disabled={data.integration_sync_status === 'syncing' ? true : false} onClick={() => syncData(data.integration_id)}>
											<RefreshCw size={18} strokeWidth={3} />
											{data.integration_sync_status === 'syncing' ? "Syncing" : "Sync"}
										</Button>
									</>
									:
									<Button className="h-8 w-28 bg-green-500 flex flex-row items-center gap-2 px-2.5" onClick={() => confirmIntegration(data)}>
										Confirm
									</Button>
								}
							</div>
							<Button className="h-8 w-28 bg-red-600 flex flex-row items-center gap-2 px-2.5" onClick={() => { deleteIntegration(data.integration_id); setOpen(false); }}>
								<Trash2 size={18} strokeWidth={2} />
								Delete
							</Button>
						</div>
					</div>

				</DialogContent>
			</Dialog>
		</>
	)
}

export default IntegrationItemType1;