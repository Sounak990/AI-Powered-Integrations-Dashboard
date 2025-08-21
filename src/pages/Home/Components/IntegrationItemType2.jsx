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
import { FileText, RefreshCw, RotateCw, Trash2 } from "lucide-react";
import DataDisplayCell from "./DataDisplayCell";

const toTitleCase = (str) => {
	return str.replace(/\w\S*/g, (txt) => {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

const IntegrationItemType2 = ({ data, integrationName, deleteIntegration, syncData }) => {
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
					<div className="flex flex-col justify-center gap-4 grow">
						<div className="flex flex-row justify-between gap-4 items-center">
							<div className="flex flex-col justify-center flex-shrink">
								<div className="text-xl text-left truncate">{data.integration_name}</div>
								<div className="text-sm text-left text-slate-400 text-pretty">{data.integration_description}</div>
							</div>
							<div className="flex flex-col gap-2 items-center">
								{data.integration_sync_status === 'failed' &&
									<Button className="h-8 w-28 flex flex-row items-center gap-2 px-2.5" onClick={() => syncData(data.integration_id)}>
										<RefreshCw size={18} strokeWidth={3} />
										Sync
									</Button>
								}
								<Button className="h-8 w-28 bg-red-600 flex flex-row items-center gap-2 px-2.5" onClick={() => { deleteIntegration(data.integration_id); setOpen(false); }}>
									<Trash2 size={18} strokeWidth={2} />
									Delete
								</Button>
							</div>
						</div>
						<div className="grid grid-cols-1 gap-2">
							<Separator className="bg-gray-600 w-full" />
							<div className="flex flex-col py-2 px-3 rounded-md backdrop-brightness-[0.3] border-2 border-slate-800 gap-2">
								<div className="text-base text-left text-slate-500">Files</div>
								<div className="flex flex-row gap-4 items-start flex-wrap">
									{data.file_metadata.map(file => (
										<button onClick={() => window.open(file.file_url, '_blank')} key={file.file_id} className="rounded-lg hover:bg-primaryColor/20 flex flex-col gap-2 text-left relative w-[120px] items-center p-2 ">
											<FileText size={48} className="text-primaryColor" />
											<div className="text-sm text-left truncate overflow-ellipsis max-w-full">{file.file_name}</div>
											<div className="text-xs text-gray-500">
												{file.file_size >= 1024 * 1024
													? `(${(file.file_size / (1024 * 1024)).toFixed(2)} MB)`
													: `(${(file.file_size / 1024).toFixed(2)} KB)`}
											</div>

										</button>
									))}
								</div>
							</div>
							<DataDisplayCell label="Message" value={data.message || "No message"} />
						</div>
					</div>

				</DialogContent>
			</Dialog>
		</>
	)
}

export default IntegrationItemType2;