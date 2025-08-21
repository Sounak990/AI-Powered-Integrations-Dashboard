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
import { useDropzone } from 'react-dropzone';
import { CloudUpload, FileText, FileX, X } from "lucide-react";
import { checkUniqueIntegrationName, createIntegrationType2 } from "@/services/api";
import { useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";

const FormSchema = z.object({
	integration_name: z.string().min(1, "Integration Name is required"),
	integration_description: z.string(),
});

let typingTimeout;

const IntegrationFormType2 = ({ open, setOpen, children, data, refreshPageData }) => {
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [uploading, setUploading] = useState(false);
	const initialValues = {
		integration_name: '',
		integration_description: '',
	}
	const tenantId = useSelector(
		(state) =>
			state.onboardingReducer.data?.tenant_id || state.login.user?.tenant_id
	)

	const { toast } = useToast();

	const { getRootProps, getInputProps, isDragActive, open: openFileDialog } = useDropzone({
		accept: { 'application/pdf': [], 'application/msword': [], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [] },
		maxSize: 20 * 1024 * 1024,
		multiple: true,
		noClick: true,
		onDrop: (acceptedFiles, fileRejections) => {
			// Handle accepted files
			if (acceptedFiles.length > 0) {
				setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
			}

			// Handle rejected files
			if (fileRejections.length > 0) {
				const errors = fileRejections
					.map((rejection) =>
						rejection.errors.map((e) => e.message).join(", ")
					)
					.join(". ");
				console.log("Rejected files:", errors);
			}
		}
	});

	const form = useForm({
		resolver: zodResolver(FormSchema),
		defaultValues: initialValues,
	});

	function onSubmit(integrations) {
		setUploading(true);
		const formData = new FormData();
		// Append form fields
		formData.append("name", integrations.integration_name);
		formData.append("description", integrations.integration_description || "");
		formData.append("tenant_id", tenantId); // Example static value

		// Append uploaded files
		uploadedFiles.forEach((file, index) => {
			console.log(file);
			formData.append(`files`, file);
		});
		// Configure Axios request
		form.clearErrors("integration_name");
		checkUniqueIntegrationName(form.watch("integration_name"))
			.then((response) => {
				if (!response.unique) {
					form.setError("integration_name", {
						type: "manual",
						message: "Integration Name already exists",
					});
					setUploading(false);
				}
				else {
					createIntegrationType2(formData)
						.then((response) => {
							setUploading(false);
							setOpen(false);
							form.reset();
							setUploadedFiles([]);
							refreshPageData();
							toast({
								variant: "success",
								title: "Success",
								description: response.message,
							});
						})
						.catch((error) => {
							console.log(error);
							setUploading(false);
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
				setUploading(false);
				toast({
					variant: "destructive",
					title: "Failure",
					description: error.message,
				});
			});
	}

	useEffect(() => {
		clearTimeout(typingTimeout);
		typingTimeout = setTimeout(() => {
			if (form.watch("integration_name") === '') return;
			form.clearErrors("integration_name");
			checkUniqueIntegrationName(form.watch("integration_name"))
				.then((response) => {
					if (!response.unique) {
						form.setError("integration_name", {
							type: "manual",
							message: "Integration Name already exists",
						});
					}
				})
		}, 500);
	}, [form.watch("integration_name")]);

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
			className="!bg-card-color !border-none"
		>
			{children && <DialogTrigger asChild>{children}</DialogTrigger>}
			<DialogContent className="max-w-full w-[90%] sm:w-[500px] lg:w-[700px] max-h-[90vh] overflow-y-auto !bg-card-color !border-none">
				<DialogHeader className="flex flex-row items-center gap-4 text-left">
					<div className="w-12">
						{data.image ?
							<img src={data.image} alt="logo" />
							:
							data.icon
						}
					</div>
					<DialogTitle className="m-0">Add {data.name} Integration</DialogTitle>
				</DialogHeader>
				<Separator className="bg-gray-600 w-full" />
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-6 w-full"
					>
						<div className="flex flex-col gap-2.5 w-full">
							<FormField
								control={form.control}
								name="integration_name"
								render={({ field }) => (
									<FormItem className="space-y-0.5 flex-1 w-full">
										<FormLabel className="mb-0">Integration Name*</FormLabel>
										<FormControl>
											<Input {...field} className="w-full h-8" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="integration_description"
								render={({ field }) => (
									<FormItem className="space-y-0.5 flex-1 w-full">
										<FormLabel className="mb-0">Integration Description</FormLabel>
										<FormControl>
											<Input {...field} className="w-full h-8" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="relative">
							{uploading &&
								<div className="z-10 flex flex-row gap-2 w-full h-full absolute top-0 left-0 justify-center items-center bg-black/70 text-white p-4 rounded-md">
									<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Uploading Files
								</div>
							}
							<div className="flex flex-col gap-6 w-full p-2">
								{uploadedFiles.length ?
									<div className="flex flex-row gap-4 items-start flex-wrap ">
										{uploadedFiles.map((file, index) => (
											<div key={index} className="flex flex-col gap-2 text-left relative w-[100px] items-center">
												<button onClick={() => setUploadedFiles(uploadedFiles.filter((f) => f !== file))} type="button" className="absolute top-0 right-0 text-red-400" >
													<X size={24} />
												</button>
												<FileText size={48} className="text-primaryColor" />
												<div className="text-sm text-left truncate overflow-ellipsis max-w-full">{file.name}</div>
												<div className="text-xs text-gray-500">
													{file.size >= 1024 * 1024
														? `(${(file.size / (1024 * 1024)).toFixed(2)} MB)`
														: `(${(file.size / 1024).toFixed(2)} KB)`}
												</div>

											</div>
										))}
									</div>
									:
									<div className="flex flex-row gap-2 items-center text-center justify-center bg-transparent border !border-dashed border-gray-400 rounded-md">
										<FileX size={48} className="text-red-400" />
										<div className="text-sm font-semibold">No Files Uploaded Yet</div>
									</div>
								}
								<div className="w-full">
									<button {...getRootProps()} type="button" onClick={openFileDialog} className="flex w-full flex-col items-center text-center bg-transparent border !border-dashed border-gray-400 rounded-md">
										<input {...getInputProps()} className="hidden" />
										<div className="flex flex-row gap-2">
											<CloudUpload size={48} className="text-primaryColor" />
											<div className="flex flex-col gap-2">
												<div className="text-sm font-semibold">Drag and Drop or Click</div>
												<div className="text-xs text-gray-500">(PDF, DOCX, DOC)</div>
											</div>
										</div>
										{/* <button className="bg-yellow-500 text-white py-2 px-4 rounded" onClick={openFileDialog}>Upload</button> */}
									</button>
								</div>
							</div>
						</div>

						<DialogFooter className="flex flex-col sm:flex-row sm:gap-2 w-full justify-end">
							<DialogClose className="bg-primaryColor/15 text-primaryColor !border-none px-4 py-2 rounded-md">
								Cancel
							</DialogClose>
							<Button
								type="submit"
								className="bg-primaryColor flex flex-row items-center gap-3 text-white"
								disabled={uploading}
							>
								Add
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent >
		</Dialog >
	);
};

export default IntegrationFormType2;
