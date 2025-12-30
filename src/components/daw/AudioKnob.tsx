import { useState, useRef, useCallback, useEffect } from "react";

interface AudioKnobProps {
  value: number;
  min?: number;
  max?: number;
  size?: number;
  label?: string;
  onChange: (value: number) => void;
  sensitivity?: number;
}

export const AudioKnob = ({
  value,
  min = 0,
  max = 100,
  size = 28,
  label,
  onChange,
  sensitivity = 200,
}: AudioKnobProps) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startValue = useRef(0);

  // Calculate rotation angle based on value (270 degrees range, from -135 to +135)
  const range = max - min;
  const normalizedValue = (value - min) / range;
  const rotation = normalizedValue * 270 - 135;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDragging.current = true;
      startY.current = e.clientY;
      startValue.current = value;
      document.body.style.cursor = "ns-resize";
    },
    [value]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current) return;

      const deltaY = startY.current - e.clientY;
      const deltaValue = (deltaY / sensitivity) * range;
      const newValue = Math.max(min, Math.min(max, startValue.current + deltaValue));
      onChange(newValue);
    },
    [min, max, range, sensitivity, onChange]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = "";
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      isDragging.current = true;
      startY.current = e.touches[0].clientY;
      startValue.current = value;
    },
    [value]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging.current) return;

      const deltaY = startY.current - e.touches[0].clientY;
      const deltaValue = (deltaY / sensitivity) * range;
      const newValue = Math.max(min, Math.min(max, startValue.current + deltaValue));
      onChange(newValue);
    },
    [min, max, range, sensitivity, onChange]
  );

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Double-click to reset to center/default
  const handleDoubleClick = useCallback(() => {
    onChange((min + max) / 2);
  }, [min, max, onChange]);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        ref={knobRef}
        className="audio-knob relative cursor-ns-resize select-none"
        style={{ width: size, height: size }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onDoubleClick={handleDoubleClick}
      >
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full bg-muted border border-border"
          style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.4)" }}
        />
        
        {/* Value arc indicator */}
        <svg
          className="absolute inset-0"
          viewBox="0 0 36 36"
          style={{ transform: "rotate(-135deg)" }}
        >
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="3"
            strokeDasharray={`${270 * (Math.PI / 180) * 14} 1000`}
            strokeLinecap="round"
          />
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeDasharray={`${normalizedValue * 270 * (Math.PI / 180) * 14} 1000`}
            strokeLinecap="round"
            className="transition-all duration-75"
          />
        </svg>

        {/* Center knob */}
        <div
          className="absolute rounded-full bg-daw-track border border-border"
          style={{
            width: size * 0.6,
            height: size * 0.6,
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            transition: "transform 0.05s ease-out",
          }}
        >
          {/* Pointer indicator */}
          <div
            className="absolute bg-primary rounded-full"
            style={{
              width: size * 0.12,
              height: size * 0.12,
              top: "15%",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        </div>
      </div>

      {label && (
        <span className="text-[8px] text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
  );
};
