import { EyeOff, Eye } from "lucide-react";
import React, { useState } from "react";

const DataDisplayCell = ({ label, value, sensitive }) => {
	const [show, setShow] = useState(false);
	const toggle = () => setShow(!show);

	return (
		<div className="flex flex-col py-2 px-3 rounded-md backdrop-brightness-[0.3] border-2 border-slate-800">
			<div className="text-xs text-left text-slate-500">{label}</div>
			<div className="flex flex-row justify-between">
				<div className="text-base text-left break-words w-[90%] text-wrap">
					{show || !sensitive ? value ?? "Not Set" : "*".repeat(20)}
				</div>
				{sensitive &&
					<button type="button" onClick={toggle} className="hover:text-primaryColor hover:bg-inherit">
						{show ? <EyeOff /> : <Eye />}
					</button>
				}
			</div>
		</div>
	);
};

export default DataDisplayCell;
