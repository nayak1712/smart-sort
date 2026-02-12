import { useCallback, useState } from "react";
import { useFiles } from "@/contexts/FileContext";
import { motion, AnimatePresence } from "framer-motion";
import { Upload as UploadIcon, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatFileSize } from "@/lib/fileOrganizer";

const UploadPage = () => {
  const { addFiles, isProcessing } = useFiles();
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);

  const handleFiles = useCallback(async (fileList: FileList | File[]) => {
    const arr = Array.from(fileList).filter(f => f.type === "text/plain" || f.name.endsWith(".txt") || f.name.endsWith(".md") || f.name.endsWith(".csv") || f.type === "application/pdf");
    if (arr.length === 0) {
      toast({ title: "Unsupported files", description: "Please upload .txt, .md, or .csv files", variant: "destructive" });
      return;
    }
    await addFiles(arr);
    setUploadedCount(prev => prev + arr.length);
    toast({ title: "Files processed", description: `${arr.length} file(s) organized successfully` });
  }, [addFiles, toast]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Upload Files</h1>
        <p className="text-muted-foreground mt-1">Drop text files to analyze and organize automatically</p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 ${
          dragActive ? "border-primary bg-primary/5 glow-border" : "border-border hover:border-muted-foreground/30"
        }`}
      >
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-lg font-semibold text-foreground">Analyzing files…</p>
              <p className="text-sm text-muted-foreground">Extracting keywords and categorizing content</p>
            </motion.div>
          ) : (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <UploadIcon className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">Drag & drop files here</p>
                <p className="text-sm text-muted-foreground mt-1">Supports .txt, .md, and .csv files</p>
              </div>
              <Button variant="outline" className="mt-2" onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.multiple = true;
                input.accept = ".txt,.md,.csv";
                input.onchange = e => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files) handleFiles(files);
                };
                input.click();
              }}>
                Browse Files
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {uploadedCount > 0 && (
        <div className="glass-panel rounded-xl p-5 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <p className="text-sm text-foreground">
            <span className="font-semibold">{uploadedCount}</span> file(s) have been processed and organized
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
