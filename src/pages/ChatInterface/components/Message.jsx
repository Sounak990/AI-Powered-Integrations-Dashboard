/* eslint-disable react/prop-types */

import { Separator } from "@/components/ui/separator";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import Markdown from 'markdown-to-jsx'
import styled from "styled-components";

const Container = styled.div`
	& * {
		list-style-type: disc;
		margin: revert;
		padding: revert;
		text-wrap: wrap;
	}
	& pre {
		border-radius: 0.5rem;
	}
`;

const Message = ({ data }) => {
	const isUser = data.role === 'user';
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div
			className={`max-w-[900px] w-['min(90%, fit-content)'] relative ${isUser ? 'self-end' : 'self-start'
				}`}
		>
			{!isUser &&
				<div className="mb-2 w-full">
					<button className="w-full hover:bg-inherit py-1 flex flex-row items-center gap-2" onClick={() => setIsOpen(!isOpen)}>
						<div className="text-sm text-left">Details</div>
						<div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
							<ChevronDown className="w-5 h-5 text-gray-400" />
						</div>
					</button>
					<div
						className={`backdrop-brightness-[0.5] px-2 w-full rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'
							}`}
					>
						<div className="flex flex-col gap-1 p-2 w-full">
							<Container>
								<Markdown>{data.context ?? ""}</Markdown>
							</Container>
							{data.search_query &&
								<>
									<Separator className="bg-gray-600 w-full" />
									<div>Search Query: {data.search_query}</div>
								</>
							}
						</div>
					</div>
				</div>
			}
			<div
				className={`after:content-[""] after:top-0 after:absolute after:border-[0.75rem] after:border-transparent after:display-block relative rounded-lg py-2 px-4 ${isUser
					? 'bg-primaryColor border-primaryColor text-white after:right-[-0.45rem] after:border-t-primaryColor'
					: 'bg-green-200 border-green-200 text-green-900 after:left-[-0.45rem] after:border-t-green-200'
					}`}
			>
				<Container>
					<Markdown>{data.content}</Markdown>
					{/* <Markdown options={{ overrides: { code: SyntaxHighlightedCode } }}>{data.content}</Markdown> */}
				</Container>
				{/* <span className="break-words text-pretty hyphens-auto whitespace-pre-wrap">{message}</span> */}
			</div>
		</div>
	);
};

// function SyntaxHighlightedCode(props) {
// 	const ref = React.useRef(null);

// 	React.useEffect(() => {
// 		if (ref.current && props.className?.includes('lang-') && window.hljs) {
// 			window.hljs.highlightElement(ref.current)

// 			// hljs won't reprocess the element unless this attribute is removed
// 			ref.current.removeAttribute('data-highlighted')
// 		}
// 	}, [props.className, props.children])

// 	return <code {...props} ref={ref} />
// }

export default Message