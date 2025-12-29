/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PDFDocument } from "pdf-lib";
import { TruncateFileName } from "@/utils/truncateFileName";

interface FileWithProgress {
  file: File;
  name: string;
  type: string;
  size: number;
  progress: number;
  status: string; // 'uploading' or 'uploaded'
  binaryData?: string | ArrayBuffer | null; // Optional for storing binary data
}

interface FileUploadInputProps {
  files: FileWithProgress[];
  setFiles: React.Dispatch<React.SetStateAction<FileWithProgress[]>>;
}

  /**  Common component to render the file upload field in QRC views
 */
const FileUploadInput: React.FC<FileUploadInputProps> = ({
  files,
  setFiles,
}) => {
  const [error, setError] = useState<string | null>(null);

  /**  event handler for validating and setting file input field */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        name: file.name,
        type: file.type,
        size: file.size,
        progress: 0,
        status: "Uploading",
      }));

      const totalSize =
        newFiles.reduce((acc, file) => acc + file.size, 0) +
        files.reduce((acc, file) => acc + file.size, 0);

      if (totalSize > 5 * 1024 * 1024) {
        setError("The combined file size must be less than 5MB.");
        return;
      }

      // Check for duplicate file names
      const existingFileNames = new Set(files.map((f) => f.name));
      const hasDuplicate = newFiles.some((file) =>
        existingFileNames.has(file.name)
      );

      if (hasDuplicate) {
        setError("A file with the same name is already in the list.");
        return;
      }

      if (e.target.files.length + files.length > 3) {
        setError("You can only upload up to 3 files.");
        return;
      }

      for (const file of Array.from(e.target.files)) {
        if (file.size > 5 * 1024 * 1024) {
          setError("Each file must be less than 5MB.");
          return;
        }
        if (
          !["application/pdf", "image/jpeg", "image/png"].includes(file.type)
        ) {
          setError("Only PDF, JPG, and PNG files are allowed.");
          return;
        }

        // Check if PDF is password-protected
        if (file.type === "application/pdf") {
          const isPasswordProtected = await isPdfPasswordProtected(file);
          if (isPasswordProtected) {
            setError("Password-protected PDFs are not allowed.");
            return;
          }
        }
      }

      setError(null);
      setFiles((prev) => [...prev, ...newFiles]);

      // // Simulate file upload progress
      // newFiles.forEach((_, index) =>
      //   simulateFileUpload(index + files.length)
      // );
      // Convert files to binary and simulate file upload progress
      newFiles.forEach((file, index) => {
        convertFileToBinary(file.file, index + files.length);
      });
      e.target.value = ""; // Clear the file input value
    }
  };

  /**  function to show progress bar for file upload */
  const simulateFileUpload = (index: number) => {
    const interval = setInterval(() => {
      setFiles((prev) => {
        const newFileProgress = [...prev];
        if (newFileProgress[index]) {
          newFileProgress[index].progress += 1;
          if (newFileProgress[index].progress >= 100) {
            newFileProgress[index].progress = 100;
            newFileProgress[index].status = "Uploaded";
            clearInterval(interval);
          }
        }
        return newFileProgress;
      });
    }, 50);
  };

  /** function to get binary file data from uploaded file */
  const convertFileToBinary = (file: File, index: number) => {
    const reader = new FileReader();
    reader.onload = () => {
      setFiles((prev) => {
        const updatedFiles = [...prev];
        if (updatedFiles[index]) {
          updatedFiles[index].binaryData = reader.result;
        }
        return updatedFiles;
      });
      simulateFileUpload(index);
    };
    reader.readAsArrayBuffer(file);
  };

  /** function to delete uploaded file */
  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /**  function to check if uploaded pdf is password protected */
  const isPdfPasswordProtected = async (file: File): Promise<boolean> => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          const pdfDoc = await PDFDocument.load(
            e.target?.result as ArrayBuffer, // Read the file as an ArrayBuffer
            { ignoreEncryption: false } // Set ignoreEncryption to false
          );
          resolve(false);
        } catch (error) {
          if (error instanceof Error && error.message.includes("password")) {
            resolve(true);
          } else {
            resolve(true);
          }
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  /**  function to view file */
  const handleFileClick = (file: FileWithProgress) => {
    const url = URL.createObjectURL(file.file);
    window.open(url);
  };

  return (
    <div>
      <div className="bg-white border border-customBorder rounded-md p-4 flex flex-col items-left space-y-2">
        <label className="lg:w-1/4 w-1/2 flex flex-col items-left rounded-md py-2 cursor-pointer">
          <span>
            <Image
              src="/AttachFile.svg"
              alt="AttachFile"
              width={177}
              height={47}
              priority
            />
          </span>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        {error && <div className="text-red-500 text-xs">{error}</div>}

        <span className="text-sm font-medium text-customYellow lg:w-2/3 w-full text-wrap">
          Only PDF, PNG and JPG files up to 5 MB allowed. Maximum 3 files.
        </span>
        <div className="mt-2">
          {files.length > 0 && (
            <div className="w-full grid lg:grid-cols-2 grid-cols-1 gap-x-6 list-none">
              {files.map((file, index) => (
                <div key={index} className="flex flex-col space-y-1 mb-2 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{file.status}</span>
                    {file.status === "Uploading" ? (
                      <span
                        className=" cursor-pointer flex items-center justify-center w-5 h-5"
                        onClick={() => handleRemoveFile(index)}
                      >
                        x
                      </span>
                    ) : (
                      <span
                        className="cursor-pointer flex items-center justify-center h-5"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <Image src="bin.svg" alt="delete icon" width={18} height={20} className="" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center pb-1">
                    <span
                      className="w-1/3 text-sm cursor-pointer underline text-wrap overflow-hidden"
                      onClick={() => handleFileClick(file)}
                      title={file.name}
                    >
                      {TruncateFileName(file.name, 20)}
                    </span>
                    <span className="pl-4 w-1/3 text-sm">
                      size : {(file.size / 1024).toFixed(2)}kb
                    </span>
                    <span className="w-1/3 flex justify-end text-sm">
                      {file.progress !== 100 ? `${file.progress}%` : ""}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-progressBar h-2.5 rounded-full"
                      style={{ width: `${file.progress}%` }}
                    ></div>
                  </div>
                  {index < (files.length - 1) ? (
                    <div className={`${files.length == 3 ? "lg:border-b-2 lg:border-dashed lg:border-gray-300" : "lg:border-none lg:border-b-0"} border-b-2 border-dashed border-gray-300 pt-4 sm:w-full`}></div>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadInput;
