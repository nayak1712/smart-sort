import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains("dark"));
  const [notifications, setNotifications] = useState(true);

  const toggleDark = (val: boolean) => {
    setDarkMode(val);
    document.documentElement.classList.toggle("dark", val);
    localStorage.setItem("sfo_theme", val ? "dark" : "light");
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Customize your experience</p>
      </div>

      <div className="glass-panel rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-foreground font-medium">Dark Mode</Label>
            <p className="text-sm text-muted-foreground">Toggle dark theme</p>
          </div>
          <Switch checked={darkMode} onCheckedChange={toggleDark} />
        </div>

        <div className="border-t border-border" />

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-foreground font-medium">Notifications</Label>
            <p className="text-sm text-muted-foreground">Show upload notifications</p>
          </div>
          <Switch checked={notifications} onCheckedChange={setNotifications} />
        </div>

        <div className="border-t border-border" />

        <div>
          <Label className="text-foreground font-medium">Clear Data</Label>
          <p className="text-sm text-muted-foreground mb-3">Remove all uploaded files from browser storage</p>
          <Button variant="destructive" size="sm" onClick={() => {
            localStorage.removeItem("sfo_files");
            toast({ title: "Data cleared", description: "All local data has been removed" });
            window.location.reload();
          }}>
            Clear All Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
