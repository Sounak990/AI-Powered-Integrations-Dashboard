/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
import { useState } from "react";
import RagTryForm from "./AgentForm";

const TryRAGButton = ({ onSaveBot, integrations, data }) => {
	const [open, setOpen] = useState(false);

	const initialValues = {
		integrationName: '',
		connectionName: '',
		name: '',
	}

	return (
		<RagTryForm
			open={open}
			setOpen={setOpen}
			onSaveBot={onSaveBot}
			initialValues={initialValues}
			data={data}
			integrations={integrations}
		>
			<Button className="bg-primaryColor text-white flex flex-row items-center gap-3">
				<Plus className="h-5 w-5" />
				<p>Try</p>
			</Button>
		</RagTryForm>
	);
};

export default TryRAGButton;
