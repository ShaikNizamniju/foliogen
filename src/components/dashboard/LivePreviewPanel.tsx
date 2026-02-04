import React, { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext"; // Adjust path if needed
import { useProfile } from "@/hooks/useProfile"; // Adjust path if needed
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Smartphone, Tablet, Monitor, Edit2, RotateCcw, ExternalLink, RefreshCw } from "lucide-react";

// 1. IMPORT YOUR TEMPLATES HERE
// (Make sure these imports match your actual file names)
import { MinimalistTemplate } from "@/components/templates/MinimalistTemplate";
// import { CreativeTemplate } from '@/components/templates/CreativeTemplate';
// Add other templates as you build them

// 2. DEVICE CONFIGURATION (Fixes the "Auto-Align" & Resizing)
const deviceConfigs = {
  desktop: { width: "100%", label: "Desktop", icon: Monitor, scale: 1 },
  tablet: { width: "768px", label: "Tablet", icon: Tablet, scale: 1 },
  mobile: { width: "375px", label: "Mobile", icon: Smartphone, scale: 1 },
};

export function LivePreviewPanel({
  editMode = false,
  onToggleEditMode,
}: {
  editMode: boolean;
  onToggleEditMode: () => void;
}) {
  const { profile, updateProfile } = useProfile();
  const { user } = useAuth();
  const [deviceSize, setDeviceSize] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [key, setKey] = useState(0); // Used to force-refresh

  // 3. SAFE TEMPLATE LOADER (Fixes "Blank Screen" crashes)
  const renderTemplate = () => {
    // If you have more templates, add them to this map:
    const templates: any = {
      minimalist: MinimalistTemplate,
      // creative: CreativeTemplate,
    };

    const TemplateComponent = templates[profile?.selectedTemplate || "minimalist"] || MinimalistTemplate;

    // We pass 'editMode' down so the template knows when to show input fields
    return <TemplateComponent profile={profile} editMode={editMode} />;
  };

  const currentDevice = deviceConfigs[deviceSize];

  return (
    <div className="flex flex-col h-full bg-slate-50 border-l">
      {/* TOOLBAR */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-2">
          {/* Device Toggles */}
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {(Object.keys(deviceConfigs) as Array<keyof typeof deviceConfigs>).map((size) => {
              const Icon = deviceConfigs[size].icon;
              return (
                <button
                  key={size}
                  onClick={() => setDeviceSize(size)}
                  className={`p-2 rounded-md transition-all ${
                    deviceSize === size ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"
                  }`}
                  title={deviceConfigs[size].label}
                >
                  <Icon size={18} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant={editMode ? "default" : "outline"} size="sm" onClick={onToggleEditMode} className="gap-2">
            <Edit2 size={14} />
            {editMode ? "Editing On" : "Edit"}
          </Button>

          <Button variant="ghost" size="icon" onClick={() => setKey((k) => k + 1)} title="Refresh">
            <RefreshCw size={16} />
          </Button>

          <Button variant="ghost" size="icon" onClick={() => window.open(`/p/${user?.id}`, "_blank")} title="Open Live">
            <ExternalLink size={16} />
          </Button>
        </div>
      </div>

      {/* PREVIEW AREA (Handles the Sizing) */}
      <div className="flex-1 overflow-hidden relative flex justify-center bg-slate-100 p-4">
        <div
          key={key}
          className="bg-white shadow-2xl transition-all duration-300 ease-in-out overflow-y-auto h-full"
          style={{
            width: currentDevice.width,
            // If mobile, we add a border to look like a phone
            border: deviceSize === "mobile" ? "8px solid #333" : "none",
            borderRadius: deviceSize === "mobile" ? "24px" : "0px",
          }}
        >
          {profile ? renderTemplate() : <div className="p-10 text-center">Loading Profile...</div>}
        </div>
      </div>
    </div>
  );
}
