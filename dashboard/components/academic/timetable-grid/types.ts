export interface CellCoord {
	dayIndex: number;
	periodIndex: number;
}

export interface GridConfig {
	periodDuration: number; // default 45 minutes
	breakThreshold: number; // min gap to show break indicator (default 10)
}

export interface SubjectColorEntry {
	bg: string;
	border: string;
	text: string;
	dot: string;
}
