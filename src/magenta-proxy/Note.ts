export interface Note {
    /**
     * Pitch as MIDI note.
     */
    pitch: number;
    quantizedStartStep: number; 
    quantizedEndStep: number;
}