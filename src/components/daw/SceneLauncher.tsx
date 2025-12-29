import { Play, Square } from "lucide-react";

interface SceneLauncherProps {
  sceneCount: number;
  activeScene: number | null;
  playingScenes: boolean[];
  onSceneTrigger: (sceneIndex: number) => void;
  onSceneStop: (sceneIndex: number) => void;
}

export const SceneLauncher = ({
  sceneCount,
  activeScene,
  playingScenes,
  onSceneTrigger,
  onSceneStop,
}: SceneLauncherProps) => {
  return (
    <div className="flex flex-col min-w-[40px] w-[40px] border-r border-border">
      {/* Header aligned with track headers */}
      <div className="h-[72px] bg-daw-header border-b border-border flex items-center justify-center">
        <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium vertical-text">Scene</span>
      </div>
      
      {/* Scene slots aligned with clip slots */}
      <div className="flex-1 flex flex-col gap-1 p-1 bg-daw-track">
        {Array.from({ length: sceneCount }).map((_, index) => {
          const isPlaying = playingScenes[index];
          const isActive = activeScene === index;
          
          return (
            <button
              key={index}
              onClick={() => isPlaying ? onSceneStop(index) : onSceneTrigger(index)}
              className={`w-full h-[52px] rounded-sm flex items-center justify-center transition-all duration-100 group ${
                isPlaying
                  ? 'bg-accent text-accent-foreground'
                  : isActive
                    ? 'bg-primary/20 text-primary border border-primary/50'
                    : 'bg-daw-clipEmpty border border-border/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              {isPlaying ? (
                <>
                  <Square className="w-3 h-3 group-hover:hidden" fill="currentColor" />
                  <Square className="w-3 h-3 hidden group-hover:block" />
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 group-hover:hidden" />
                  <Play className="w-3 h-3 hidden group-hover:block" fill="currentColor" />
                </>
              )}
              {isPlaying && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-white animate-pulse-glow" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
