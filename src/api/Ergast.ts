import {AxiosResponse} from 'axios';
import {Circuit, Constructor, Driver as DriverT, Lap, PitStop, QualifyingResult, Race, Responses, SeasonStanding, Standing} from '../types/ergast';

export const getCanonicalId = (summary: DriverT | Constructor | undefined) => {
	if (!summary) {
		return undefined;
	}
	const urlParts    = (summary.url || '').split('/');
	const canonicalId = urlParts.pop();
	return canonicalId ? decodeURI(canonicalId) : undefined;
};

export function getAPIUrl(path: string) {
	return `${process.env.REACT_APP_API_URL}${path}`;
}

export const mapSchedule = (response: AxiosResponse<Responses['ResultsByYearResponse']>): Race[] => {
	if (response.data.MRData?.RaceTable?.Races) {
		return response?.data?.MRData?.RaceTable?.Races;
	}
	
	return [];
};

export const mapCircuits = (response: AxiosResponse<Responses['CircuitsResponse']>): Circuit[] => {
	if (response.data.MRData?.CircuitTable?.Circuits) {
		return response?.data?.MRData?.CircuitTable?.Circuits;
	}
	
	return [];
};

export const mapDriversStandings = (response: AxiosResponse<Responses['DriverStandingsByYearResponse']>): Standing[] => {
	if (response.data.MRData?.StandingsTable?.StandingsLists?.[0].DriverStandings) {
		return response?.data?.MRData?.StandingsTable?.StandingsLists?.[0].DriverStandings.map((standing) => ({
			...standing,
			id: standing.Driver?.driverId,
			Driver: {
				...standing.Driver,
				canonicalId: getCanonicalId(standing.Driver)
			}
		}));
	}
	
	return [];
};

export const mapDriverCareer = (response: AxiosResponse<Responses['DriverStandingsByYearResponse']>): SeasonStanding[] => {
	if (response.data.MRData?.StandingsTable?.StandingsLists?.[0].DriverStandings) {
		return response?.data?.MRData?.StandingsTable?.StandingsLists.map((season) => ({
			...season,
			DriverStandings: season.DriverStandings?.map(standing => ({
				...standing,
				id: standing.Driver?.driverId,
				Driver: {
					...standing.Driver,
					canonicalId: getCanonicalId(standing.Driver)
				}
			}))
		}));
	}
	
	return [];
};

export const mapConstructorHistory = (response: AxiosResponse<Responses['ConstructorStandingsByYearResponse']>): SeasonStanding[] => {
	if (response.data.MRData?.StandingsTable?.StandingsLists?.[0].ConstructorStandings) {
		return response?.data?.MRData?.StandingsTable?.StandingsLists.map((season) => ({
			...season,
			ConstructorStandings: season.ConstructorStandings?.map(standing => ({
				...standing,
				id: standing.Constructor?.constructorId,
				Constructors: [{
					...standing.Constructor,
					canonicalId: getCanonicalId(standing.Constructor)
				}]
			}))
		}));
	}
	
	return [];
};

export const mapRace = (response: AxiosResponse<Responses['ResultsByYearResponse']>): Race | undefined => {
	if (response.data.MRData?.RaceTable?.Races?.[0].Results) {
		return {
			...response.data.MRData?.RaceTable?.Races?.[0],
			Results: (response.data.MRData?.RaceTable?.Races?.[0].Results || []).map((result) => ({
				...result,
				id: result.position,
				Driver: {
					...result.Driver,
					canonicalId: getCanonicalId(result.Driver)
				}
			}))
		};
	}
	
	return undefined;
};

export const mapPitStops = (response: AxiosResponse<Responses['ResultsByYearResponse']>): PitStop[] | undefined => {
	if (response.data.MRData?.RaceTable?.Races?.[0].PitStops) {
		return response.data.MRData?.RaceTable?.Races?.[0].PitStops;
	}
	
	return undefined;
};

export const mapRaces = (response: AxiosResponse<Responses['ResultsByYearResponse']>): Race[] => {
	if (response.data.MRData?.RaceTable?.Races) {
		return response.data.MRData?.RaceTable?.Races;
	}
	
	return [];
};

export const mapQualifying = (response: AxiosResponse<Responses['ResultsByYearResponse']>): QualifyingResult[] => {
	if (response.data.MRData?.RaceTable?.Races?.[0].QualifyingResults) {
		return response.data.MRData?.RaceTable?.Races?.[0].QualifyingResults.map((qualifying) => ({
			...qualifying,
			id: qualifying.position,
			Driver: {
				...qualifying.Driver,
				canonicalId: getCanonicalId(qualifying.Driver)
			}
		}));
	}
	
	return [];
};

export const mapLaps = (response: AxiosResponse<Responses['ResultsByYearResponse']>): Lap[] => {
	if (response.data.MRData?.RaceTable?.Races?.[0].Laps) {
		return response.data.MRData?.RaceTable?.Races?.[0].Laps.map((lap) => ({
			...lap,
			id: lap.number
		}));
	}
	
	return [];
};

export const mapConstructorsStandings = (response: AxiosResponse<Responses['ConstructorStandingsByYearResponse']>): Standing[] => {
	if (response.data.MRData?.StandingsTable?.StandingsLists?.[0].ConstructorStandings) {
		return response?.data?.MRData?.StandingsTable?.StandingsLists?.[0].ConstructorStandings.map((standing) => ({
			...standing,
			id: standing.Constructor?.constructorId
		}));
	}
	
	return [];
};