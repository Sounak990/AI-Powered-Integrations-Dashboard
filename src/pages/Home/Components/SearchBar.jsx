/* eslint-disable react/prop-types */
import { Search } from "lucide-react";
import React, { useState, useEffect } from "react";

let typingTimeout;

const SearchBar = ({ search, setSearch, searchCallback }) => {
	useEffect(() => {
		clearTimeout(typingTimeout);
		typingTimeout = setTimeout(() => {
			if (searchCallback) searchCallback(search);
		}, 300);
	}, [search]);

	return (
		<div className="w-full p-3">
			<div className="flex flex-row items-center gap-2 w-full px-2 py-0.5 bg-[#04051B] ring-offset-background border border-input rounded-md">
				<Search className="text-primaryColor" />
				<input
					type="text"
					placeholder="Search"
					className="flex h-10 w-full bg-transparent text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>
		</div>
	);
}

export default SearchBar;