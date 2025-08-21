/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import { checkUniqueConnectionName, createConnection } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Description } from "@radix-ui/react-dialog";
import Markdown from "markdown-to-jsx";
import description from "../description.json"
import styled from "styled-components";

const FormSchema = z.object({
	integrations: z.string().min(1, "Please select atleast 1 integration"),
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
});

let typingTimeout;

const Container = styled.div`
	& * {
		list-style-type: disc;
		margin: revert;
		padding: revert;
	}
`;

const AgentForm = ({ open, setOpen, initialValues, integrations, children, data, refreshPageData }) => {
	const form = useForm({
		resolver: zodResolver(FormSchema),
		defaultValues: initialValues,
	});

	const tenantId = useSelector(
		(state) =>
			state.onboardingReducer.data?.tenant_id || state.login.user?.tenant_id
	)

	const { toast } = useToast();

	const [selectedIntegrations, setSelectedIntegrations] = useState([]);
	// const [systemPrompt, setSystemPrompt] = useState("");

	const handleChange = (item) => {
		if (selectedIntegrations.includes(item)) {
			setSelectedIntegrations(selectedIntegrations.filter((int) => int !== item));
			form.setValue("integrations", selectedIntegrations.filter((int) => int !== item).map(int => int.integration_name).join(","));
		} else {
			setSelectedIntegrations([...selectedIntegrations, item]);
			form.setValue("integrations", [...selectedIntegrations, item].map(int => int.integration_name).join(","));
		}
	};

	function onSubmit(values) {
		console.log(values);
		const payload = {
			connection_name: values.name,
			connection_description: values.description,
			tenant_id: tenantId,
			llm_model_config: {
				model_provider: initialValues.model_provider,
				model_name: initialValues.model_name,
				temperature: initialValues.temperature,
				max_tokens: initialValues.max_tokens,
				top_p: initialValues.top_p,
				frequency_penalty: initialValues.frequency_penalty,
				presence_penalty: initialValues.presence_penalty
			},
			rag_config: {
				agent_type: data.type,
				integration_ids: selectedIntegrations.map(int => int.integration_id)
			}
		};

		form.clearErrors("name");
		checkUniqueConnectionName(form.watch("name"))
			.then((response) => {
				if (!response.unique) {
					form.setError("name", {
						type: "manual",
						message: "Connection Name already exists",
					});
				}
				else {
					createConnection(payload)
						.then((response) => {
							refreshPageData();
							form.reset();
							setOpen(false);
							toast({
								variant: "success",
								title: "Success",
								description: response.message,
							});
						})
						.catch((error) => {
							console.log(error);
							toast({
								variant: "destructive",
								title: "Failure",
								description: error.message,
							});
						});
				}
			})
			.catch((error) => {
				console.log(error);
				toast({
					variant: "destructive",
					title: "Failure",
					description: error.message,
				});
			});
	}

	useEffect(() => {
		console.log(selectedIntegrations);
	}, [selectedIntegrations]);

	useEffect(() => {
		clearTimeout(typingTimeout);
		typingTimeout = setTimeout(() => {
			if (form.watch("name") === '') return;
			form.clearErrors("name");
			checkUniqueConnectionName(form.watch("name"))
				.then((response) => {
					if (!response.unique) {
						form.setError("name", {
							type: "manual",
							message: "Connection Name already exists",
						});
					}
				})
		}, 500);
	}, [form.watch("name")]);

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
			className="!bg-card-color !border-none"
		>
			{children && <DialogTrigger asChild>{children}</DialogTrigger>}
			<DialogContent className="max-w-full w-[90%] sm:w-[500px] lg:w-[700px] max-h-[90vh] overflow-y-auto !bg-card-color !border-none">
				<Description>
					Install {data.name}
				</Description>
				<DialogHeader className="flex flex-column items-center gap-2 text-left w-full">
					<div className="flex flex-row items-center gap-3 justify-start w-full">
						<div className="w-12">
							<img src={data.image} alt="logo" />
						</div>
						<DialogTitle className="m-0">{data.name}</DialogTitle>
					</div>
					<details className="w-full">
						<summary>More Details</summary>
						<Container>
							<Markdown>{description[data.type]}</Markdown>
						</Container>
					</details>
				</DialogHeader>
				<Separator className="bg-gray-600 w-full" />
				{/* <div className="flex flex-row items-center gap-4 truncate">
					<div className="w-12">
						<img src={data.image} alt="logo" />
					</div>
					<div className='truncate'>
						<div className='flex flex-row items-center gap-4'>
							<div className="text-base font-medium">{data.name}</div>
						</div>
						<div className="text-sm text-gray-500 truncate">{data.text}</div>
					</div>
				</div> */}
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-6 w-full"
					>
						<div className="flex flex-col gap-2.5 w-full">

							<FormField
								control={form.control}
								name="integrations"
								render={() => (
									<FormItem className="space-y-0.5 flex-1 w-full">
										<FormLabel className="mb-0">Select Integrations*</FormLabel>
										<DropdownMenu modal={false} disabled={integrations.length === 0}>
											<DropdownMenuTrigger asChild>
												<Button variant="outline" className="text-wrap flex h-fit w-full justify-between rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
													{selectedIntegrations.length > 0 ?
														<div className="text-base text-left flex flex-row gap-1 flex-wrap">
															{selectedIntegrations.map((integration, index) => (
																<div className="border rounded-2xl px-2 bg-gray-700/50 max-h-min text-xs" key={index}>{integration.integration_name}</div>
															))}
														</div>
														:
														"Select Integrations"
													}
													<ChevronDown className="min-h-4 min-w-4 opacity-50" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
												{integrations.length === 0 ?
													"No Active Integrations Available"
													:
													integrations.map((item) => {
														return (
															<DropdownMenuCheckboxItem
																key={item.integration_id}
																checked={selectedIntegrations.includes(item)}
																onCheckedChange={() => handleChange(item)}
																onSelect={(e) => e.preventDefault()}
															>
																{item.integration_name}
															</DropdownMenuCheckboxItem>
														);
													})}
											</DropdownMenuContent>
										</DropdownMenu>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem className="space-y-0.5 flex-1 w-full">
										<FormLabel className="mb-0">Connection Name*</FormLabel>
										<FormControl>
											<Input {...field} className="w-full h-8" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem className="space-y-0.5 flex-1 w-full">
										<FormLabel className="mb-0">Connection Description</FormLabel>
										<FormControl>
											<Input {...field} className="w-full h-8" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-2 gap-2.5 w-full">
							<div className="col-span-2 text-lg font-semibold">Model Config</div>
							<FormField
								control={form.control}
								name="model_provider"
								render={({ field }) => (
									<FormItem className="space-y-0.5 flex-1 w-full">
										<FormLabel className="mb-0">Model Provider</FormLabel>
										<FormControl>
											<Input {...field} className="w-full h-8" disabled />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="model_name"
								render={({ field }) => (
									<FormItem className="space-y-0.5 flex-1 w-full">
										<FormLabel className="mb-0">Model Name</FormLabel>
										<FormControl>
											<Input {...field} className="w-full h-8" disabled />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="temperature"
								render={({ field }) => (
									<FormItem className="space-y-0.5 flex-1 w-full">
										<FormLabel className="mb-0">Temperature</FormLabel>
										<FormControl>
											<Input {...field} className="w-full h-8" disabled />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="max_tokens"
								render={({ field }) => (
									<FormItem className="space-y-0.5 flex-1 w-full">
										<FormLabel className="mb-0">Max Tokens</FormLabel>
										<FormControl>
											<Input {...field} className="w-full h-8" disabled />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="top_p"
								render={({ field }) => (
									<FormItem className="space-y-0.5 flex-1 w-full">
										<FormLabel className="mb-0">Top P</FormLabel>
										<FormControl>
											<Input {...field} className="w-full h-8" disabled />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="frequency_penalty"
								render={({ field }) => (
									<FormItem className="space-y-0.5 flex-1 w-full">
										<FormLabel className="mb-0">Frequency Penalty</FormLabel>
										<FormControl>
											<Input {...field} className="w-full h-8" disabled />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="presence_penalty"
								render={({ field }) => (
									<FormItem className="space-y-0.5 flex-1 w-full">
										<FormLabel className="mb-0">Presence Penalty</FormLabel>
										<FormControl>
											<Input {...field} className="w-full h-8" disabled />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter className="flex flex-col sm:flex-row sm:gap-2 w-full justify-end">
							<DialogClose className="bg-primaryColor/15 text-primaryColor !border-none px-4 py-2 rounded-md">
								Cancel
							</DialogClose>
							<Button
								type="submit"
								className="bg-primaryColor flex flex-row items-center gap-3 text-white"
							>
								Add
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default AgentForm;
