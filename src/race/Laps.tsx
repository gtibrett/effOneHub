import {Alert, Skeleton} from '@mui/material';
import {useEffect, useState} from 'react';
import Caxios from '../api/Caxios';
import {getAPIUrl, mapLaps} from '../api/Ergast';
import {Lap, Race} from '../types/ergast';
import Tabs from '../ui-components/Tabs';
import LapByLap from './lapByLap/LapByLap';
import LapByLapTable from './lapByLap/LapByLapTable';
import LapTimesTable from './lapTimes/LapTimesTable';

type LapByLapProps = {
	season: string;
	round: string;
	results: Race['Results']
}

export default function Laps({season, round, results}: LapByLapProps) {
	const [laps, setLaps] = useState<Lap[] | undefined>();
	
	useEffect(() => {
		if (!laps) {
			Caxios.get(getAPIUrl(`/${season}/${round}/laps.json`), {params: {limit: 2000}})
			      .then(mapLaps)
			      .then(laps => setLaps(laps))
			      .catch(() => setLaps([]));
		}
	}, [laps, round, season]);
	
	if (!laps) {
		return <Skeleton variant="rectangular" height={400}/>;
	}
	
	if (!laps.length) {
		return <Alert variant="outlined" severity="info">Lap Data Not Available</Alert>;
	}
	
	let content = <Skeleton variant="rectangular" sx={{width: '100%'}} height="100%"/>;
	if (laps.length) {
		content = (
			<Tabs active="byLap" tabs={[
				{
					id: 'byLap',
					label: 'Lap by Lap',
					content: <>
						<LapByLap laps={laps} results={results}/>
						<LapByLapTable laps={laps} results={results}/>
					</>
				},
				{
					id: 'times',
					label: 'Lap Times',
					content: <>
						{/* FIXME: This doesn't work in a production build*/}
						{/*<LapTimes laps={laps} results={results}/>*/}
						<LapTimesTable laps={laps} results={results}/>
					</>
				}
			]}/>
		);
	}
	
	return content;
}