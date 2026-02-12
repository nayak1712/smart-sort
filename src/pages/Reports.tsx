import { useFiles } from "@/contexts/FileContext";
import { formatFileSize } from "@/lib/fileOrganizer";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Download, FileBarChart } from "lucide-react";

const COLORS = ["#06b6d4", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#ec4899", "#6b7280"];

const Reports = () => {
  const { files, getFilesByCategory } = useFiles();
  const categories = getFilesByCategory();

  const barData = Object.entries(categories).map(([name, f]) => ({ name, count: f.length }));
  const pieData = Object.entries(categories).map(([name, f]) => ({ name, value: f.length }));

  const exportCSV = () => {
    const rows = [["File Name", "Category", "Keywords", "Size", "Confidence", "Date"]];
    files.forEach(f => {
      rows.push([f.name, f.category, f.keywords.join("; "), formatFileSize(f.size), Math.round(f.confidence) + "%", new Date(f.uploadedAt).toLocaleDateString()]);
    });
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sfo-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (files.length === 0) {
    return (
      <div className="animate-fade-in text-center py-20">
        <FileBarChart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground">No data yet</h2>
        <p className="text-muted-foreground mt-1">Upload some files to generate reports</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">Analytics and export options</p>
        </div>
        <Button onClick={exportCSV} variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4">Files by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-4">Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
