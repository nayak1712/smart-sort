import { useState } from "react";
import { useFiles } from "@/contexts/FileContext";
import { formatFileSize } from "@/lib/fileOrganizer";
import { Input } from "@/components/ui/input";
import { Search, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const History = () => {
  const { files, setSelectedFile } = useFiles();
  const [search, setSearch] = useState("");

  const filtered = files.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase()) ||
    f.keywords.some(k => k.includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">File History</h1>
        <p className="text-muted-foreground mt-1">All processed files with details</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search files, categories…" className="pl-9 h-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">{files.length === 0 ? "No files uploaded yet" : "No matches found"}</p>
        </div>
      ) : (
        <div className="glass-panel rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-5 py-3 text-muted-foreground font-medium">File Name</th>
                  <th className="px-5 py-3 text-muted-foreground font-medium">Category</th>
                  <th className="px-5 py-3 text-muted-foreground font-medium">Keywords</th>
                  <th className="px-5 py-3 text-muted-foreground font-medium">Size</th>
                  <th className="px-5 py-3 text-muted-foreground font-medium">Confidence</th>
                  <th className="px-5 py-3 text-muted-foreground font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(f => (
                  <tr key={f.id} className="hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => setSelectedFile(f)}>
                    <td className="px-5 py-3 font-medium text-foreground">{f.name}</td>
                    <td className="px-5 py-3">
                      <Badge variant="secondary">{f.category}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {f.keywords.slice(0, 3).map(k => (
                          <span key={k} className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{k}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{formatFileSize(f.size)}</td>
                    <td className="px-5 py-3 text-muted-foreground">{Math.round(f.confidence)}%</td>
                    <td className="px-5 py-3 text-muted-foreground">{new Date(f.uploadedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
