import { useState } from "react";
import { MixerChannel } from "./MixerChannel";
import { ChevronUp, ChevronDown } from "lucide-react";

interface MixerTrack {
  id: string;
  name: string;
  color: string;
  volume: number;
  pan: number;
}

const TRACK_COLORS = [
  "hsl(340, 80%, 55%)",
  "hsl(200, 80%, 55%)",
  "hsl(45, 90%, 55%)",
  "hsl(280, 70%, 60%)",
  "hsl(160, 70%, 45%)",
  "hsl(24, 100%, 50%)",
];

const createInitialMixerTracks = (): MixerTrack[] => [
  { id: "1", name: "Drums", color: TRACK_COLORS[0], volume: 80, pan: 0 },
  { id: "2", name: "Bass", color: TRACK_COLORS[1], volume: 75, pan: 0 },
  { id: "3", name: "Synth Lead", color: TRACK_COLORS[2], volume: 65, pan: 20 },
  { id: "4", name: "Pads", color: TRACK_COLORS[3], volume: 55, pan: -15 },
  { id: "5", name: "FX", color: TRACK_COLORS[4], volume: 50, pan: 0 },
  { id: "6", name: "Vocals", color: TRACK_COLORS[5], volume: 70, pan: 5 },
];

export const Mixer = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [tracks, setTracks] = useState<MixerTrack[]>(createInitialMixerTracks());

  const handleVolumeChange = (trackId: string, volume: number) => {
    setTracks((prev) =>
      prev.map((track) =>
        track.id === trackId ? { ...track, volume } : track
      )
    );
  };

  const handlePanChange = (trackId: string, pan: number) => {
    setTracks((prev) =>
      prev.map((track) =>
        track.id === trackId ? { ...track, pan } : track
      )
    );
  };

  return (
    <div className={`bg-daw-mixer border-t border-border transition-all duration-200 ${isExpanded ? 'h-48' : 'h-8'}`}>
      {/* Collapse toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full h-8 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors bg-daw-header border-b border-border"
      >
        <span className="text-xs uppercase tracking-wider font-medium">Mixer</span>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronUp className="w-4 h-4" />
        )}
      </button>

      {/* Mixer channels */}
      {isExpanded && (
        <div className="flex overflow-x-auto no-scrollbar h-[calc(100%-32px)]">
          {tracks.map((track) => (
            <MixerChannel
              key={track.id}
              name={track.name}
              color={track.color}
              volume={track.volume}
              pan={track.pan}
              onVolumeChange={(volume) => handleVolumeChange(track.id, volume)}
              onPanChange={(pan) => handlePanChange(track.id, pan)}
            />
          ))}
          
          {/* Master channel */}
          <MixerChannel
            name="Master"
            color="hsl(0, 0%, 60%)"
            volume={85}
            pan={0}
            onVolumeChange={() => {}}
            onPanChange={() => {}}
          />
        </div>
      )}
    </div>
  );
};
