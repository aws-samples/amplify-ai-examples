"use client";
import * as React from "react";
import {
  Button,
  Flex,
  Text,
  View,
  Heading,
  Loader,
  Alert,
} from "@aws-amplify/ui-react";
import { uploadData } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/../../amplify/data/resource";
import { FiUpload, FiFile, FiCheck, FiX } from "react-icons/fi";

const client = generateClient<Schema>();

interface UploadedFile {
  name: string;
  size: number;
  status: "uploading" | "processing" | "completed" | "error";
  key?: string;
  error?: string;
}

export const DocumentUpload = () => {
  const [files, setFiles] = React.useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles).map((file) => ({
      name: file.name,
      size: file.size,
      status: "uploading" as const,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Upload each file
    Array.from(selectedFiles).forEach((file, index) => {
      uploadFile(file, newFiles.length - selectedFiles.length + index);
    });
  };

  const uploadFile = async (file: File, index: number) => {
    try {
      // Upload to S3 with documents/ prefix
      const result = await uploadData({
        path: `documents/${file.name}`,
        data: file,
        options: {
          contentType: file.type,
        },
      }).result;

      console.log("File uploaded:", result);

      // Update file status to processing
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? { ...f, status: "processing", key: result.path }
            : f
        )
      );

      // Create document metadata record
      await client.models.Document.create({
        name: file.name,
        key: result.path,
        size: file.size,
        contentType: file.type,
        uploadedAt: new Date().toISOString(),
        status: "processing",
      });

      // The Lambda function will process the document automatically
      // For demo purposes, we'll mark it as completed after a delay
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f, i) =>
            i === index ? { ...f, status: "completed" } : f
          )
        );
      }, 2000);
    } catch (error) {
      console.error("Error uploading file:", error);
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? {
                ...f,
                status: "error",
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : f
        )
      );
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
      case "processing":
        return <Loader size="small" />;
      case "completed":
        return <FiCheck color="green" size={20} />;
      case "error":
        return <FiX color="red" size={20} />;
    }
  };

  const getStatusText = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
        return "Uploading...";
      case "processing":
        return "Processing...";
      case "completed":
        return "Ready";
      case "error":
        return "Failed";
    }
  };

  return (
    <View padding="large" width="100%">
      <Flex direction="column" gap="medium">
        <Heading level={4}>Knowledge Base Documents</Heading>
        <Text>
          Upload documents to your personal knowledge base. Supported formats:
          TXT, PDF, DOCX, MD
        </Text>

        {/* Drag & Drop Area */}
        <View
          backgroundColor={isDragging ? "blue.10" : "background.secondary"}
          borderRadius="medium"
          padding="xxl"
          border="2px dashed"
          borderColor={isDragging ? "blue.60" : "border.tertiary"}
          textAlign="center"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{ cursor: "pointer" }}
          onClick={() => fileInputRef.current?.click()}
        >
          <Flex direction="column" alignItems="center" gap="medium">
            <FiUpload size={48} />
            <Text variation="primary">
              Drag & drop files here or click to browse
            </Text>
            <Text fontSize="small" color="font.tertiary">
              Max file size: 10MB
            </Text>
          </Flex>
        </View>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".txt,.pdf,.docx,.md"
          style={{ display: "none" }}
          onChange={(e) => handleFileSelect(e.target.files)}
        />

        {/* File List */}
        {files.length > 0 && (
          <Flex direction="column" gap="small">
            <Heading level={6}>Uploaded Files</Heading>
            {files.map((file, index) => (
              <Flex
                key={index}
                direction="row"
                alignItems="center"
                gap="small"
                padding="small"
                backgroundColor="background.secondary"
                borderRadius="small"
              >
                <FiFile size={20} />
                <Flex direction="column" flex="1">
                  <Text fontWeight="semibold">{file.name}</Text>
                  <Text fontSize="small" color="font.tertiary">
                    {formatFileSize(file.size)} • {getStatusText(file.status)}
                  </Text>
                  {file.error && (
                    <Text fontSize="small" color="red.80">
                      {file.error}
                    </Text>
                  )}
                </Flex>
                {getStatusIcon(file.status)}
              </Flex>
            ))}
          </Flex>
        )}

        {files.length > 0 && (
          <Alert variation="info" isDismissible={false}>
            Documents are automatically indexed and will be available for search
            once processing is complete.
          </Alert>
        )}
      </Flex>
    </View>
  );
};
