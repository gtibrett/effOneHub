export type RaceData = {
	raceId: number;
	year: number;
	round: number;
	circuitId: number | string | undefined;
	driverRef: string | undefined;
	constructorRef: string | undefined;
	grid: number;
	finish: number;
	points: number;
	totalTime: number;
	averageLapTime: number;
	stdDevLapTime: number;
	lapsFinished: number;
	fastestLapTime: number;
	fastestLapRank: number;
	
	laps: LapData[];
}

export type LapData = {
	raceId: number;
	lap: number;
	driverId: string | undefined; // Alias to driverRef
	lapTime: number;
	timeInPit: number;
}