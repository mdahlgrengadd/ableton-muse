import { Play, Square } from "lucide-react";

interface ClipSlotProps {
  hasClip: boolean;
  isPlaying: boolean;
  isSelected?: boolean;
  clipName?: string;
  color?: string;
  onTrigger: () => void;
  onSelect?: () => void;
}

export const ClipSlot = ({ hasClip, isPlaying, isSelected, clipName, color, onTrigger, onSelect }: ClipSlotProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (e.detail === 2) {
      // Double-click triggers playback
      onTrigger();
    } else {
      // Single click selects
      onSelect?.();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`clip-slot group ${
        hasClip
          ? isPlaying
            ? 'clip-slot-playing'
            : 'clip-slot-active'
          : 'clip-slot-empty'
      } ${isSelected ? 'ring-2 ring-primary ring-inset' : ''}`}
      style={hasClip && color ? { backgroundColor: color } : undefined}
    >
      {hasClip && (
        <>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {isPlaying ? (
              <Square className="w-4 h-4 text-white" fill="white" />
            ) : (
              <Play className="w-4 h-4 text-white" fill="white" />
            )}
          </div>
          {clipName && (
            <span className="absolute bottom-1 left-1 right-1 text-[9px] font-medium text-white/90 truncate">
              {clipName}
            </span>
          )}
          {isPlaying && (
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white animate-pulse-glow" />
          )}
        </>
      )}
    </button>
  );
};
