import {useEffect, useState} from 'react';
import Caxios from '../api/Caxios';
import {getAPIUrl, mapCircuits, mapDriverCareer, mapRaces, mapSchedule} from '../api/Ergast';
import {Circuit, Race, SeasonStanding} from '../types/ergast';
import {DriverId} from './DriverProvider';

export function useRacesBySeason(season: number, driverId: DriverId) {
	const [races, setRaces] = useState<Race[] | undefined>();
	
	useEffect(() => {
		const dataUrl = getAPIUrl(`/${season}/drivers/${driverId}/results.json`);
		
		Caxios.get(dataUrl)
		      .then(mapSchedule)
		      .then(races => setRaces(races));
	}, [season, driverId]);
	
	return races;
}

export function useCareerResults(driverId: DriverId) {
	const [races, setRaces] = useState<Race[] | undefined>();
	
	useEffect(() => {
		const dataUrl = getAPIUrl(`/drivers/${driverId}/results.json`);
		
		Caxios.get(dataUrl, {params: {limit: 1000}})
		      .then(mapRaces)
		      .then(races => setRaces(races));
	}, [driverId]);
	
	return races;
}

export function useCareerStandings(driverId: DriverId) {
	const [seasonStandings, setSeasonStandings] = useState<SeasonStanding[] | undefined>();
	
	useEffect(() => {
		const dataUrl = getAPIUrl(`/drivers/${driverId}/driverStandings.json`);
		Caxios.get(dataUrl)
		      .then(mapDriverCareer)
		      .then(data => {
			      setSeasonStandings(data);
		      })
		      .catch(() => setSeasonStandings([]));
	}, [driverId]);
	
	return seasonStandings;
}

export type CircuitWithRaces = Circuit & {
	races: Race[];
	averagePosition?: number;
	averageTime?: number;
}

const getCircuitResults = (driverId: DriverId, circuit: Circuit): Promise<CircuitWithRaces> => {
	const dataUrl = getAPIUrl(`/drivers/${driverId}/circuits/${circuit.circuitId}/results.json`);
	
	return Caxios.get(dataUrl)
	             .then(mapRaces)
	             .then(races => ({
		             ...circuit,
		             races
	             }))
	             .catch(() => ({
		             ...circuit,
		             races: []
	             }));
};

export function useResultsByCircuit(driverId: DriverId) {
	const [circuits, setCircuits] = useState<CircuitWithRaces[] | undefined>();
	
	useEffect(() => {
		const dataUrl = getAPIUrl(`/drivers/${driverId}/circuits.json`);
		
		Caxios.get(dataUrl)
		      .then(mapCircuits)
		      .then(circuits => {
			      Promise.all(circuits.map(circuit => getCircuitResults(driverId, circuit)))
			             .then((circuitsWithRaces) => {
				             return circuitsWithRaces.map((circuit) => {
					             const racePositions: number[] = [];
					             const raceTimes: number[]     = [];
					
					             circuit.races.forEach(race => {
						             if (race.Results?.[0].position) {
							             racePositions.push(Number(race.Results?.[0].position));
						             }
						
						             try {
							             const time = Number(race.Results?.[0].Time?.millis);
							
							             if (time) {
								             raceTimes.push(time);
							             }
						             }
						             catch (e) {
							             // time could not be calculated
						             }
					             });
					
					             return {
						             ...circuit,
						             averagePosition: !racePositions.length ? undefined : Math.round(racePositions.reduce((a, v) => a + v, 0) / racePositions.length),
						             averageTime: !raceTimes.length ? undefined : raceTimes.reduce((a, v) => a + v, 0) / raceTimes.length
					             };
				             });
			             })
			             .then(circuitsWithRacesAndTimes => setCircuits(circuitsWithRacesAndTimes));
			      return circuits;
		      })
		      .catch(() => setCircuits([]));
	}, [driverId]);
	
	return circuits;
}