import { useState, useEffect } from "react";
import { TransportBar } from "./TransportBar";
import { SessionView } from "./SessionView";
import { Mixer } from "./Mixer";

export const DAW = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [tempo, setTempo] = useState(120);
  const [currentBar, setCurrentBar] = useState(1);
  const [currentBeat, setCurrentBeat] = useState(1);

  // Simulate playback position
  useEffect(() => {
    if (!isPlaying) return;

    const beatDuration = (60 / tempo) * 1000;
    const interval = setInterval(() => {
      setCurrentBeat((prev) => {
        if (prev >= 4) {
          setCurrentBar((bar) => bar + 1);
          return 1;
        }
        return prev + 1;
      });
    }, beatDuration);

    return () => clearInterval(interval);
  }, [isPlaying, tempo]);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setCurrentBar(1);
      setCurrentBeat(1);
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    setIsRecording(false);
    setCurrentBar(1);
    setCurrentBeat(1);
  };

  const handleRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setIsPlaying(true);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
      <TransportBar
        isPlaying={isPlaying}
        isRecording={isRecording}
        isLooping={isLooping}
        tempo={tempo}
        currentBar={currentBar}
        currentBeat={currentBeat}
        onPlay={handlePlay}
        onStop={handleStop}
        onRecord={handleRecord}
        onLoop={() => setIsLooping(!isLooping)}
        onTempoChange={setTempo}
      />
      <SessionView />
      <Mixer />
    </div>
  );
};
