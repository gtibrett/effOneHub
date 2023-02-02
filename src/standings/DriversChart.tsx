import {Box, Skeleton} from '@mui/material';
import {ResponsiveBump} from '@nivo/bump';
import {useEffect, useMemo, useState} from 'react';
import Caxios from '../api/Caxios';
import {getAPIUrl, mapSchedule} from '../api/Ergast';
import {useAppState} from '../app/AppStateProvider';
import {getColorByConstructorId} from '../constructors';
import ByLine from '../drivers/ByLine';
import LapByLapTooltip from '../race/lapByLap/LapByLapTooltip';
import {Race, Result} from '../types/ergast';
import {NivoTooltip, useNivoTheme} from '../ui-components/nivo';

type ChartSerie = {
	id: string;
	color: string;
	data: {
		x: number;
		y: number;
		total: number;
		data: Result;
	}[]
}

type RaceTotalRecord = {
	round: number;
	driverId: string;
	total: number;
}

const sortRacesByTotal = (a: RaceTotalRecord, b: RaceTotalRecord) => {
	if (a.total > b.total) {
		return -1;
	}
	else if (a.total < b.total) {
		return 1;
	}
	else {
		return 0;
	}
};

const useChartData = (races: Race[] | undefined) => {
	return useMemo(() => {
		const data: ChartSerie[] = [];
		if (races) {
			races.forEach((race => {
				race.Results?.forEach(result => {
					let index = data.findIndex(serie => serie.id === result.Driver?.driverId);
					if (result.Driver?.driverId) {
						if (index === -1) {
							const constructorId = result.Constructor?.constructorId;
							const color         = getColorByConstructorId(constructorId);
							data.push({
								id: result.Driver?.driverId,
								color,
								data: []
							});
							
							index = data.length - 1;
						}
						
						data[index].data.push({
							x: Number(race.round),
							y: 0,
							total: data[index].data.reduce((total, {data: r}) => Number(r.points) + total, 0) + Number(result.points),
							data: result
						});
					}
				});
			}));
			
			races.forEach(race => {
				const raceData = data.map(serie => ({round: Number(race.round), driverId: serie.id, total: serie.data.find(r => r.x === Number(race.round))?.total || 0}));
				raceData.sort(sortRacesByTotal);
				
				raceData.forEach((r, i) => {
					const serieIndex = data.findIndex(s => s.id === r.driverId);
					if (serieIndex !== -1) {
						const roundIndex = data[serieIndex].data.findIndex(d => d.x === r.round);
						if (roundIndex !== -1) {
							data[serieIndex].data[roundIndex].y = i + 1;
						}
					}
				});
			});
		}
		
		return data;
		
	}, [races]);
};

export default function DriversChart() {
	const nivoTheme         = useNivoTheme();
	const height            = 250;
	const [{season}]        = useAppState();
	const [races, setRaces] = useState<Race[]>([]);
	const data              = useChartData(races);
	
	useEffect(() => {
		const dataUrl = getAPIUrl(`/${season}/results.json`);
		Caxios.get(dataUrl)
		      .then(mapSchedule)
		      .then(races => setRaces(races));
	}, [season]);
	
	if (!data) {
		return <Skeleton variant="rectangular" height={height}/>;
	}
	
	if (!data.length) {
		return null;
	}
	
	return (
		<Box height={height} width="100%" sx={{boxSizing: 'border-box'}} aria-hidden>
			<ResponsiveBump
				theme={nivoTheme}
				data={data}
				colors={({color}) => color || 'transparent'}
				lineWidth={3}
				activeLineWidth={6}
				inactiveLineWidth={3}
				inactiveOpacity={0.35}
				pointSize={0}
				activePointSize={0}
				inactivePointSize={0}
				pointBorderWidth={0}
				activePointBorderWidth={0}
				// @ts-ignore
				startLabel={({id}) => <ByLine variant="code" id={id}/>}
				endLabel={false}
				enableGridX={false}
				enableGridY={false}
				axisTop={null}
				axisLeft={null}
				axisBottom={null}
				axisRight={{
					tickSize: 0,
					tickPadding: 10,
					tickRotation: 0
				}}
				margin={{top: 0, right: 44, bottom: 24, left: 60}}
				tooltip={NivoTooltip(LapByLapTooltip)}
			/>
		</Box>
	);
}