import { useAuth } from "@/contexts/AuthContext";
import { useFiles } from "@/contexts/FileContext";
import { formatFileSize } from "@/lib/fileOrganizer";
import { User, Mail, HardDrive, FileText } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const { files } = useFiles();
  const totalSize = files.reduce((s, f) => s + f.size, 0);

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1">Your account details</p>
      </div>

      <div className="glass-panel rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{user?.name}</p>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Files</p>
              <p className="font-semibold text-foreground">{files.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <HardDrive className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Storage</p>
              <p className="font-semibold text-foreground">{formatFileSize(totalSize)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-semibold text-foreground text-sm truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
