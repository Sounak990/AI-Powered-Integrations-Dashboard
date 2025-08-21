/* eslint-disable react/prop-types */

import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

const Accordian = ({ title, children }) => {
	const [isOpen, setIsOpen] = useState(true)

	return (
		<div>
			<button className="w-full hover:bg-inherit py-2 flex flex-row items-center gap-2" onClick={() => setIsOpen(!isOpen)}>
				<div className="text-lg text-left">{title}</div>
				<div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
					<ChevronDown className="w-5 h-5 text-gray-400" />
				</div>
			</button>
			<div
				className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'
					}`}
			>
				{children}
			</div>
		</div>
	)
}

export default Accordian;