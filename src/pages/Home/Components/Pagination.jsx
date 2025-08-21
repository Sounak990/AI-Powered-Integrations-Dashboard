/* eslint-disable react/prop-types */
import React from 'react';

const Pagination = ({ page, setPage, total, perPage }) => {
	const totalPages = Math.ceil(total / perPage);

	return (
		<div className="flex flex-row items-center justify-center gap-8 w-full text-base pb-2">
			<button
				onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
				className="flex items-center justify-center rounded-md bg-[#04051B] text-gray-500 hover:text-primaryColor focus:outline-none hover:bg-primaryColor/30 py-1 px-2"
				disabled={total === 0}
			>
				Previous
			</button>
			<p className="text-gray-400">{page}</p>
			<button
				onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
				className="flex items-center justify-center rounded-md bg-[#04051B] text-gray-500 hover:text-primaryColor hover:bg-primaryColor/30 py-1 px-2 focus:outline-none"
				disabled={total === 0}
			>
				<p>Next</p>
			</button>
		</div>
	);
}

export default Pagination;