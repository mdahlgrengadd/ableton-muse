import { useState } from "react";
import { Power, MoreHorizontal } from "lucide-react";
import { AudioKnob } from "./AudioKnob";

interface EffectWidgetProps {
  name: string;
  type: string;
  color: string;
  isEnabled: boolean;
  onToggle: () => void;
}

export const EffectWidget = ({
  name,
  type,
  color,
  isEnabled,
  onToggle,
}: EffectWidgetProps) => {
  const [mixValue, setMixValue] = useState(100);
  const [amtValue, setAmtValue] = useState(50);

  return (
    <div
      className={`flex-shrink-0 w-32 h-full bg-daw-track border-r border-border flex flex-col transition-opacity ${
        isEnabled ? "opacity-100" : "opacity-50"
      }`}
    >
      {/* Header */}
      <div
        className="h-6 flex items-center justify-between px-2 border-b border-border"
        style={{ backgroundColor: color }}
      >
        <span className="text-[10px] font-medium text-white truncate">
          {name}
        </span>
        <button
          onClick={onToggle}
          className={`w-4 h-4 flex items-center justify-center rounded-sm transition-colors ${
            isEnabled ? "bg-white/20 text-white" : "bg-black/20 text-white/50"
          }`}
        >
          <Power className="w-3 h-3" />
        </button>
      </div>

      {/* Effect type label */}
      <div className="px-2 py-1 border-b border-border">
        <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
          {type}
        </span>
      </div>

      {/* Controls area */}
      <div className="flex-1 p-2 flex flex-col gap-2">
        {/* Functional audio knobs */}
        <div className="flex gap-3 justify-center">
          <AudioKnob
            value={mixValue}
            onChange={setMixValue}
            label="Mix"
            size={28}
          />
          <AudioKnob
            value={amtValue}
            onChange={setAmtValue}
            label="Amt"
            size={28}
          />
        </div>

        {/* Parameter display */}
        <div className="mt-auto bg-background/50 rounded px-1 py-0.5">
          <div className="text-[9px] text-muted-foreground font-mono text-center">
            {Math.round(mixValue)}%
          </div>
        </div>
      </div>

      {/* Footer with more options */}
      <div className="h-5 border-t border-border flex items-center justify-center">
        <MoreHorizontal className="w-3 h-3 text-muted-foreground" />
      </div>
    </div>
  );
};
