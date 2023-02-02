import {Box} from '@mui/material';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {useEffect, useState} from 'react';
import Caxios from '../api/Caxios';
import {getAPIUrl, mapSchedule} from '../api/Ergast';
import {useAppState} from '../app/AppStateProvider';
import ByLine from '../drivers/ByLine';
import {Race} from '../types/ergast';
import Link from '../ui-components/Link';
import RaceMap from './RaceMap';

export default function Schedule() {
	const [{season}]        = useAppState();
	const [races, setRaces] = useState<Race[]>([]);
	
	useEffect(() => {
		Promise.all([
			       Caxios.get(getAPIUrl(`/${season}/results/1.json`))
			             .then(mapSchedule),
			
			       Caxios.get(getAPIUrl(`/${season}.json`))
			             .then(mapSchedule)
		       ])
		       .then(([results, schedule]) => {
			       setRaces(schedule.map(race => (
				       {
					       ...race,
					       Results: results.find(r => r.round === race.round)?.Results || race.Results
				       }
			       )));
		       });
	}, [season]);
	
	return (
		<>
			<Box sx={{px: 2}}><RaceMap season={season} races={races}/></Box>
			<DataGrid
				sx={{mt: 2}}
				rows={races}
				autoHeight
				density="compact"
				getRowId={(row) => row.round || ''}
				columns={
					[
						{
							field: 'date',
							headerName: 'Date',
							headerAlign: 'center',
							type: 'date',
							align: 'center',
							renderCell: ({value}) => (new Date(value)).toLocaleDateString(),
							minWidth: 100
						},
						{
							field: 'raceName',
							headerName: 'Race',
							flex: 1,
							renderCell: ({row, value}) => (
								<Link to={`/race/${season}/${row.round}#${row.raceName}`}>{value}</Link>
							),
							minWidth: 200
						},
						{
							field: 'winner',
							headerName: 'Winner',
							flex: 1,
							renderCell: ({row}) => {
								if (!row.Results?.length) {
									return '--';
								}
								
								return <ByLine id={row.Results.find(r => Number(r.position) === 1)?.Driver?.driverId}/>;
							},
							minWidth: 200
						}
					] as GridColDef<Race>[]
				}
			/>
		</>
	);
}