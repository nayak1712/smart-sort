import { useAuth } from "@/contexts/AuthContext";
import { useFiles } from "@/contexts/FileContext";
import { motion } from "framer-motion";
import { Files, FolderOpen, Upload, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { formatFileSize } from "@/lib/fileOrganizer";

const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-panel-hover rounded-xl p-5"
  >
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
    <p className="text-2xl font-bold text-foreground">{value}</p>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { files, getFilesByCategory } = useFiles();
  const categories = getFilesByCategory();
  const totalSize = files.reduce((s, f) => s + f.size, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome, <span className="gradient-text">{user?.name}</span>
        </h1>
        <p className="text-muted-foreground mt-1">Your semantic file organization dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Files} label="Total Files" value={files.length} color="bg-primary/10 text-primary" />
        <StatCard icon={FolderOpen} label="Categories" value={Object.keys(categories).length} color="bg-emerald-500/10 text-emerald-500" />
        <StatCard icon={Upload} label="Storage Used" value={formatFileSize(totalSize)} color="bg-amber-500/10 text-amber-500" />
        <StatCard icon={TrendingUp} label="Avg Confidence" value={files.length ? Math.round(files.reduce((s, f) => s + f.confidence, 0) / files.length) + "%" : "—"} color="bg-violet-500/10 text-violet-500" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/upload" className="glass-panel-hover rounded-xl p-6 flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Upload className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Upload Files</p>
            <p className="text-sm text-muted-foreground">Drag & drop or browse files to organize</p>
          </div>
        </Link>
        <Link to="/folders" className="glass-panel-hover rounded-xl p-6 flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-105 transition-transform">
            <FolderOpen className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Browse Folders</p>
            <p className="text-sm text-muted-foreground">View organized files by category</p>
          </div>
        </Link>
      </div>

      {/* Recent files */}
      {files.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="divide-y divide-border">
              {files.slice(-5).reverse().map(f => (
                <div key={f.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Files className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{f.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{f.category}</span>
                    <span>{formatFileSize(f.size)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
