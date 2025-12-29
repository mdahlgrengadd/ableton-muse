import { Play, Square, Circle, SkipBack, SkipForward, Repeat } from "lucide-react";

interface TransportBarProps {
  isPlaying: boolean;
  isRecording: boolean;
  isLooping: boolean;
  tempo: number;
  currentBar: number;
  currentBeat: number;
  onPlay: () => void;
  onStop: () => void;
  onRecord: () => void;
  onLoop: () => void;
  onTempoChange: (tempo: number) => void;
}

export const TransportBar = ({
  isPlaying,
  isRecording,
  isLooping,
  tempo,
  currentBar,
  currentBeat,
  onPlay,
  onStop,
  onRecord,
  onLoop,
  onTempoChange,
}: TransportBarProps) => {
  return (
    <div className="h-12 bg-daw-transport border-b border-border flex items-center justify-between px-4">
      {/* Left section - Transport controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={onStop}
          className="transport-button"
        >
          <SkipBack className="w-4 h-4" />
        </button>
        
        <button
          onClick={onPlay}
          className={`transport-button ${isPlaying ? 'active' : ''}`}
        >
          <Play className="w-4 h-4" fill={isPlaying ? 'currentColor' : 'none'} />
        </button>
        
        <button
          onClick={onStop}
          className="transport-button"
        >
          <Square className="w-4 h-4" />
        </button>
        
        <button
          onClick={onRecord}
          className={`transport-button ${isRecording ? 'bg-red-500 text-white' : ''}`}
        >
          <Circle className="w-4 h-4" fill={isRecording ? 'currentColor' : 'none'} />
        </button>

        <div className="w-px h-6 bg-border mx-2" />

        <button
          onClick={onLoop}
          className={`transport-button ${isLooping ? 'active' : ''}`}
        >
          <Repeat className="w-4 h-4" />
        </button>
      </div>

      {/* Center section - Position display */}
      <div className="flex items-center gap-4">
        <div className="font-mono text-xl tracking-wider text-foreground bg-card px-4 py-1 rounded-sm border border-border">
          <span className="text-primary">{String(currentBar).padStart(3, '0')}</span>
          <span className="text-muted-foreground">.</span>
          <span>{String(currentBeat).padStart(2, '0')}</span>
          <span className="text-muted-foreground">.00</span>
        </div>
      </div>

      {/* Right section - Tempo */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Tempo</span>
          <input
            type="number"
            value={tempo}
            onChange={(e) => onTempoChange(Number(e.target.value))}
            className="w-16 bg-card border border-border rounded-sm px-2 py-1 font-mono text-sm text-center focus:outline-none focus:border-primary"
          />
          <span className="text-xs text-muted-foreground">BPM</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Time</span>
          <div className="bg-card border border-border rounded-sm px-2 py-1 font-mono text-sm">
            4/4
          </div>
        </div>
      </div>
    </div>
  );
};
