import { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown, Plus, Minus } from "lucide-react";

interface PatternNote {
  note: string;       // e.g., "C-4", "D#5", "---"
  instrument: string; // e.g., "01", ".."
  volume: string;     // e.g., "64", ".."
  effect: string;     // e.g., "0B00", "...."
}

interface PatternRow {
  notes: PatternNote[];
}

interface PatternEditorProps {
  trackCount?: number;
  rowCount?: number;
  trackColor?: string;
  patternName?: string;
}

const NOTES = ["C-", "C#", "D-", "D#", "E-", "F-", "F#", "G-", "G#", "A-", "A#", "B-"];
const OCTAVES = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const generateEmptyNote = (): PatternNote => ({
  note: "---",
  instrument: "..",
  volume: "..",
  effect: "....",
});

const generateRandomNote = (): PatternNote => {
  const hasNote = Math.random() > 0.7;
  if (!hasNote) return generateEmptyNote();
  
  const note = NOTES[Math.floor(Math.random() * NOTES.length)];
  const octave = OCTAVES[Math.floor(Math.random() * 4) + 3];
  const instrument = String(Math.floor(Math.random() * 8) + 1).padStart(2, "0");
  const hasVolume = Math.random() > 0.5;
  const volume = hasVolume ? String(Math.floor(Math.random() * 64) + 32).padStart(2, "0") : "..";
  const hasEffect = Math.random() > 0.8;
  const effect = hasEffect 
    ? `0${["A", "B", "C", "D", "E", "F"][Math.floor(Math.random() * 6)]}${String(Math.floor(Math.random() * 99)).padStart(2, "0")}`
    : "....";
  
  return { note: `${note}${octave}`, instrument, volume, effect };
};

const generatePattern = (tracks: number, rows: number): PatternRow[] => {
  return Array.from({ length: rows }, () => ({
    notes: Array.from({ length: tracks }, () => generateRandomNote()),
  }));
};

