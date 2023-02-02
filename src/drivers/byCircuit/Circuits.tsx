import {Alert, Grid, Link, Skeleton} from '@mui/material';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {useState} from 'react';
import CircuitMap from '../../circuits/CircuitMap';
import {getTimeStringFromDate} from '../../race/lapTimes/helpers';
import {Circuit, Driver, Race} from '../../types/ergast';
import {DriverId, useDriver} from '../DriverProvider';
import {useResultsByCircuit} from '../hooks';
import CircuitDialog from './CircuitDialog';

type TracksProps = {
	driverId: DriverId;
};

export type CircuitWithRaces = Circuit & {
	races: Race[];
	averagePosition?: number;
	averageTime?: number;
}

export default function Circuits({driverId}: TracksProps) {
	const driver              = useDriver(driverId);
	const circuits            = useResultsByCircuit(driverId);
	const [active, setActive] = useState<CircuitWithRaces | undefined>();
	
	if (!circuits) {
		return <Skeleton variant="rectangular" height={400}/>;
	}
	
	if (!circuits.length) {
		return <Alert variant="outlined" severity="info">Circuit Data Not Available</Alert>;
	}
	
	return (
		<Grid container spacing={2}>
			<Grid item xs={12}><CircuitMap circuits={circuits}/></Grid>
			<Grid item xs={12}>
				<CircuitDialog driver={driver as Driver} circuit={active} onClose={() => setActive(undefined)}/>
				<DataGrid
					sx={{mt: 2}}
					rows={circuits}
					autoHeight
					density="compact"
					getRowId={(row) => row.circuitId || ''}
					columns={
						[
							{
								field: 'circuitName',
								headerName: 'Race',
								flex: 1,
								minWidth: 250,
								renderCell: ({row}) => <Link color="secondary" onClick={() => setActive(row)}>{row.circuitName}</Link>
							},
							{
								field: 'races',
								headerName: 'Races',
								type: 'number',
								headerAlign: 'center',
								align: 'center',
								flex: 1,
								valueGetter: ({row}) => row.races.length
							},
							{
								field: 'wins',
								headerName: 'Wins',
								type: 'number',
								headerAlign: 'center',
								align: 'center',
								flex: 1,
								valueGetter: ({row}) => row.races.filter(r => Number(r.Results?.[0].position) === 1).length
							},
							{
								field: 'averagePosition',
								headerName: 'Avg. Finish',
								type: 'number',
								headerAlign: 'center',
								align: 'center',
								flex: 1
							},
							{
								field: 'averageTime',
								headerName: 'Avg. Time',
								type: 'number',
								headerAlign: 'center',
								align: 'center',
								flex: 1,
								renderCell: ({value}) => {
									if (!value) {
										return '--';
									}
									return getTimeStringFromDate(new Date(value));
								}
							}
						] as GridColDef<CircuitWithRaces>[]
					}
				/>
			</Grid>
		</Grid>
	);
}