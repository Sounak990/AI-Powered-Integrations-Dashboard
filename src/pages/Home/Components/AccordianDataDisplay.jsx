import { ChevronDown, Plus } from "lucide-react";
import React, { useState } from "react";

const AccordianDataDisplay = ({ data, title, cols }) => {
	const [expanded, setExpanded] = useState(false);
	return (
		<div>
			<button className="w-full hover:bg-inherit py-2 flex flex-row items-center gap-2" onClick={() => setExpanded(!expanded)}>
				<div className="text-lg text-left">{title || "Data"}</div>
				<div className={`transform transition-transform duration-200 ${expanded ? 'rotate-45' : ''}`}>
					<Plus className="w-5 h-5 text-gray-400" />
				</div>
			</button>
			<div
				className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'max-h-96' : 'max-h-0'
					}`}
			>
				<div className={`bg-[#00cc9905] p-2 grid grid-cols-${cols || 2} gap-2`}>
					{Object.keys(data).map((key, index) => (
						<div key={index} className="flex flex-col">
							<div className="text-xs text-left text-slate-400">{key}</div>
							<div className="text-base text-left text-pretty">{data[key] ?? "Not Set"}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default AccordianDataDisplay;
