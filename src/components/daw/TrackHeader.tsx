interface TrackHeaderProps {
  name: string;
  color: string;
  isMuted: boolean;
  isSolo: boolean;
  isArmed: boolean;
  onMute: () => void;
  onSolo: () => void;
  onArm: () => void;
}

export const TrackHeader = ({
  name,
  color,
  isMuted,
  isSolo,
  isArmed,
  onMute,
  onSolo,
  onArm,
}: TrackHeaderProps) => {
  return (
    <div className="w-full h-[72px] bg-daw-header border-b border-border p-2 flex flex-col justify-center">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-3 h-3 rounded-sm"
          style={{ backgroundColor: color }}
        />
        <span className="text-xs font-medium text-foreground truncate flex-1">
          {name}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onMute}
          className={`track-button track-button-mute ${isMuted ? 'active' : ''}`}
        >
          M
        </button>
        <button
          onClick={onSolo}
          className={`track-button track-button-solo ${isSolo ? 'active' : ''}`}
        >
          S
        </button>
        <button
          onClick={onArm}
          className={`track-button track-button-arm ${isArmed ? 'active' : ''}`}
        >
          ●
        </button>
      </div>
    </div>
  );
};
