import {ScatterPlotDatum, ScatterPlotRawSerie} from '@nivo/scatterplot';
import {SwarmPlotSvgProps} from '@nivo/swarmplot';
import {RaceData} from '../../api/analysis/types';

export const lapTimeVsFinish = (raceData: RaceData[]): ScatterPlotRawSerie<ScatterPlotDatum> => ({
	id: 'lapTimeVsFinish',
	data: raceData.map(r => r.laps.map(d => ({
		x: d.lapTime,
		y: r.finish
	}))).flat()
});

export const lapTimesVsLapByYear = (raceData: RaceData[]): ScatterPlotRawSerie<ScatterPlotDatum>[] => {
	return [{
		id: 'variance',
		data: raceData.map(race => ({
			y: race.stdDevLapTime,
			x: race.year
		}))
	}];
};

export type SwarmData = {
	group: string;
	finish: number;
	lap: number;
	deviations: number;
	lapTime: number;
	constructorId: string | undefined;
}

export const lapTimeVsAverageLapTime = (raceData: RaceData[]): SwarmPlotSvgProps<SwarmData>['data'] => {
	const data: SwarmPlotSvgProps<SwarmData>['data'] = [];
	raceData.forEach(race => {
		race.laps.forEach(d => {
			data.push({
				group: String(race.year),
				finish: race.finish,
				lap: d.lap,
				lapTime: d.lapTime,
				deviations: Math.abs(d.lapTime - race.averageLapTime) / race.stdDevLapTime,
				constructorId: race.constructorRef
			});
		});
	});
	
	return data;
};