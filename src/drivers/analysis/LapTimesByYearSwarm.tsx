import {Alert, Box, Skeleton} from '@mui/material';
import {ResponsiveSwarmPlot} from '@nivo/swarmplot';
import {useEffect, useState} from 'react';
import {RaceData} from '../../api/analysis/types';
import Caxios from '../../api/Caxios';
import {getAPIUrl, mapLaps} from '../../api/Ergast';
import {getColorByConstructorId} from '../../constructors';
import {getDateFromTimeString} from '../../race/lapTimes/helpers';
import {Circuit, Race} from '../../types/ergast';
import {useNivoTheme} from '../../ui-components/nivo';
import {DriverId} from '../DriverProvider';
import {lapTimeVsAverageLapTime, SwarmData} from './mappers';

type LapTimesChartProps = {
	circuitId: Circuit['circuitId'];
	driverId: DriverId;
}

function getStandardDeviation(data: number[]) {
	const n = data.length;
	
	if (!n) {
		return 0;
	}
	
	const mean = data.reduce((a, b) => a + b, 0) / n;
	return Math.sqrt(data.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
}

export default function LapTimesByYearSwarm({circuitId, driverId}: LapTimesChartProps) {
	const nivoTheme       = useNivoTheme();
	const [data, setData] = useState<RaceData[] | undefined>();
	
	// useEffect(() => {
	// 	const dataUrl = `http://localhost:3001/raceData/driver/${driverId}/circuit/${circuitId}`;
	//
	// 	Caxios.get(dataUrl)
	// 	      .then(response => response.data)
	// 	      .then(d => setData(d));
	// }, [circuitId, driverId]);
	
	useEffect(() => {
		
		Caxios.get(getAPIUrl(`/drivers/${driverId}/circuits/${circuitId}/results.json`))
		      .then(response => response.data.MRData?.RaceTable?.Races || [])
		      .then((races: Race[]) => {
			      Promise.all(races.map(async race => {
				             return await Caxios.get(getAPIUrl(`/${race.season}/${race.round}/drivers/${driverId}/laps.json`))
				                                .then(mapLaps)
				                                .then(laps => {
					                                const raceId = Number(`${race.season}.${race.round}`);
					                                const result = race.Results?.[0] || {};
					
					                                const mappedLaps = laps.map(l => ({
						                                raceId,
						                                lap: Number(l.number),
						                                driverId: driverId,
						                                lapTime: getDateFromTimeString(l.Timings?.[0].time),
						                                timeInPit: 0
					                                }));
					
					                                return {
						                                raceId,
						                                year: Number(race.season),
						                                round: Number(race.round),
						                                circuitId: circuitId,
						                                driverRef: driverId,
						                                constructorRef: result.Constructor?.constructorId,
						                                grid: Number(result.grid),
						                                finish: Number(result.positionText),
						                                points: Number(result.points),
						                                totalTime: Number(result.Time?.millis),
						                                averageLapTime: mappedLaps.reduce((a, v) => v.lapTime + a, 0) / (mappedLaps.length + Number.EPSILON),
						                                stdDevLapTime: getStandardDeviation(mappedLaps.map(l => Number(l.lapTime))),
						                                lapsFinished: Number(result.laps),
						                                fastestLapTime: getDateFromTimeString(result.FastestLap?.Time?.time),
						                                fastestLapRank: Number(result.FastestLap?.rank),
						                                laps: mappedLaps
					                                };
				                                });
			             }))
			             .then(d => {
				             setData(d);
			             });
		      });
	}, [circuitId, driverId]);
	
	if (!data) {
		return <Skeleton variant="rectangular" height={400}/>;
	}
	
	if (!data.length) {
		return <Alert variant="outlined" severity="info">Lap Time Data Not Available</Alert>;
	}
	
	const chartData = lapTimeVsAverageLapTime(data).filter(d => d.deviations < 3);
	
	function findUniqueYears(value: SwarmData, index: number, self: SwarmData[]) {
		return self.findIndex(v => v.group === value.group) === index;
	}
	
	const years = chartData.filter(findUniqueYears).map(y => String(y.group)).sort();
	const min   = Math.min(...chartData.map(d => d.lapTime));
	const max   = Math.max(...chartData.map(d => d.lapTime));
	
	return (
		<Box sx={{height: '60vh', width: '100%'}} aria-hidden>
			<ResponsiveSwarmPlot
				theme={nivoTheme}
				animate={false}
				data={chartData}
				groups={years}
				// @ts-ignore
				identity="finish"
				colors={({data}) => {
					const {constructorId} = data;
					return getColorByConstructorId(constructorId);
				}
				}
				gap={10}
				spacing={0}
				value="lapTime"
				valueScale={{type: 'linear', min, max}}
				size={6}
				forceStrength={1}
				simulationIterations={50}
				borderColor={{
					from: 'color',
					modifiers: [
						[
							'darker',
							0.6
						],
						[
							'opacity',
							0.5
						]
					]
				}}
				margin={{top: 10, right: 10, bottom: 80, left: 10}}
				axisTop={null}
				axisRight={null}
				axisBottom={{
					tickSize: 10,
					tickPadding: 5,
					tickRotation: 0
				}}
				axisLeft={{
					tickSize: 0,
					tickPadding: 0,
					tickRotation: 0,
					tickValues: 0
				}}
			/>
		</Box>
	);
}