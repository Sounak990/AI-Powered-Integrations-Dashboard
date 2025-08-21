import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { initializeSalesforce, connectSalesforceSuccess } from "@/store/integration/salesforce/actions";
import { initializeSlack, connectSlackSuccess } from "@/store/integration/slack/actions";
import ClientCredentialsForm from "../../components/Integration/Salesforce/ClientCredentialsForm";
import SlackIntegration from "../../components/Integration/Slack/SlackIntegration";
import IntegrationCard from "@/components/Integration/IntegrationCard";
import AlertNotification from "@/components/ui/AlertNotification";
import useQuietRefresh from "@/hooks/useQuietRefresh";
import { FaSlack, FaCloud, FaSalesforce, FaRobot } from "react-icons/fa";
import {
	nangoService,
	slackRefresh,
	fetchIntegrations,
	confirmIntegration,
	fetchConnections,
	refreshIntegration,
	syncData,
	deleteIntegration,
	createSessionToken,
	deleteConnection,
	createChat
} from "@/services/api";

import { Card, CardContent } from "@/components/ui/card";
import { Settings, CircleCheckBig, Clock, Plus, FileUp, } from 'lucide-react';
import zendeskLogo from '../../assets/images/integrations/zendesk.svg';
import salesforceLogo from '../../assets/images/integrations/salesforce.svg';
import hubspotLogo from '../../assets/images/integrations/hubspot.svg';
import IntegrationCategory from './Components/IntegrationCategory';
import AgentItem from './Components/AgentItem';
import ConnectionItem from "./Components/ConnectionItem";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
	document.title = "Home | Chainwide - AI Middleware";
	const [modalOpen, setModalOpen] = useState(false);
	const [activeTab, setActiveTab] = useState('integrations');
	const [fetchedIntegrations, setFetchedIntegrations] = useState([]);

	const { toast } = useToast();
	const navigate = useNavigate();

	const dispatch = useDispatch();

	const salesforceState = useSelector(state => state.salesforce);
	const slackConnected = useSelector(state => state.slack.connected);
	const tenantId = useSelector(
		(state) =>
			state.onboardingReducer.data?.tenant_id || state.login.user?.tenant_id
	)

	const [integrations, setIntegrations] = useState({ salesforce: [], fileUpload: [] });
	const [connections, setConnections] = useState([]);

	useEffect(() => {
		dispatch(initializeSalesforce());
		dispatch(initializeSlack());
	}, [dispatch]);

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
	}

	const getIntegrations = () => {
		fetchIntegrations(tenantId)
			.then((response) => {
				const categorizedIntegrations = response.reduce((acc, integration) => {
					if (integration.provider === 'salesforce') {
						acc.salesforce.push(integration);
					} else if (integration.provider === 'file-provider' || integration.provider === null) {
						acc.fileUpload.push(integration);
					}
					// else {
					// 	acc.salesforce.push({ ...integration, provider: 'salesforce' }); // FOR TEST DELETE LATER OR ELSE AAAAAAAAAAAAAA
					// }
					return acc;
				}, { salesforce: [], fileUpload: [] });
				setIntegrations(categorizedIntegrations);
				setFetchedIntegrations(response);
			})
			.catch((error) => {
				console.error("Error fetching integrations: ", error);
				toast({
					variant: "destructive",
					title: "Error",
					description: error.message,
				});
			});
	}

	useEffect(() => {
		if (tenantId) {
			getIntegrations();
			getConnections();
		}
	}, [tenantId]);

	useQuietRefresh(salesforceState.connected, tenantId, 'Salesforce', nangoService.refreshNangoIntegration, connectSalesforceSuccess);
	useQuietRefresh(slackConnected, tenantId, 'Slack', slackRefresh, connectSlackSuccess);

	const refreshPageData = () => {
		getIntegrations();
		getConnections();
	}

	const refreshInt = (provider, integrationId) => {
		refreshIntegration(integrationId)
			.then(() => {
				toast({
					variant: "success",
					title: "Success",
					description: "Integration refreshed successfully",
				});
			})
			.catch((error) => {
				console.error("Error refreshing integration: ", error);
				toast({
					variant: "destructive",
					title: "Error",
					description: error.message,
				});
			});
	};

	const syncInt = (provider, integrationId) => {
		// setIntegrations((prevIntegrations) => {
		// 	const updatedIntegrations = { ...prevIntegrations };
		// 	updatedIntegrations[provider] = updatedIntegrations[provider].map((integration) => {
		// 		if (integration.integration_id === integrationId) {
		// 			return { ...integration, integration_sync_status: "syncing" };
		// 		}
		// 		return integration;
		// 	});
		// 	return updatedIntegrations;
		// }); // test for now, else unccommment below
		syncData(integrationId)
			.then(() => {
				setIntegrations((prevIntegrations) => {
					const updatedIntegrations = { ...prevIntegrations };
					updatedIntegrations[provider] = updatedIntegrations[provider].map((integration) => {
						if (integration.integration_id === integrationId) {
							return { ...integration, integration_sync_status: "syncing" };
						}
						return integration;
					});
					return updatedIntegrations;
				});
			})
			.catch((error) => {
				console.error("Error syncing data: ", error);
				toast({
					variant: "destructive",
					title: "Error",
					description: error.message,
				});
			});
	};

	const deleteInt = (provider, integrationId) => {
		deleteIntegration(tenantId, integrationId)
			.then(() => {
				setIntegrations((prevIntegrations) => {
					const updatedIntegrations = { ...prevIntegrations };
					updatedIntegrations[provider] = updatedIntegrations[provider].filter((integration) => integration.integration_id !== integrationId);
					return updatedIntegrations;
				});
			})
			.catch((error) => {
				console.error("Error deleting integration: ", error);
				toast({
					variant: "destructive",
					title: "Error",
					description: error.message,
				});
			});
	}

	const deleteConn = (connectionId) => {
		deleteConnection(tenantId, connectionId)
			.then(() => {
				setConnections((prevConnections) => prevConnections.filter((connection) => connection.connection_id !== connectionId));
			})
			.catch((error) => {
				console.error("Error deleting connection: ", error);
				toast({
					variant: "destructive",
					title: "Error",
					description: error.message,
				});
			});
	}

	const confirmInt = (provider, data) => {
		const payload = {
			integration_id: data.integration_id,
			client_id: data.client_id,
			client_secret: data.client_secret,
			provider: provider,
			tenant_id: tenantId,
			nango_integration_id: data.nango_integration_id,
			integration_name: data.integration_name,
			integration_description: data.integration_description
		};

		createSessionToken(data.integration_id)
			.then((response) => {
				nangoService.performNangoAuth(data.nango_integration_id, response.session_token.data.token).
					then((response) => {
						confirmIntegration({ ...payload, nango_connection_id: response.connectionId })
							.then(() => {
								toast({
									variant: "success",
									title: "Success",
									description: "Integration confirmed successfully",
								});
								setIntegrations((prevIntegrations) => {
									const updatedIntegrations = { ...prevIntegrations };
									updatedIntegrations[provider] = updatedIntegrations[provider].map((integration) => {
										if (integration.integration_id === data.integration_id) {
											return { ...integration, integration_status: "pending" };
										}
										return integration;
									});
									return updatedIntegrations;
								});
							})
							.catch((error) => {
								console.error("Error confirming integration: ", error);
								toast({
									variant: "destructive",
									title: "Error",
									description: error.message,
								});
							});
					})
					.catch((error) => {
						console.error("Error during Nango Auth: ", error);
						toast({
							variant: "destructive",
							title: "Error",
							description: error.message,
						});
					});
			})
			.catch((error) => {
				console.error("Error creating session token: ", error);
				toast({
					variant: "destructive",
					title: "Error",
					description: error.message,
				});
			});
	}

	const tryRAG = (connectionId) => {
		createChat(connectionId)
			.then((response) => {
				navigate(`/chat-interface/${response.chat_id}`);
			})
			.catch((error) => {
				console.error("Error creating chat: ", error);
				toast({
					variant: "destructive",
					title: "Error",
					description: error.message,
				});
			})
	}

	return (
		<div className="w-full h-[calc(100vh-70px)] overflow-y-auto mt-[70px] font-Gilroy py-3 px-3 bg-background text-white flex flex-col gap-4">

			{/* Main heading */}
			<div className="flex flex-row items-center justify-between w-full h-max">
				<h1 className="font-semibold text-[32px] leading-10 text-gray-100">Integrations</h1>
			</div>

			<div className="flex flex-row gap-4 border-b border-gray-700">
				<button
					className={`px-4 py-2 ${activeTab === 'integrations' ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-400'}`}
					onClick={() => setActiveTab('integrations')}
				>
					Data Source
				</button>
				<button
					className={`px-4 py-2 ${activeTab === 'rag-agents' ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-400'}`}
					onClick={() => setActiveTab('rag-agents')}
				>
					RAG Agents
				</button>
			</div>

			{/* Integration Cards */}
			{activeTab === 'integrations' &&
				<div className="w-full flex flex-col gap-2">
					<IntegrationCategory
						name="Salesforce"
						text="Cloud-based CRM platform"
						image={salesforceLogo}
						integrations={integrations.salesforce || []}
						type="type_1"
						provider="salesforce"
						deleteIntegration={(id) => deleteInt("salesforce", id)}
						syncData={(id) => syncInt("salesforce", id)}
						refreshIntegration={(id) => refreshInt("salesforce", id)}
						confirmIntegration={(data) => confirmInt("salesforce", data)}
						refreshPageData={refreshPageData}
					/>
					<IntegrationCategory
						name="File Upload"
						text="PDFs and Docs"
						integrations={integrations.fileUpload || []}
						icon={<FileUp size={48} className="text-primaryColor" />}
						type="type_2"
						provider={"fileUpload"}
						deleteIntegration={(id) => deleteInt("fileUpload", id)}
						syncData={(id) => syncInt("fileUpload", id)}
						refreshIntegration={(id) => refreshInt("fileUpload", id)}
						confirmIntegration={(data) => confirmInt("fileUpload", data)}
						refreshPageData={refreshPageData}
					/>
					<IntegrationCategory name="Hubspot" text="Customer support platform" image={hubspotLogo} disabled />
					<IntegrationCategory name="Zendesk" text="Customer support platform" image={zendeskLogo} disabled />
				</div>
			}

			{activeTab === 'rag-agents' &&
				<div className="w-full flex flex-col gap-8">
					<div className="w-full flex flex-col gap-2">
						<div className="text-2xl font-semibold text-primaryColor">Available Agents</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 min-[992px]:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-[1880px]:grid-cols-5 gap-2">
							{/* <div className="w-full flex flex-row gap-2 flex-wrap"> */}
							<AgentItem name="Salesforce Agent" text="Salesforce support" type="salesforce_agent" image={salesforceLogo} integrations={integrations.salesforce} refreshPageData={refreshPageData} />
							<AgentItem name="Customer Support Agent" text="Customer support" type="customer_service_agent" image={hubspotLogo} integrations={integrations.fileUpload} refreshPageData={refreshPageData} />
							<button className="text-gray-500 flex items-center justify-center p-4 bg-[#04051B] border-gray-100 hover:bg-[#04051B] focus:outline-none focus:bg-[#04051B]" disabled>
								<div className="text-inherit text-base flex flex-row gap-2">
									<Plus className="w-6 h-6" />
									Create
								</div>
							</button>
						</div>
					</div>
					<div className="w-full flex flex-col gap-2">
						<div className="text-2xl font-semibold text-primaryColor">Installed Agents</div>
						{connections.length === 0 ?
							<div className="w-full border-dashed border-2 border-gray-600 rounded-lg font-medium">
								<p className="text-center text-lg">
									No agents installed
								</p>
							</div>
							:
							<div className="grid grid-cols-1 sm:grid-cols-2 min-[992px]:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-[1880px]:grid-cols-5 gap-2">
								{connections.map((connection, index) => (
									<ConnectionItem
										key={index}
										data={connection}
										integrations={connection.rag_config.integration_ids?.map(id => fetchedIntegrations.find(int => int.integration_id === id))?.filter(e => e)}
										deleteConnection={() => deleteConn(connection.connection_id)}
										tryRAG={() => tryRAG(connection.connection_id)}
										deleteIntegration={deleteInt}
										syncData={syncInt}
										refreshIntegration={refreshInt}
										confirmIntegration={confirmInt}
									/>
								))}
							</div>
						}
					</div>
				</div>
			}


			<div className="grid-cols-1 min-[850px]:grid-cols-2 min-[992px]:grid-cols-1 xl:grid-cols-2 gap-4 hidden">

				{/* Salesforce Integration Card */}
				<Card className="relative w-full border-gray-600 shadow-xl" style={{ background: 'linear-gradient(270deg, rgba(13, 157, 218, 0.8) 0%, rgba(4, 5, 27, 0.8) 100%)' }}>
					<CardContent className="relative text-white p-0 h-full">
						<div className="flex flex-col justify-between h-full space-y-4">
							<div className="flex flex-col space-y-4 p-4 pb-0">
								<div className="flex items-center space-x-4">
									<img
										src={salesforceLogo}
										alt="Hubspot Logo"
										className="h-10"
									/>
									<h2 className="text-3xl font-semibold tracking-tight">Salesforce</h2>
								</div>
								<p className="text-lg text-gray-100 leading-relaxed">
									Cloud-based CRM platform that helps businesses manage sales, marketing, and customer service, automating processes for improved customer relationships
								</p>
							</div>
							<div className="flex justify-between items-center px-4 py-3 rounded-b-lg" style={{ backgroundColor: '#04051B' }}>
								<div>
									{/* <ClientCredentialsForm
										open={modalOpen}
										setOpen={setModalOpen}
										initialValues={{ clientId: '', clientSecret: '' }} // Set initial values if needed
										actionButtonText="Save"
									>
										<button
											className="flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-full transition-colors"
											onClick={() => setModalOpen(true)}
										>
											<Settings className="w-6 h-6" />
										</button>
									</ClientCredentialsForm> */}
								</div>
								<div className="px-3 py-1 text-green-100 bg-green-700 rounded-full text-sm font-medium tracking-wide">
									<div className="flex items-center flex-row gap-2">
										<CircleCheckBig className="w-4 h-4" />
										<div>
											Connected
										</div>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
				{/* <Card className="bg-gray-900 border border-gray-600 text-white rounded-lg shadow-md">
					<CardContent className="p-6 flex flex-col items-center space-y-4">
						<div className="text-xl font-semibold text-white">Salesforce</div>
						<div>
							<span className="px-3 py-1 text-sm font-medium text-green-100 bg-green-700 rounded-full">
								Connected
							</span>
						</div>
						<div>
							<ClientCredentialsForm
								open={modalOpen}
								setOpen={setModalOpen}
								initialValues={{ clientId: '', clientSecret: '' }} // Set initial values if needed
								actionButtonText="Save"
							>
								<button
									className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
									onClick={() => setModalOpen(true)}
								>
									Manage
								</button>
							</ClientCredentialsForm>
						</div>
					</CardContent>
				</Card>
				*/}

				{/* Google Cloud Integration Placeholder */}
				<Card className="relative w-full border-gray-600 shadow-xl" style={{ background: 'linear-gradient(270deg, rgba(255, 92, 53, 0.8) 0%, rgba(4, 5, 27, 0.8) 100%)' }}>
					<CardContent className="relative text-white p-0 h-full">
						<div className="flex flex-col justify-between h-full space-y-4">
							<div className="flex flex-col space-y-4 p-4 pb-0">
								<div className="flex items-center space-x-4">
									<img
										src={hubspotLogo}
										alt="Hubspot Logo"
										className="h-10"
									/>
									<h2 className="text-3xl font-semibold tracking-tight">Hubspot</h2>
								</div>
								<p className="text-lg text-gray-100 leading-relaxed">
									All-in-one CRM platform for inbound marketing, sales, and customer service, automating communication to engage and delight customers.
								</p>
							</div>
							<div className="flex justify-between items-center px-4 py-3 rounded-b-lg" style={{ backgroundColor: '#04051B' }}>
								<div>
									<button
										className="flex items-center justify-center text-gray-600 hover:bg-transparent rounded-full transition-colors"
										disabled
									>
										<Settings className="w-6 h-6" />
									</button>
								</div>
								<div className="px-3 py-1 text-gray-300 bg-gray-700 rounded-full text-sm font-medium tracking-wide">
									<div className="flex items-center flex-row gap-2">
										<Clock className="w-4 h-4" />
										<div>
											Coming Soon
										</div>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Zendesk Integration Placeholder */}
				<Card className="relative w-full border-gray-600 shadow-xl" style={{ background: 'linear-gradient(270deg, rgba(3, 54, 61, 0.8) 0%, rgba(4, 5, 27, 0.8) 100%)' }}>
					<CardContent className="relative text-white p-0 h-full">
						<div className="flex flex-col justify-between h-full space-y-4">
							<div className="flex flex-col space-y-4 p-4 pb-0">
								<div className="flex items-center space-x-4">
									<img
										src={zendeskLogo}
										alt="Hubspot Logo"
										className="h-10"
									/>
									<h2 className="text-3xl font-semibold tracking-tight">Zendesk</h2>
								</div>
								<p className="text-lg text-gray-100 leading-relaxed">
									Customer support platform designed to streamline help desk operations, ticketing, and communication, improving customer service experiences.
								</p>
							</div>
							<div className="flex absolute-bottom justify-between items-center px-4 py-3 rounded-b-lg" style={{ backgroundColor: '#04051B' }}>
								<div>
									<button
										className="flex items-center justify-center text-gray-600 hover:bg-transparent rounded-full transition-colors"
										disabled
									>
										<Settings className="w-6 h-6" />
									</button>
								</div>
								<div className="px-3 py-1 text-gray-300 bg-gray-700 rounded-full text-sm font-medium tracking-wide">
									<div className="flex items-center flex-row gap-2">
										<Clock className="w-4 h-4" />
										<div>
											Coming Soon
										</div>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default Home;
