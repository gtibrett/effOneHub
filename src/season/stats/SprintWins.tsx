import {gql, useQuery} from '@apollo/client';
import {StatCard} from '@ui-components';
import {DriverId} from '../../driver';
import {SeasonStatProps} from './index';

type Data = {
	races: {
		sprintResults: {
			driverId: DriverId
		}[]
	}[]
}

const query = gql`
	query seasonSprintWinsLeaderQuery($season: Int!) {
		races (condition: {year: $season},orderBy: ROUND_ASC) {
			sprintResults (condition: {positionOrder: 1}) {
				driverId
			}
		}
	}
`;

export default function SprintWins({season, size}: SeasonStatProps) {
	const {data, loading} = useQuery<Data>(query, {variables: {season}});
	const leaders         = new Map<number, number>();
	
	(data?.races || []).forEach(r => {
		r.sprintResults.forEach(rs => {
			leaders.set(rs.driverId, (leaders.get(rs.driverId) || 0) + 1);
		});
	});
	
	return <StatCard size={size} loading={loading} data={leaders} label="Most Sprint Wins"/>;
}