/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import AgentForm from './AgentForm';

const AgentItem = ({ name, image, text, integrations, type, refreshPageData }) => {
	const [open, setOpen] = useState(false);
	const data = { name, image, type }

	const initialValues = {
		integrations: '',
		name: '',
		description: '',
		model_provider: "openai",
		model_name: "gpt-4o",
		temperature: 0.7,
		max_tokens: 2000,
		top_p: 1.0,
		frequency_penalty: 0,
		presence_penalty: 0
	}

	return (
		<AgentForm
			open={open}
			setOpen={setOpen}
			initialValues={initialValues}
			data={data}
			integrations={integrations?.filter(integration => integration.integration_status === "active")}
			refreshPageData={refreshPageData}
		>
			<button className="bg-[#04051B] border-gray-100 hover:bg-[#04051B] hover:text-[#00CC99] focus:outline-none focus:bg-[#04051B]">
				{/* Main Row Button */}
				<div
					className="text-left p-4"
				>
					<div className="flex items-center justify-between">
						<div className="flex flex-row items-center gap-4">
							<div className="w-10">
								<img src={image} alt="logo" />
							</div>
							<div>
								<div className='flex flex-row items-center gap-4'>
									<div className="text-base font-medium">{name}</div>
								</div>
								<div className="text-sm text-gray-500">{text}</div>
							</div>
						</div>
					</div>
				</div>
			</button>
		</AgentForm>
		// <button className="bg-[#04051B] border-gray-100 hover:bg-[#04051B] hover:text-[#00CC99] focus:outline-none focus:bg-[#04051B]">
		// 	<div
		// 		className="text-left p-4"
		// 	>
		// 		<div className="flex items-center justify-between">
		// 			<div className="flex flex-row items-center gap-4">
		// 				<div className="w-10">
		// 					<img src={image} alt="logo" />
		// 				</div>
		// 				<div>
		// 					<div className='flex flex-row items-center gap-4'>

		// 						<div className="text-base font-medium">{name}</div>
		// 					</div>
		// 					<div className="text-sm text-gray-500">{text}</div>
		// 				</div>
		// 			</div>
		// 		</div>
		// 	</div>
		// </button>
	);
};

export default AgentItem;