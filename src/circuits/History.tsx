import {Alert, Skeleton} from '@mui/material';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {useEffect, useState} from 'react';
import Caxios from '../api/Caxios';
import {getAPIUrl, mapRaces} from '../api/Ergast';
import ByLine from '../drivers/ByLine';
import {Circuit, Race, Responses} from '../types/ergast';
import Link from '../ui-components/Link';

export default function History({circuitId}: { circuitId: Circuit['circuitId'] }) {
	const [races, setRaces] = useState<Race[] | undefined>();
	
	useEffect(() => {
		Caxios.get<Responses['ResultsByYearResponse']>(getAPIUrl(`/circuits/${circuitId}/results/1.json`), {params: {limit: 2000}})
		      .then(mapRaces)
		      .then(data => {
			      setRaces(data);
		      });
	}, [circuitId]);
	
	if (!races) {
		return <Skeleton variant="rectangular" height={400}/>;
	}
	
	if (!races.length) {
		return <Alert variant="outlined" severity="info">Race Data Not Available</Alert>;
	}
	
	const rows = races.map(row => ({
		...row,
		id: row.season
	}));
	
	return (
		<DataGrid
			rows={rows}
			autoHeight
			density="compact"
			columns={
				[
					{
						field: 'season',
						headerName: 'P',
						width: 60,
						headerAlign: 'center',
						align: 'center',
						type: 'number'
					},
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
							<Link to={`/race/${row.season}/${row.round}#${row.raceName}`}>{value}</Link>
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
					},
					{
						field: 'time',
						headerName: 'Time',
						sortable: false,
						headerAlign: 'left',
						align: 'left',
						flex: .5,
						renderCell: ({row}) => row.Results?.[0]?.Time?.time || '--',
						minWidth: 110
					}
				] as GridColDef<Race>[]
			}
		/>
	);
}