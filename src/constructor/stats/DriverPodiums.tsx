import {gql, useQuery} from '@apollo/client';
import {Team} from '@gtibrett/effone-hub-graph-api';
import {StatCard} from '@ui-components';
import {DriverId} from '../../driver';

type Data = {
	races: {
		results: {
			driverId: DriverId;
			positionOrder: number;
		}[]
	}[]
}

const query = gql`
	query driverSeasonStatsByConstructor($season: Int!, $teamId: Int!) {
		races (condition: {year: $season},orderBy: ROUND_ASC) {
			results (condition: {teamId: $teamId}) {
				driverId
				positionOrder
			}
		}
	}
`;

type DriverPointsProps = {
	teamId: Team['teamId'];
	season: number;
	place: 1 | 2
}

export default function DriverPodiums({teamId, season, place}: DriverPointsProps) {
	const {data, loading} = useQuery<Data>(query, {variables: {teamId, season}});
	const leaders         = new Map<number, number>();
	
	(data?.races || []).forEach(r => {
		r.results.forEach(rs => {
			leaders.set(rs.driverId, (leaders.get(rs.driverId) || 0) + (rs.positionOrder < 4 ? 1 : 0));
		});
	});
	
	return <StatCard loading={loading} data={new Map([...leaders.entries()].sort((a, b) => b[1] - a[1]).slice(place - 1, place))} label="Podiums"/>;
}