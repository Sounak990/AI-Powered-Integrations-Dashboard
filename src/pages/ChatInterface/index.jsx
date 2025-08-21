import React, { useState, useRef, useEffect } from "react";
import MainInterface from "./components/MainInterface";
import RightSidebar from "./components/RightSidebar";
import { useParams } from "react-router-dom";
import { chatCompletion, fetchConnections, getChatData, getChatHistory } from "@/services/api";
import { useSelector } from "react-redux";

const ChatInterface = () => {
	document.title = "Chat | Chainwide - AI Middleware";
	const [isExpanded, setIsExpanded] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [fetchingChatData, setFetchingChatData] = useState(false);
	const optionsRef = useRef(null);
	const { chatId } = useParams();
	const [history, setHistory] = useState([]);
	const [chatData, setChatData] = useState({ messages: [] });
	const [connections, setConnections] = useState([]);

	const tenantId = useSelector(
		(state) =>
			state.onboardingReducer.data?.tenant_id || state.login.user?.tenant_id
	);

	const getConnections = () => {
		fetchConnections(tenantId)
			.then((response) => {
				setConnections(response.connections);
			})
			.catch((error) => {
				console.error("Error fetching connections: ", error);
				toast({
					variant: "destructive",
					title: "Error",
					description: error.message,
				});
			});
	};

	useEffect(() => {
		if (tenantId) {
			getConnections();
		}
	}, [tenantId]);

	// Handle sending message
	// const handleSend = async (input) => {
	// 	if (!input.trim()) return;
	// 	const options = optionsRef.current?.getValues();
	// 	console.log(options);
	// 	// Add user message to the chat
	// 	const userMessage = { id: Date.now(), content: input, role: 'user' };
	// 	setMessages((prev) => [...prev, userMessage]);
	// 	setIsLoading(true);

	// 	let assistantMessage = { id: Date.now() + 1, content: '...', role: 'assistant' };
	// 	setMessages((prev) => [...prev, assistantMessage]);

	// 	try {
	// 		// Send message to OpenAI API and stream response
	// 		const stream = await openai.chat.completions.create(
	// 			{
	// 				model: 'gpt-3.5-turbo',
	// 				messages: [...messages, userMessage],
	// 				stream: true,
	// 				...options,
	// 			},
	// 			{ responseType: 'stream' }
	// 		);

	// 		for await (const chunk of stream) {
	// 			const deltaContent = chunk.choices[0]?.delta?.content || '';
	// 			if (assistantMessage.content === '...') assistantMessage.content = '';
	// 			assistantMessage.content += deltaContent;
	// 			setMessages((prev) =>
	// 				prev.map((msg) =>
	// 					msg.id === assistantMessage.id ? assistantMessage : msg
	// 				)
	// 			);
	// 		}

	// 		setIsLoading(false);
	// 	} catch (error) {
	// 		console.error('Error fetching OpenAI response:', error);
	// 		setIsLoading(false);
	// 	}
	// };

	const handleSend = (input) => {
		if (!input.trim()) return;
		// const options = optionsRef.current?.getValues();
		// console.log(options);

		const userMessage = { message_id: Date.now(), content: input, role: 'user' };
		const assistantMessage = { message_id: Date.now() + 1, content: '...', role: 'assistant' };
		setChatData((prev) => ({ ...prev, messages: [...prev.messages, userMessage, assistantMessage] }));
		setIsLoading(true);
		const payload = {
			connection_id: chatData.connection_id,
			stream: "false",
			chat_id: chatData.chat_id,
			message: input,
		}
		chatCompletion(payload)
			.then((response) => {
				console.log('Chat completion response:', response);
				setChatData((prev) => {
					const msgs = prev.messages;
					msgs.pop();
					msgs.pop();
					console.log({ ...prev, messages: [...msgs, ...response.response] })
					if (prev.rag_name) {
						return { ...prev, messages: [...msgs, ...response.response] }
					}
					else {
						setHistory((prev) => prev.map((chat) => chat.chat_id === response.chat_id ? { ...chat, rag_name: response.rag_name } : chat));
						return { ...prev, rag_name: response.rag_name, messages: [...msgs, ...response.response] };
					}
				});
			})
			.catch((error) => {
				console.error('Error fetching chat completion:', error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}

	useEffect(() => {
		if (chatId) {
			console.log('Fetching chat messages for chat ID:', chatId);
			setFetchingChatData(true);
			getChatData(chatId)
				.then((response) => {
					console.log('Chat data:', response);
					setChatData(response);
				})
				.catch((error) => {
					console.error('Error fetching chat data:', error);
				})
				.finally(() => {
					setFetchingChatData(false);
				});
		}
		else {
			setChatData({ messages: [] });
		}
	}, [chatId]);

	useEffect(() => {
		getChatHistory(tenantId)
			.then((response) => {
				console.log('Chat history:', response);
				setHistory(response)
			})
			.catch((error) => {
				console.error('Error fetching chat history:', error);
			});
	}, []);

	return (
		<div className="flex pt-[70px] h-[calc(100vh)]">
			<MainInterface
				fetchingChatData={fetchingChatData}
				handleSend={handleSend}
				data={chatData}
				isLoading={isLoading}
				toggle={() => setIsExpanded(!isExpanded)}
				connections={connections}
				setHistory={setHistory}
			/>
			<RightSidebar ref={optionsRef} isExpanded={isExpanded} setIsExpanded={setIsExpanded} history={history} />
		</div>
	);
};

export default ChatInterface;