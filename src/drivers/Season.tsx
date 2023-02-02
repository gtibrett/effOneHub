import {Alert, Skeleton, Typography} from '@mui/material';
import {visuallyHidden} from '@mui/utils';
import {DataGrid, GridCellParams, GridColDef} from '@mui/x-data-grid';
import {useAppState} from '../app/AppStateProvider';
import {getPositionTextOutcome} from '../helpers';
import PositionChange from '../race/PositionChange';
import {Race} from '../types/ergast';
import Link from '../ui-components/Link';
import {DriverId} from './DriverProvider';
import {useRacesBySeason} from './hooks';
import SeasonChart from './SeasonChart';

type SeasonProps = {
	driverId: DriverId;
}

export default function Season({driverId}: SeasonProps) {
	const [{season}] = useAppState();
	const races      = useRacesBySeason(season, driverId);
	
	if (!races) {
		return <Skeleton variant="rectangular" height={400}/>;
	}
	
	if (!races.length) {
		return <Alert variant="outlined" severity="info">Season Data Not Available</Alert>;
	}
	
	return (
		<>
			<SeasonChart races={races}/>
			<DataGrid
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
							field: 'qualifying',
							headerName: 'Start',
							type: 'number',
							headerAlign: 'center',
							align: 'center',
							valueGetter: ({row}: GridCellParams<string, Race>) => {
								return Number(row.Results?.[0].grid);
							}
						},
						{
							field: 'result',
							headerName: 'Finish',
							type: 'number',
							headerAlign: 'center',
							align: 'center',
							valueGetter: ({row}: GridCellParams<string, Race>) => {
								return Number(row.Results?.[0].position);
							}
						},
						{
							field: 'change',
							renderHeader: () => <Typography sx={visuallyHidden}>Position Changes</Typography>,
							renderCell: ({row}) => {
								const {grid, position} = row.Results?.[0] || {};
								return <PositionChange grid={grid} position={position}/>;
							},
							valueGetter: ({row}) => {
								const {grid, position} = row.Results?.[0] || {};
								if (!grid || !position) {
									return 0;
								}
								
								return Number(grid) - Number(position);
							},
							width: 60,
							headerAlign: 'center',
							align: 'center'
						},
						{
							field: 'points',
							headerName: 'Points',
							type: 'number',
							headerAlign: 'center',
							align: 'center',
							valueGetter: ({row}: GridCellParams<string, Race>) => {
								return Number(row.Results?.[0].points);
							}
						},
						{
							field: 'time',
							headerName: 'Time',
							sortable: false,
							headerAlign: 'left',
							align: 'left',
							flex: .5,
							valueGetter: ({row}: GridCellParams<string, Race>) => {
								const time = row.Results?.[0].Time?.time;
								return time ? time : getPositionTextOutcome(row.Results?.[0].positionText, row.Results?.[0].status);
							}
						}
					] as GridColDef<Race>[]
				}
			/>
		</>
	);
}