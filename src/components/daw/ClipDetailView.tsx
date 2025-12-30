import { X } from "lucide-react";
import { PatternEditor } from "./PatternEditor";

interface Clip {
  id: string;
  name: string;
  isPlaying: boolean;
  type?: "sample" | "pattern";
}

interface ClipDetailViewProps {
  clip: Clip | null;
  trackName: string;
  trackColor: string;
  onClose: () => void;
}

const SampleEditor = ({ clip, trackColor }: { clip: Clip; trackColor: string }) => {
  // Generate fake waveform data
  const waveformBars = Array.from({ length: 64 }, () => Math.random() * 0.8 + 0.2);

  return (
    <div className="flex-1 flex flex-col p-3 gap-3 overflow-auto">
      {/* Waveform Display */}
      <div className="flex-1 min-h-[120px] bg-background/50 rounded border border-border p-2">
        <div className="h-full flex items-center justify-center gap-px">
          {waveformBars.map((height, i) => (
            <div
              key={i}
              className="flex-1 max-w-[6px] rounded-sm transition-all"
              style={{
                height: `${height * 100}%`,
                backgroundColor: trackColor,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      </div>

      {/* Sample Controls */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-background/30 rounded border border-border p-2">
          <label className="text-xs text-muted-foreground block mb-1">Start</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            defaultValue="0"
            className="w-full h-1 bg-secondary rounded-full appearance-none cursor-pointer"
          />
        </div>
        <div className="bg-background/30 rounded border border-border p-2">
          <label className="text-xs text-muted-foreground block mb-1">End</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            defaultValue="100"
            className="w-full h-1 bg-secondary rounded-full appearance-none cursor-pointer"
          />
        </div>
        <div className="bg-background/30 rounded border border-border p-2">
          <label className="text-xs text-muted-foreground block mb-1">Pitch</label>
          <input 
            type="range" 
            min="-24" 
            max="24" 
            defaultValue="0"
            className="w-full h-1 bg-secondary rounded-full appearance-none cursor-pointer"
          />
        </div>
        <div className="bg-background/30 rounded border border-border p-2">
          <label className="text-xs text-muted-foreground block mb-1">Gain</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            defaultValue="75"
            className="w-full h-1 bg-secondary rounded-full appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Loop Controls */}
      <div className="bg-background/30 rounded border border-border p-2">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-muted-foreground">Loop</label>
          <button className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors">
            ON
          </button>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground block mb-1">Loop Start</label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              defaultValue="0"
              className="w-full h-1 bg-secondary rounded-full appearance-none cursor-pointer"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground block mb-1">Loop End</label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              defaultValue="100"
              className="w-full h-1 bg-secondary rounded-full appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Clip Type Badge */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="px-2 py-0.5 bg-secondary rounded">Sample</span>
        <span>48000 Hz • Stereo • 4 bars</span>
      </div>
    </div>
  );
};

export const ClipDetailView = ({ clip, trackName, trackColor, onClose }: ClipDetailViewProps) => {
  if (!clip) {
    return (
      <div className="h-full flex items-center justify-center bg-daw-track text-muted-foreground">
        <p className="text-sm">Select a clip to edit</p>
      </div>
    );
  }

  const clipType = clip.type || "sample";

  return (
    <div className="h-full flex flex-col bg-daw-track">
      {/* Header */}
      <div 
        className="h-8 flex items-center justify-between px-3 border-b border-border shrink-0"
        style={{ backgroundColor: trackColor + "20" }}
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: trackColor }}
          />
          <span className="text-xs font-medium text-foreground">{clip.name}</span>
          <span className="text-xs text-muted-foreground">• {trackName}</span>
          <span className="px-1.5 py-0.5 text-[9px] font-semibold uppercase bg-secondary rounded text-muted-foreground">
            {clipType}
          </span>
        </div>
        <button 
          onClick={onClose}
          className="w-5 h-5 flex items-center justify-center rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Editor Content */}
      {clipType === "pattern" ? (
        <PatternEditor 
          trackColor={trackColor}
          patternName={clip.name}
          trackCount={4}
          rowCount={32}
        />
      ) : (
        <SampleEditor clip={clip} trackColor={trackColor} />
      )}
    </div>
  );
};
