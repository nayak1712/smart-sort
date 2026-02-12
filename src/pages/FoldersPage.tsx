import { useFiles } from "@/contexts/FileContext";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, FileText, X, Tag, Percent, Clock } from "lucide-react";
import { formatFileSize } from "@/lib/fileOrganizer";
import { Badge } from "@/components/ui/badge";

const FOLDER_COLORS: Record<string, string> = {
  Education: "bg-blue-500/10 text-blue-500",
  Finance: "bg-emerald-500/10 text-emerald-500",
  Health: "bg-rose-500/10 text-rose-500",
  Technology: "bg-violet-500/10 text-violet-500",
  Legal: "bg-amber-500/10 text-amber-500",
  Marketing: "bg-cyan-500/10 text-cyan-500",
  Others: "bg-muted text-muted-foreground",
};

const FoldersPage = () => {
  const { getFilesByCategory, selectedFile, setSelectedFile, files } = useFiles();
  const categories = getFilesByCategory();

  if (files.length === 0) {
    return (
      <div className="animate-fade-in text-center py-20">
        <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground">No files yet</h2>
        <p className="text-muted-foreground mt-1">Upload files to see them organized into semantic folders</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Semantic Folders</h1>
        <p className="text-muted-foreground mt-1">Files automatically organized by content analysis</p>
      </div>

      <div className="flex gap-6">
        {/* Folders grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Object.entries(categories).map(([cat, catFiles], i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel-hover rounded-xl overflow-hidden"
            >
              <div className="p-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${FOLDER_COLORS[cat] || FOLDER_COLORS.Others}`}>
                    <FolderOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{cat}</p>
                    <p className="text-xs text-muted-foreground">{catFiles.length} file(s)</p>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-border">
                {catFiles.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFile(f)}
                    className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-muted/50 ${selectedFile?.id === f.id ? "bg-primary/5" : ""}`}
                  >
                    <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm truncate text-foreground">{f.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto shrink-0">{formatFileSize(f.size)}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Explanation Panel */}
        <AnimatePresence>
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-80 shrink-0 glass-panel rounded-xl p-5 h-fit sticky top-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground text-sm">AI Analysis</h3>
                <button onClick={() => setSelectedFile(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-foreground font-medium mb-4 truncate">{selectedFile.name}</p>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-2">
                  <FolderOpen className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p className="font-medium text-foreground">{selectedFile.category}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Percent className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Confidence</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${selectedFile.confidence}%` }} />
                      </div>
                      <span className="font-medium text-foreground">{Math.round(selectedFile.confidence)}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Tag className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-muted-foreground mb-1.5">Keywords</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedFile.keywords.map(k => (
                        <Badge key={k} variant="secondary" className="text-xs">{k}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Uploaded</p>
                    <p className="font-medium text-foreground">{new Date(selectedFile.uploadedAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="glass-panel rounded-lg p-3 mt-2">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This file was classified as <span className="text-primary font-medium">{selectedFile.category}</span> because keywords{" "}
                    <span className="text-foreground font-medium">{selectedFile.keywords.join(", ")}</span> were detected in the content.
                  </p>
                </div>

                {/* Content preview */}
                <div>
                  <p className="text-muted-foreground mb-2">Preview</p>
                  <pre className="text-xs bg-muted rounded-lg p-3 max-h-40 overflow-auto whitespace-pre-wrap font-mono text-foreground/80">
                    {selectedFile.content.substring(0, 500)}{selectedFile.content.length > 500 ? "…" : ""}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FoldersPage;
