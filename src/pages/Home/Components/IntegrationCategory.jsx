/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import IntegrationFormType1 from './IntegrationFormType1';
import IntegrationFormType2 from './IntegrationFormType2';
import IntegrationItemType1 from './IntegrationItemType1';
import IntegrationItemType2 from './IntegrationItemType2';
import SearchBar from './SearchBar';
import Pagination from './Pagination';

const perPage = 5;

const IntegrationCategory = ({ name, image, text, integrations, icon, disabled, type, deleteIntegration, syncData, refreshIntegration, confirmIntegration, provider, refreshPageData }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [open, setOpen] = useState(false);
	const [page, setPage] = useState(1);
	const [filteredList, setFilteredList] = useState([]);
	const [shownIntegrations, setShownIntegrations] = useState([]);
	const [search, setSearch] = useState('');

	let active;
	let inactive;
	if (!disabled) {
		active = integrations.filter((integration) => integration.integration_status === 'active').length;
		inactive = integrations.length - active;
	}

	const searchCallback = (search) => {
		setFilteredList(fuzzySearch(search));
		setPage(1);
	}

	const fuzzySearch = (search) => {
		const searchLower = search.toLowerCase();
		return integrations?.filter((integration) => {
			const nameLower = integration.integration_name.toLowerCase();
			let match = true;
			let searchIndex = 0;
			for (let i = 0; i < nameLower.length && searchIndex < searchLower.length; i++) {
				if (nameLower[i] === searchLower[searchIndex]) {
					searchIndex++;
				}
			}
			if (searchIndex !== searchLower.length) {
				match = false;
			}
			return match;
		}) || [];
	};

	useEffect(() => {
		setShownIntegrations(filteredList.slice((page - 1) * perPage, page * perPage) || []);
	}, [integrations, page]);

	useEffect(() => {
		setShownIntegrations(filteredList.slice((page - 1) * perPage, page * perPage) || []);
	}, [filteredList]);

	useEffect(() => {
		// on initial load
		if (integrations) {
			setFilteredList(integrations);
		}
	}, [integrations]);

	return (
		<>
			<div className="bg-[#04051B] border-gray-100">
				{/* Main Row Button */}
				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className="w-full text-left p-4 hover:bg-[#04051B] focus:outline-none focus:bg-[#04051B]"
					disabled={disabled}
				>
					<div className="flex items-center justify-between flex-row gap-1">
						<div className="flex flex-row items-center gap-4">
							<div className="w-12">
								{image ?
									<img src={image} alt="logo" />
									:
									icon
								}
							</div>
							<div>
								<div className="text-base font-medium">{name}</div>
								<div className="text-sm text-gray-500 text-pretty hyphens-auto truncate">{text}</div>
							</div>
						</div>
						{disabled ?
							<Badge className="bg-[#FEDC2B]/20 text-[#FEDC2B] rounded-lg flex flex-row items-center justify-center gap-2 py-2 px-4 text-[12px] leading-[14.4px] !border-none !font-normal">
								<p className="text-xs truncate">Coming Soon ...</p>
							</Badge>
							:
							<div className="flex flex-row gap-4">
								<Button className="h-8 w-20 flex flex-row items-center gap-2 px-2.5" onClick={e => { e.stopPropagation(); setOpen(true) }}>
									<Plus size={18} strokeWidth={3} />
									Add
								</Button>
								<div className="flex items-center w-[90px] justify-evenly">
									<span className="flex items-center gap-0.5">
										<Check strokeWidth={2.5} className={`w-4 h-4 ${active ? 'text-green-600' : 'text-gray-400'}`} />
										<span className="text-sm">{active}</span>
									</span>
									<span className="flex items-center gap-0.5">
										<X strokeWidth={2.5} className={`w-4 h-4 ${inactive ? 'text-red-600' : 'text-gray-400'}`} />
										<span className="text-sm">{inactive}</span>
									</span>
								</div>
								<div className="flex items-center gap-8">
									<div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
										<ChevronDown className="w-5 h-5 text-gray-400" />
									</div>
								</div>
							</div>
						}
					</div>
				</button>

				{/* Animated Expandable Content */}
				{!disabled && <div
					className={`grid overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
						}`}
				>
					<div className="bg-[#04051B] overflow-hidden">
						<Separator className="bg-gray-700 w-full" />
						<SearchBar search={search} setSearch={setSearch} searchCallback={searchCallback} />
						<Pagination page={page} setPage={setPage} total={filteredList.length} perPage={perPage} />
						{shownIntegrations.length > 0 && <Separator className="bg-gray-700 w-full" />}
						{shownIntegrations.map((integration, index) => (
							<div key={integration.integration_id}>
								{type === 'type_1' ?
									<IntegrationItemType1 integrationName={name} data={integration} deleteIntegration={deleteIntegration} syncData={syncData} refreshIntegration={refreshIntegration} confirmIntegration={confirmIntegration} />
									:
									<IntegrationItemType2 integrationName={name} data={integration} deleteIntegration={deleteIntegration} syncData={syncData} />
								}
								{index !== shownIntegrations.length - 1 && <Separator className="bg-gray-700 w-full" />}
							</div>
						))}
					</div>
				</div>
				}
			</div>
			{type === 'type_1' ?
				<IntegrationFormType1
					open={open}
					setOpen={setOpen}
					data={{ name, image, icon }}
					provider={provider}
					refreshPageData={refreshPageData}
				/>
				:
				<IntegrationFormType2
					open={open}
					setOpen={setOpen}
					data={{ name, image, icon }}
					refreshPageData={refreshPageData}
				/>
			}
		</>
	);
};

export default IntegrationCategory;