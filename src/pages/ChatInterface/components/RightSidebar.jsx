/* eslint-disable react/prop-types */

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { ChevronRight } from 'lucide-react';
import Accordian from './Accordian';
import { useNavigate } from 'react-router-dom';
import { id } from 'date-fns/locale';

const RightSidebar = forwardRef(function RightSidebar({ isExpanded, setIsExpanded, history }, ref) {
	// const [values, setValues] = useState({ temperature: 1, top_p: 0.95, max_completion_tokens: 2048 });
	const navigate = useNavigate();

	// useImperativeHandle(ref, () => ({
	// 	getValues: () => values,
	// }));

	return (
		<div className={`overflow-hidden transition-all duration-300 ease-in-out h-full ${isExpanded ? 'min-w-64 w-64' : 'w-0'}`}>
			<div className="p-4 h-full bg-card-color text-white flex flex-col gap-3">
				<button className="flex flex-row items-end w-full hover:bg-inherit" onClick={() => setIsExpanded(false)}>
					<ChevronRight className={isExpanded ? 'rotate-0' : 'rotate-180'} />
				</button>
				{/* <div className="mb-4">
					<h3 className="font-bold mb-2">Run settings</h3>
					<Button className="bg-primaryColor text-white flex flex-row items-center gap-3">
						<p>Reset</p>
					</Button>
				</div> */}
				{/* <Accordian title="Advanced Options">
					<h3 className="font-bold mb-1">Temperature</h3>
					<div className="mb-4">
						<div className="flex items-center gap-4">
							<Input
								onChange={(e) => setValues({ ...values, temperature: Number(e.target.value) })}
								value={values.temperature}
								id="temperature-range"
								type="range"
								min="0"
								max="2"
								step="0.01"
								className="w-full h-1 bg-green-500 !p-0 rounded-xl accent-green-500 border-none [&::-webkit-slider-runnable-track]:border-none"
							/>
							<Input
								value={values.temperature}
								onChange={(e) => setValues({ ...values, temperature: Number(e.target.value) })}
								id="temperature-input"
								type="number"
								min="0"
								max="2"
								step="0.01"
								className="w-16 h-8 bg-gray-800 border-gray-700 text-white p-2 flex-grow rounded"
							/>
						</div>
					</div>
					<div className="mb-4">
						<h3 className="font-bold mb-1">Top P</h3>
						<div className="flex items-center gap-4">
							<Input
								onChange={(e) => setValues({ ...values, top_p: Number(e.target.value) })}
								value={values.top_p}
								id="topP-range"
								type="range"
								min="0"
								max="1"
								step="0.01"
								className="w-full h-1 bg-green-500 !p-0 rounded-xl accent-green-500 border-none [&::-webkit-slider-runnable-track]:border-none"
							/>
							<Input
								value={values.top_p}
								onChange={(e) => setValues({ ...values, top_p: Number(e.target.value) })}
								id="topP-input"
								type="number"
								min="0"
								max="1"
								step="0.01"
								className="w-16 h-8 bg-gray-800 border-gray-700 text-white p-2 flex-grow rounded"
							/>
						</div>
					</div>
					<div className="mb-4">
						<h3 className="font-bold mb-1">Output Length</h3>
						<Input
							value={values.max_completion_tokens}
							onChange={(e) => setValues({ ...values, max_completion_tokens: Number(e.target.value) })}
							id="max_completion_tokens"
							type="number"
							min="0"
							max="4096"
							className="w-full h-8 bg-gray-800 border-gray-700 text-white p-2 flex-grow rounded"
						/>
					</div>
				</Accordian> */}

				<Accordian title="History">
					<div className="flex flex-col gap-2">
						{history.map((chat) => (
							<button key={chat.chat_id} className="hover:bg-inherit hover:text-primaryColor p-2 text-left" onClick={() => navigate(`/chat-interface/${chat.chat_id}`)}>
								{chat.rag_name || chat.chat_id}
							</button>
						))}
					</div>
				</Accordian>
			</div>
		</div >
	);
});

export default RightSidebar;