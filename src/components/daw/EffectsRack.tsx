import { useState } from "react";
import { ChevronUp, ChevronDown, Plus } from "lucide-react";
import { EffectWidget } from "./EffectWidget";

interface Effect {
  id: string;
  name: string;
  type: string;
  color: string;
  isEnabled: boolean;
}

const EFFECT_COLORS = {
  reverb: "hsl(200, 70%, 45%)",
  delay: "hsl(280, 60%, 50%)",
  eq: "hsl(45, 80%, 45%)",
  compressor: "hsl(340, 70%, 50%)",
  filter: "hsl(160, 60%, 40%)",
  distortion: "hsl(24, 90%, 45%)",
};

const createInitialEffects = (): Effect[] => [
  { id: "1", name: "Room Reverb", type: "Reverb", color: EFFECT_COLORS.reverb, isEnabled: true },
  { id: "2", name: "EQ Eight", type: "EQ", color: EFFECT_COLORS.eq, isEnabled: true },
  { id: "3", name: "Glue Comp", type: "Compressor", color: EFFECT_COLORS.compressor, isEnabled: true },
  { id: "4", name: "Ping Pong", type: "Delay", color: EFFECT_COLORS.delay, isEnabled: false },
  { id: "5", name: "Auto Filter", type: "Filter", color: EFFECT_COLORS.filter, isEnabled: true },
];

export const EffectsRack = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [effects, setEffects] = useState<Effect[]>(createInitialEffects());
  const [selectedTrack] = useState("Synth Lead");

  const handleToggleEffect = (effectId: string) => {
    setEffects((prev) =>
      prev.map((effect) =>
        effect.id === effectId
          ? { ...effect, isEnabled: !effect.isEnabled }
          : effect
      )
    );
  };

  return (
    <div
      className={`bg-daw-mixer border-t border-border transition-all duration-200 ${
        isExpanded ? "h-36" : "h-8"
      }`}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full h-8 flex items-center justify-between px-4 text-muted-foreground hover:text-foreground transition-colors bg-daw-header border-b border-border"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wider font-medium">
            Effects
          </span>
          {!isExpanded && (
            <span className="text-[10px] text-muted-foreground">
              {selectedTrack} • {effects.filter((e) => e.isEnabled).length} active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isExpanded && (
            <span className="text-[10px] text-primary font-medium">
              {selectedTrack}
            </span>
          )}
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* Effects chain */}
      {isExpanded && (
        <div className="flex h-[calc(100%-32px)] overflow-x-auto no-scrollbar">
          {effects.map((effect) => (
            <EffectWidget
              key={effect.id}
              name={effect.name}
              type={effect.type}
              color={effect.color}
              isEnabled={effect.isEnabled}
              onToggle={() => handleToggleEffect(effect.id)}
            />
          ))}

          {/* Add effect button */}
          <div className="flex-shrink-0 w-16 h-full bg-daw-track/50 border-r border-border flex items-center justify-center">
            <button className="w-8 h-8 rounded bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
