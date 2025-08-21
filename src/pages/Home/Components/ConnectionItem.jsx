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
import { Trash2 } from "lucide-react";
import AccordianDataDisplay from "./AccordianDataDisplay";
import IntegrationItemType1 from "./IntegrationItemType1";
import IntegrationItemType2 from "./IntegrationItemType2";

const ConnectionItem = ({ data, integrations, deleteConnection, tryRAG, deleteIntegration, syncData, refreshIntegration, confirmIntegration }) => {
	const [open, setOpen] = useState(false);
	return (
		<>
			<button className="bg-[#04051B] border-gray-100 hover:bg-[#04051B] hover:text-[#00CC99] focus:outline-none focus:bg-[#04051B] p-4" onClick={() => setOpen(true)}>
				<div className="flex flex-row justify-between items-center gap-4">
					<span className="font-medium text-inherit text-lg overflow-hidden text-ellipsis">{data.connection_name}</span>
					<Button onClick={e => { e.stopPropagation(); tryRAG(); }}>Try</Button>
				</div>

			</button>
			<Dialog
				open={open}
				onOpenChange={setOpen}
				className="!bg-card-color !border-none"
			>
				<DialogContent className="max-w-full w-[90%] sm:w-[400px] lg:w-[600px] max-h-[90vh] overflow-y-auto !bg-card-color !border-none">
					<DialogHeader className="text-left">
						<DialogTitle>Connection Details</DialogTitle>
					</DialogHeader>
					<Separator className="bg-gray-600 w-full" />
					<div className="flex flex-col justify-center gap-3 grow">
						<div className="w-full justify-between flex flex-row gap-4">
							<div className="flex flex-col justify-center flex-shrink">
								<div className="text-xl text-left truncate">{data.connection_name}</div>
								<div className="text-base text-left text-slate-400 text-pretty">{data.connection_description}</div>
							</div>
							<div className="flex flex-col gap-4 justify-center items-center">
								<div className="flex flex-col min-w-24 gap-2 justify-center items-center">
									<Button className="h-8 w-28 bg-red-600 flex flex-row items-center gap-2 px-2.5" onClick={deleteConnection}>
										<Trash2 size={18} strokeWidth={2} />
										Delete
									</Button>
								</div>
							</div>
						</div>
						<div>
							<div className="text-lg text-left">Integrations</div>
							<div className={`bg-[#00cc9905] p-2 flex flex-col`}>
								<Separator className="bg-gray-800 w-full" />
								{integrations.map((integration, index) => (
									<div className="w-full" key={index}>
										{integration.integration_type === 'type_1' ?
											<IntegrationItemType1
												data={integration}
												deleteIntegration={(id) => deleteIntegration('salesforce', id)}
												syncData={(id) => syncData('salesforce', id)}
												refreshIntegration={(id) => refreshIntegration('salesforce', id)}
												confirmIntegration={(id) => confirmIntegration('salesforce', id)}
												/>
											:
											<IntegrationItemType2
												data={integration}
												deleteIntegration={(id) => deleteIntegration('fileUpload', id)}
											/>
										}
										{index !== integrations.length - 1 && <Separator className="bg-gray-800 w-full" />}
									</div>
								))}
								<Separator className="bg-gray-800 w-full" />
							</div>
						</div>
						<Separator className="bg-gray-600 w-full" />
						<AccordianDataDisplay data={data.llm_model_config} title={"Model Config"} cols={2} />
						<Separator className="bg-gray-600 w-full" />
						<AccordianDataDisplay data={((({ integration_ids, ...rest }) => rest)(data.rag_config))} title={"RAG Config"} cols={1} />
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default ConnectionItem;