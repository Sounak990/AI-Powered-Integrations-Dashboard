/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import { createChat } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const ConnectionSelectForm = ({ connections, setHistory }) => {
	const { toast } = useToast();
	const navigate = useNavigate();

	const FormSchema = z.object({
		connectionId: z.string().min(1, "Connection is Required"),
	});

	const form = useForm({
		resolver: zodResolver(FormSchema),
	});

	const onSubmit = ({ connectionId }) => {
		createChat(connectionId)
			.then((response) => {
				console.log(response);
				setHistory((prev) => [response, ...prev]);
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
		<div className="flex flex-col gap-4 w-50">
			{/* <div className="flex flex-col w-full items-center">
				<p className="text-2xl">Select an Existing Chat</p>
			</div>
			<div className="flex flex-row items-center justify-center gap-1">
				<div className="w-full">
					<Separator className="bg-slate-300" />
				</div>
				OR
				<div className="w-full">
					<Separator className="bg-slate-300" />
				</div>
			</div> */}
			<div className="flex flex-col w-full items-center">
				<p className="text-2xl">Create a New Chat</p>
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-2 w-full"
				>
					<FormField
						control={form.control}
						name="connectionId"
						render={({ field }) => (
							<FormItem className="flex-1 w-full">
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger className="w-full h-8">
											<SelectValue placeholder="Select a Connection" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectGroup>
											{connections.map((connection) => (
												<SelectItem key={connection.connection_id} value={connection.connection_id}>
													{connection.connection_name}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>


					<Button
						type="submit"
						className="bg-primaryColor flex flex-row items-center gap-3 text-white"
					>
						{/* {loading && <Loader className="animate-spin" />} */}
						<p>Create Chat</p>
					</Button>
				</form>
			</Form>
		</div >
	);
}

export default ConnectionSelectForm;