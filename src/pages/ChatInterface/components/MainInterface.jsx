/* eslint-disable react/prop-types */
import { PlusSquare, Send, Settings } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import { useNavigate } from 'react-router-dom';
import ConnectionSelectForm from './ConnectionSelectForm';
import TypedText from './TypedText';

const MainInterface = ({ data, handleSend, isLoading, toggle, fetchingChatData, connections,setHistory }) => {
	const [input, setInput] = useState('');
	const bottomRef = useRef(null);
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		handleSend(input);
		setInput('');
	};

	useEffect(() => {
		console.log(data);
		if (bottomRef.current) {
			bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
		}
	}, [data]);

	return (
		<div className="bg-gray-900 text-white flex-grow overflow-y-auto flex flex-col relative">
			<div className="z-10 float p-3 border-b-gray-500 border-b-2 sticky top-0 bg-gray-900 flex flex-row justify-between items-center">
				<p className="text-2xl">{data.rag_name || "New Chat"}</p>
				<div className="flex flex-row gap-3 items-center">
					<button className="hover:text-primaryColor hover:bg-inherit" onClick={() => navigate('/chat-interface')}>
						<PlusSquare size={30} />
					</button>
					<button className="hover:text-primaryColor hover:bg-inherit" onClick={toggle}>
						<Settings size={30} />
					</button>
				</div>
			</div>
			<div className="flex flex-col gap-4 grow px-4 my-4">
				{data.messages.length === 0 && !fetchingChatData &&
					<div className="flex-grow flex items-center justify-center">
						{data.connection_id ? <TypedText text="Send a message to begin the conversation." /> : <ConnectionSelectForm connections={connections} setHistory={setHistory}/>}
					</div>
				}
				{/* {data.messages.length === 0 && !data.connection_id && !fetchingChatData && <ConnectionSelectForm />} */}
				{fetchingChatData ?
					<div className="flex-grow flex items-center justify-center text-lg text-center">
						<div className="flex flex-col items-center">
							<svg className="animate-spin h-8 w-8 text-white mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							<p>Loading...</p>
						</div>
					</div>
					:
					data.messages.map((message) => (
						<Message
							key={message.message_id ?? "temp"}
							data={message}
						/>
					))
				}
			</div>

			<div className="flex px-4 py-2 sticky bottom-0 backdrop-blur-md">
				<textarea
					type="text"
					rows={1}
					autoFocus
					className="bg-gray-800 border-gray-700 text-white py-3 px-4 flex-grow mr-2 rounded resize-none text-sm"
					placeholder="Type something"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && !e.shiftKey) {
							handleSubmit(e);
						}
					}}
				/>
				<button
					onClick={handleSubmit}
					className="bg-primaryColor hover:bg-green-500 text-white font-bold p-[14px] rounded-sm disabled:opacity-50"
					disabled={isLoading || !data.connection_id}
				>
					<Send />
				</button>
			</div>
			<div className='' ref={bottomRef}></div>
		</div>
	);
};

export default MainInterface;
