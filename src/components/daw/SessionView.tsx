import { useState } from "react";
import { Track } from "./Track";
import { Play, Square } from "lucide-react";

interface Clip {
  id: string;
  name: string;
  isPlaying: boolean;
}

interface TrackData {
  id: string;
  name: string;
  color: string;
  clips: (Clip | null)[];
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

const SCENE_COUNT = 8;

const createInitialTracks = (): TrackData[] => [
  {
    id: "1",
    name: "Drums",
    color: TRACK_COLORS[0],
    clips: [
      { id: "1-1", name: "Beat 1", isPlaying: true },
      { id: "1-2", name: "Beat 2", isPlaying: false },
      null,
      { id: "1-4", name: "Fill", isPlaying: false },
      null,
      null,
      null,
      null,
    ],
    volume: 80,
    pan: 0,
  },
  {
    id: "2",
    name: "Bass",
    color: TRACK_COLORS[1],
    clips: [
      { id: "2-1", name: "Bass 1", isPlaying: true },
      null,
      { id: "2-3", name: "Sub", isPlaying: false },
      null,
      null,
      null,
      null,
      null,
    ],
    volume: 75,
    pan: 0,
  },
  {
    id: "3",
    name: "Synth Lead",
    color: TRACK_COLORS[2],
    clips: [
      null,
      { id: "3-2", name: "Lead A", isPlaying: false },
      { id: "3-3", name: "Lead B", isPlaying: false },
      null,
      { id: "3-5", name: "Arp", isPlaying: false },
      null,
      null,
      null,
    ],
    volume: 65,
    pan: 20,
  },
  {
    id: "4",
    name: "Pads",
    color: TRACK_COLORS[3],
    clips: [
      { id: "4-1", name: "Pad 1", isPlaying: true },
      { id: "4-2", name: "Pad 2", isPlaying: false },
      null,
      null,
      null,
      { id: "4-6", name: "Ambient", isPlaying: false },
      null,
      null,
    ],
    volume: 55,
    pan: -15,
  },
  {
    id: "5",
    name: "FX",
    color: TRACK_COLORS[4],
    clips: [
      null,
      null,
      { id: "5-3", name: "Riser", isPlaying: false },
      { id: "5-4", name: "Impact", isPlaying: false },
      null,
      null,
      { id: "5-7", name: "Sweep", isPlaying: false },
      null,
    ],
    volume: 50,
    pan: 0,
  },
  {
    id: "6",
    name: "Vocals",
    color: TRACK_COLORS[5],
    clips: [
      null,
      null,
      null,
      { id: "6-4", name: "Vox 1", isPlaying: false },
      { id: "6-5", name: "Vox 2", isPlaying: false },
      null,
      null,
      null,
    ],
    volume: 70,
    pan: 5,
  },
];

export const SessionView = () => {
  const [tracks, setTracks] = useState<TrackData[]>(createInitialTracks());
  const [activeScene, setActiveScene] = useState<number | null>(0);

  const handleClipTrigger = (trackId: string, clipIndex: number) => {
    setTracks((prevTracks) =>
      prevTracks.map((track) => {
        if (track.id === trackId) {
          return {
            ...track,
            clips: track.clips.map((clip, index) => {
              if (clip === null) return null;
              return {
                ...clip,
                isPlaying: index === clipIndex ? !clip.isPlaying : false,
              };
            }),
          };
        }
        return track;
      })
    );
  };

  const handleSceneTrigger = (sceneIndex: number) => {
    setActiveScene(sceneIndex);
    setTracks((prevTracks) =>
      prevTracks.map((track) => ({
        ...track,
        clips: track.clips.map((clip, index) => {
          if (clip === null) return null;
          return {
            ...clip,
            isPlaying: index === sceneIndex,
          };
        }),
      }))
    );
  };

  const handleSceneStop = (sceneIndex: number) => {
    setTracks((prevTracks) =>
      prevTracks.map((track) => ({
        ...track,
        clips: track.clips.map((clip, index) => {
          if (clip === null || index !== sceneIndex) return clip;
          return {
            ...clip,
            isPlaying: false,
          };
        }),
      }))
    );
    if (activeScene === sceneIndex) {
      setActiveScene(null);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Scene launcher */}
      <div className="w-10 bg-daw-header border-r border-border flex flex-col">
        <div className="h-[72px] border-b border-border" />
        <div className="flex-1 flex flex-col gap-1 p-1">
          {Array.from({ length: SCENE_COUNT }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleSceneTrigger(index)}
              className={`w-full h-[52px] rounded-sm flex items-center justify-center transition-colors ${
                activeScene === index
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
              }`}
            >
              <Play className="w-3 h-3" fill="currentColor" />
            </button>
          ))}
        </div>
      </div>

      {/* Tracks */}
      <div className="flex-1 flex overflow-x-auto no-scrollbar">
        {tracks.map((track) => (
          <Track
            key={track.id}
            name={track.name}
            color={track.color}
            clips={track.clips}
            onClipTrigger={(clipIndex) => handleClipTrigger(track.id, clipIndex)}
          />
        ))}
        
        {/* Add track button */}
        <div className="min-w-[100px] w-[100px] border-r border-border flex items-center justify-center bg-daw-track">
          <button className="w-8 h-8 rounded-sm bg-secondary hover:bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <span className="text-xl">+</span>
          </button>
        </div>
      </div>
    </div>
  );
};
