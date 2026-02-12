import React, { createContext, useContext, useState, ReactNode } from "react";
import { UploadedFile, categorizeFile, generateId } from "@/lib/fileOrganizer";

interface FileContextType {
  files: UploadedFile[];
  addFiles: (newFiles: File[]) => Promise<void>;
  getFilesByCategory: () => Record<string, UploadedFile[]>;
  selectedFile: UploadedFile | null;
  setSelectedFile: (f: UploadedFile | null) => void;
  isProcessing: boolean;
}

const FileContext = createContext<FileContextType | null>(null);

export const useFiles = () => {
  const ctx = useContext(FileContext);
  if (!ctx) throw new Error("useFiles must be used within FileProvider");
  return ctx;
};

export const FileProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const addFiles = async (newFiles: File[]) => {
    setIsProcessing(true);
    const processed: UploadedFile[] = [];

    for (const file of newFiles) {
      const content = await file.text();
      const { category, keywords, confidence } = categorizeFile(content);
      processed.push({
        id: generateId(),
        name: file.name,
        size: file.size,
        content,
        uploadedAt: new Date(),
        category,
        keywords,
        confidence,
      });
    }

    // Simulate AI processing delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 700));
    setFiles(prev => [...prev, ...processed]);
    setIsProcessing(false);
  };

  const getFilesByCategory = () => {
    const grouped: Record<string, UploadedFile[]> = {};
    for (const f of files) {
      if (!grouped[f.category]) grouped[f.category] = [];
      grouped[f.category].push(f);
    }
    return grouped;
  };

  return (
    <FileContext.Provider value={{ files, addFiles, getFilesByCategory, selectedFile, setSelectedFile, isProcessing }}>
      {children}
    </FileContext.Provider>
  );
};
