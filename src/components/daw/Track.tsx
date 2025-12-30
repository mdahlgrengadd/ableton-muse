import { useState } from "react";
import { ClipSlot } from "./ClipSlot";
import { TrackHeader } from "./TrackHeader";

interface Clip {
  id: string;
  name: string;
  isPlaying: boolean;
}

interface TrackProps {
  name: string;
  color: string;
  clips: (Clip | null)[];
  selectedClipIndex?: number;
  onClipTrigger: (clipIndex: number) => void;
  onClipSelect?: (clipIndex: number) => void;
}

export const Track = ({ name, color, clips, selectedClipIndex, onClipTrigger, onClipSelect }: TrackProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSolo, setIsSolo] = useState(false);
  const [isArmed, setIsArmed] = useState(false);

  return (
    <div className="flex flex-col min-w-[100px] w-[100px] border-r border-border">
      <TrackHeader
        name={name}
        color={color}
        isMuted={isMuted}
        isSolo={isSolo}
        isArmed={isArmed}
        onMute={() => setIsMuted(!isMuted)}
        onSolo={() => setIsSolo(!isSolo)}
        onArm={() => setIsArmed(!isArmed)}
      />
      <div className="flex-1 flex flex-col gap-1 p-1 bg-daw-track">
        {clips.map((clip, index) => (
          <ClipSlot
            key={index}
            hasClip={clip !== null}
            isPlaying={clip?.isPlaying || false}
            isSelected={selectedClipIndex === index}
            clipName={clip?.name}
            color={color}
            onTrigger={() => onClipTrigger(index)}
            onSelect={() => clip && onClipSelect?.(index)}
          />
        ))}
      </div>
    </div>
  );
};
