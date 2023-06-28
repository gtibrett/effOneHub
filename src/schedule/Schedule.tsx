import {Race} from '@gtibrett/effone-hub-api';
import {Box} from '@mui/material';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {useEffect, useState} from 'react';
import Caxios from '../api/Caxios';
import {getAPIUrl, mapSchedule} from '../api/Ergast';
import {useAppState} from '../app/AppStateProvider';
import ByLine from '../drivers/ByLine';
import RaceMap from '../maps/RaceMap';
import useMapSeasonRacesToMapPoints from '../maps/useMapSeasonRacesToMapPoints';
import Link from '../ui-components/Link';

export default function Schedule() {
	const [{season}]               = useAppState();
	const mapSeasonRacesToFeatures = useMapSeasonRacesToMapPoints();
	const [races, setRaces]        = useState<Race[]>([]);
	
	useEffect(() => {
		Promise.all([
			       Caxios.get(getAPIUrl(`/${season}/results/1.json`))
			             .then(mapSchedule),
			       
			       Caxios.get(getAPIUrl(`/${season}.json`))
			             .then(mapSchedule)
		       ])
		       .then(([results, schedule]) => {
			       const racesWithResults = schedule.map(race => (
				       {
					       ...race,
					       Results: results.find(r => r.round === race.round)?.Results || race.Results
				       }
			       ));
			       
			       setRaces(racesWithResults);
		       });
	}, [season]);
	
	const {points, onClick} = mapSeasonRacesToFeatures(season, races);
	
	return (
		<>
			<Box sx={{px: 2}}><RaceMap points={points} onClick={onClick}/></Box>
			<DataGrid
				sx={{mt: 2}}
				rows={races}
				autoHeight
				density="compact"
				getRowId={(row) => row.round || ''}
				initialState={{
					sorting: {
						sortModel: [{field: 'date', sort: 'asc'}]
					}
				}}
				columns={
					[
						{
							field:       'date',
							headerName:  'Date',
							headerAlign: 'center',
							type:        'date',
							align:       'center',
							valueGetter: ({value}) => (new Date(value)),
							renderCell:  ({value}) => value.toLocaleDateString(),
							minWidth:    100,
							sortable:    false
						},
						{
							field:      'raceName',
							headerName: 'Race',
							flex:       1,
							renderCell: ({row, value}) => (
								<Link to={`/race/${season}/${row.round}#${row.raceName}`}>{value}</Link>
							),
							minWidth:   200,
							sortable:   false
						},
						{
							field:      'winner',
							headerName: 'Winner',
							flex:       1,
							renderCell: ({row}) => {
								if (!row.Results?.length) {
									return '--';
								}
								
								return <ByLine id={row.Results.find(r => Number(r.position) === 1)?.Driver?.driverId}/>;
							},
							minWidth:   200,
							sortable:   false
						}
					] as GridColDef<Race>[]
				}
			/>
		</>
	);
}