export const PatternEditor = ({
  trackCount = 4,
  rowCount = 64,
  trackColor = "hsl(var(--primary))",
  patternName = "Pattern 00",
}: PatternEditorProps) => {
  const [pattern, setPattern] = useState<PatternRow[]>(() => 
    generatePattern(trackCount, rowCount)
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [currentColumn, setCurrentColumn] = useState(0); // 0=note, 1=inst, 2=vol, 3=fx
  const [isPlaying, setIsPlaying] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [highlightInterval, setHighlightInterval] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to current row
  useEffect(() => {
    if (containerRef.current) {
      const rowElement = containerRef.current.querySelector(`[data-row="${currentRow}"]`);
      if (rowElement) {
        rowElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentRow]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!editMode) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setCurrentRow((prev) => Math.min(prev + 1, rowCount - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setCurrentRow((prev) => Math.max(prev - 1, 0));
          break;
        case "ArrowRight":
          e.preventDefault();
          if (currentColumn < 3) {
            setCurrentColumn((prev) => prev + 1);
          } else if (currentTrack < trackCount - 1) {
            setCurrentTrack((prev) => prev + 1);
            setCurrentColumn(0);
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (currentColumn > 0) {
            setCurrentColumn((prev) => prev - 1);
          } else if (currentTrack > 0) {
            setCurrentTrack((prev) => prev - 1);
            setCurrentColumn(3);
          }
          break;
        case "Delete":
        case "Backspace":
          e.preventDefault();
          // Clear current cell
          setPattern((prev) => {
            const newPattern = [...prev];
            const row = { ...newPattern[currentRow] };
            const notes = [...row.notes];
            const note = { ...notes[currentTrack] };
            
            if (currentColumn === 0) note.note = "---";
            else if (currentColumn === 1) note.instrument = "..";
            else if (currentColumn === 2) note.volume = "..";
            else note.effect = "....";
            
            notes[currentTrack] = note;
            row.notes = notes;
            newPattern[currentRow] = row;
            return newPattern;
          });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentRow, currentTrack, currentColumn, editMode, rowCount, trackCount]);

  const isCurrentCell = (row: number, track: number, col: number) =>
    row === currentRow && track === currentTrack && col === currentColumn;

  const isCurrentRow = (row: number) => row === currentRow;

  const handleCellClick = (row: number, track: number, col: number) => {
    setCurrentRow(row);
    setCurrentTrack(track);
    setCurrentColumn(col);
  };

  return (
    <div className="h-full flex flex-col bg-daw-track font-mono-daw text-xs">
      {/* Header Bar */}
      <div className="h-8 flex items-center justify-between px-3 border-b border-border bg-daw-header shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: trackColor }}
            />
            <span className="text-foreground font-medium">{patternName}</span>
          </div>
          <span className="text-muted-foreground">
            Row {String(currentRow).padStart(2, "0")} / {rowCount - 1}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
              editMode 
                ? "bg-destructive/20 text-destructive" 
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {editMode ? "EDIT" : "VIEW"}
          </button>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="text-[10px]">HL:</span>
            <button
              onClick={() => setHighlightInterval(Math.max(1, highlightInterval - 1))}
              className="p-0.5 hover:text-foreground transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-4 text-center text-foreground">{highlightInterval}</span>
            <button
              onClick={() => setHighlightInterval(highlightInterval + 1)}
              className="p-0.5 hover:text-foreground transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Track Headers */}
      <div className="flex border-b border-border bg-daw-header shrink-0">
        {/* Row number column header */}
        <div className="w-10 h-6 flex items-center justify-center text-muted-foreground border-r border-border shrink-0">
          #
        </div>
        {/* Track column headers */}
        {Array.from({ length: trackCount }).map((_, i) => (
          <div
            key={i}
            className="flex-1 min-w-[180px] h-6 flex items-center justify-center border-r border-border text-muted-foreground"
            style={{ 
              backgroundColor: i === currentTrack ? `${trackColor}15` : undefined 
            }}
          >
            <span>Track {String(i + 1).padStart(2, "0")}</span>
          </div>
        ))}
      </div>

      {/* Column Subheaders */}
      <div className="flex border-b border-border bg-muted/50 shrink-0">
        <div className="w-10 h-5 shrink-0 border-r border-border" />
        {Array.from({ length: trackCount }).map((_, i) => (
          <div
            key={i}
            className="flex-1 min-w-[180px] flex border-r border-border"
            style={{ 
              backgroundColor: i === currentTrack ? `${trackColor}10` : undefined 
            }}
          >
            <div className="flex-[3] text-center text-[9px] text-muted-foreground border-r border-border/50 py-0.5">
              NOTE
            </div>
            <div className="flex-[2] text-center text-[9px] text-muted-foreground border-r border-border/50 py-0.5">
              INS
            </div>
            <div className="flex-[2] text-center text-[9px] text-muted-foreground border-r border-border/50 py-0.5">
              VOL
            </div>
            <div className="flex-[3] text-center text-[9px] text-muted-foreground py-0.5">
              FX
            </div>
          </div>
        ))}
      </div>

      {/* Pattern Grid */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto no-scrollbar"
      >
        {pattern.map((row, rowIndex) => {
          const isHighlightRow = rowIndex % highlightInterval === 0;
          const isCurrent = isCurrentRow(rowIndex);
          
          return (
            <div
              key={rowIndex}
              data-row={rowIndex}
              className={`flex border-b border-border/30 ${
                isCurrent 
                  ? "bg-primary/20" 
                  : isHighlightRow 
                    ? "bg-secondary/40" 
                    : "bg-transparent hover:bg-secondary/20"
              }`}
            >
              {/* Row Number */}
              <div 
                className={`w-10 h-5 flex items-center justify-center shrink-0 border-r border-border ${
                  isHighlightRow ? "text-foreground font-semibold" : "text-muted-foreground"
                }`}
              >
                {String(rowIndex).padStart(2, "0")}
              </div>

              {/* Track Columns */}
              {row.notes.map((note, trackIndex) => (
                <div
                  key={trackIndex}
                  className={`flex-1 min-w-[180px] flex border-r border-border/50 ${
                    trackIndex === currentTrack && isCurrent ? "bg-primary/10" : ""
                  }`}
                >
                  {/* Note */}
                  <div
                    onClick={() => handleCellClick(rowIndex, trackIndex, 0)}
                    className={`flex-[3] h-5 flex items-center justify-center cursor-pointer transition-colors ${
                      isCurrentCell(rowIndex, trackIndex, 0)
                        ? "bg-primary text-primary-foreground"
                        : note.note !== "---"
                          ? "text-foreground"
                          : "text-muted-foreground/50"
                    }`}
                  >
                    {note.note}
                  </div>

                  {/* Instrument */}
                  <div
                    onClick={() => handleCellClick(rowIndex, trackIndex, 1)}
                    className={`flex-[2] h-5 flex items-center justify-center cursor-pointer border-l border-border/30 transition-colors ${
                      isCurrentCell(rowIndex, trackIndex, 1)
                        ? "bg-primary text-primary-foreground"
                        : note.instrument !== ".."
                          ? "text-accent"
                          : "text-muted-foreground/30"
                    }`}
                  >
                    {note.instrument}
                  </div>

                  {/* Volume */}
                  <div
                    onClick={() => handleCellClick(rowIndex, trackIndex, 2)}
                    className={`flex-[2] h-5 flex items-center justify-center cursor-pointer border-l border-border/30 transition-colors ${
                      isCurrentCell(rowIndex, trackIndex, 2)
                        ? "bg-primary text-primary-foreground"
                        : note.volume !== ".."
                          ? "text-blue-400"
                          : "text-muted-foreground/30"
                    }`}
                  >
                    {note.volume}
                  </div>

                  {/* Effect */}
                  <div
                    onClick={() => handleCellClick(rowIndex, trackIndex, 3)}
                    className={`flex-[3] h-5 flex items-center justify-center cursor-pointer border-l border-border/30 transition-colors ${
                      isCurrentCell(rowIndex, trackIndex, 3)
                        ? "bg-primary text-primary-foreground"
                        : note.effect !== "...."
                          ? "text-yellow-400"
                          : "text-muted-foreground/30"
                    }`}
                  >
                    {note.effect}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Footer Status Bar */}
      <div className="h-6 flex items-center justify-between px-3 border-t border-border bg-daw-header text-[10px] text-muted-foreground shrink-0">
        <div className="flex items-center gap-4">
          <span>Tracks: {trackCount}</span>
          <span>Rows: {rowCount}</span>
          <span>BPM: 120</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-foreground">↑↓←→</span>
          <span>Navigate</span>
          <span className="ml-2 text-foreground">Del</span>
          <span>Clear</span>
        </div>
      </div>
    </div>
  );
};
