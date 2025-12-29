import { useState, useEffect } from "react";

interface MixerChannelProps {
  name: string;
  color: string;
  volume: number;
  pan: number;
  onVolumeChange: (volume: number) => void;
  onPanChange: (pan: number) => void;
}

export const MixerChannel = ({
  name,
  color,
  volume,
  pan,
  onVolumeChange,
  onPanChange,
}: MixerChannelProps) => {
  const [meterLevel, setMeterLevel] = useState(0);

  // Simulate meter activity
  useEffect(() => {
    const interval = setInterval(() => {
      setMeterLevel(Math.random() * 70 + 10);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center w-20 bg-daw-track border-r border-border p-2 gap-2">
      {/* Track name */}
      <div className="flex items-center gap-1">
        <div
          className="w-2 h-2 rounded-sm"
          style={{ backgroundColor: color }}
        />
        <span className="text-[10px] font-medium text-foreground truncate max-w-[50px]">
          {name}
        </span>
      </div>

      {/* Pan knob (simplified as slider) */}
      <div className="w-full">
        <input
          type="range"
          min="-100"
          max="100"
          value={pan}
          onChange={(e) => onPanChange(Number(e.target.value))}
          className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="text-[9px] text-muted-foreground text-center font-mono">
          {pan === 0 ? 'C' : pan > 0 ? `R${pan}` : `L${Math.abs(pan)}`}
        </div>
      </div>

      {/* Fader and meter */}
      <div className="flex gap-1 flex-1">
        {/* Meter */}
        <div className="meter">
          <div
            className="meter-fill"
            style={{ height: `${meterLevel}%` }}
          />
        </div>

        {/* Fader */}
        <div className="relative flex-1">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="absolute inset-0 w-full h-full appearance-none cursor-pointer bg-transparent [writing-mode:vertical-lr] [direction:rtl]"
            style={{
              background: `linear-gradient(to top, hsl(var(--primary)) ${volume}%, hsl(var(--muted)) ${volume}%)`,
            }}
          />
        </div>
      </div>

      {/* Volume display */}
      <div className="text-[10px] font-mono text-muted-foreground">
        {volume === 0 ? '-∞' : `${Math.round((volume / 100) * 6 - 6)}dB`}
      </div>
    </div>
  );
};
