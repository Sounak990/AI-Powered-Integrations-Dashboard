import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { uploadGradingFile } from "../../../services/api";
import UploadFileICon from "../../../assets/images/svg/upload-file.svg";
import { useDropzone } from "react-dropzone";
import { useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const KnowledgeUploadTab = ({ tenantId, username }) => {
  const [roleplayFile, setRoleplayFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const { toast } = useToast();
  const roleplayFiles = useSelector(
    (state) =>
      state.kbReducer?.data?.filter((file) => file.type === "roleplay") || []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    accept: {
      "application/pdf": [".pdf"],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        setRoleplayFile(acceptedFiles[0]);
      } else {
        setRoleplayFile(null);
      }
    },
  });

  const submitRoleplayFile = async () => {
    if (roleplayFile) {
      setLoading(true);
      try {
        const response = await uploadGradingFile(
          roleplayFile,
          tenantId,
          username
        );

        toast({
          variant: "success",
          title: "Success",
          description: response.message,
        });
        setAlertVisible(true);
        setRoleplayFile(null);
      } catch (error) {
        console.error("Error uploading roleplay file:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmitCancel = () => {
    setRoleplayFile(null);
  };

  useEffect(() => {
    console.log("uploaded file", roleplayFile);
  }, [roleplayFile]);

  return (
    <div className="flex flex-col gap-4 w-full h-full items-center ">
      {!roleplayFile && (
        <div
          {...getRootProps({
            className: `mt-36 flex flex-row items-center justify-center h-[140px] max-w-[450px] w-full  border !border-dashed rounded-xl border-spacing-2 !border-primaryColor ${
              isDragActive ? "bg-primaryColor" : "bg-primaryColor/25"
            } `,
          })}
        >
          <div className="flex flex-row items-center gap-3">
            <input {...getInputProps()} />
            <img src={UploadFileICon} className="w-[47px] h-[47px]" />
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-lg leading-[22px]">
                Upload Grading File
              </p>
              <p className="text-white/55 text-sm">Click or Drag & Drop</p>
            </div>
          </div>
        </div>
      )}
      {roleplayFile && (
        <div className=" !rounded-2xl pt-20 flex flex-col relative z-10 h-full">
          <div className="flex flex-col w-full h-[calc(100vh-300px)] overflow-y-auto !rounded-xl">
            <Document file={roleplayFile} className="rounded-2xl z-10">
              <Page
                className="!rounded-2xl"
                pageNumber={1}
                height={770}
                width={800}
              />
            </Document>
          </div>
          <div className="flex flex-row items-center gap-7 justify-center absolute bottom-5 w-full h-max  py-6 z-20 bg-gradient-to-b from-transparent via-gray-500 via-30% to-black">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="bg-primaryColor/15 !border-none text-primaryColor"
                  disabled={loading}
                >
                  <p>Cancel</p>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-card-color">
                <DialogHeader>
                  <DialogTitle>Discard & Go Back?</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to discard the document and go back?
                  </DialogDescription>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button className="bg-primaryColor/25 text-primaryColor">
                        No, Stay on this page
                      </Button>
                    </DialogClose>
                    <Button
                      className="bg-primaryColor "
                      onClick={handleSubmitCancel}
                    >
                      Yes, Go Back
                    </Button>
                  </DialogFooter>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <Button
              className="bg-primaryColor text-white border-none !py-2 !px-5 flex flex-row items-center gap-3"
              onClick={submitRoleplayFile}
              disabled={loading}
            >
              {loading && <Loader className="animate-spin" />}
              <p>Submit</p>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeUploadTab;
