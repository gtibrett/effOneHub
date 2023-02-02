import {Alert, Grid, Skeleton} from '@mui/material';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import ByLine from '../constructors/ByLine';
import {SeasonStanding} from '../types/ergast';
import CareerPerformance from './analysis/CareerPerformance';
import CareerChart from './CareerChart';
import {DriverId} from './DriverProvider';
import {useCareerStandings} from './hooks';

type CareerProps = {
	driverId: DriverId;
}

export default function Career({driverId}: CareerProps) {
	const careerStandings = useCareerStandings(driverId);
	
	if (!careerStandings) {
		return <Skeleton variant="rectangular" height={400}/>;
	}
	
	if (!careerStandings.length) {
		return <Alert variant="outlined" severity="info">Career Data Not Available</Alert>;
	}
	
	return (
		<Grid container spacing={2}>
			<Grid item xs={8}><CareerChart seasons={careerStandings}/></Grid>
			<Grid item xs={4}><CareerPerformance driverId={driverId}/></Grid>
			<Grid item xs={12}>
				<DataGrid
					rows={careerStandings}
					autoHeight
					density="compact"
					getRowId={(r) => r.season || ''}
					columns={
						[
							{
								field: 'season',
								headerName: 'Season',
								headerAlign: 'center',
								type: 'number',
								align: 'center',
								flex: 1,
								minWidth: 100
							},
							{
								field: 'position',
								headerName: 'Position',
								type: 'number',
								headerAlign: 'center',
								align: 'center',
								valueGetter: ({row}) => {
									return Number(row.DriverStandings?.[0].position);
								},
								flex: 1,
								minWidth: 100
							},
							{
								field: 'points',
								headerName: 'Points',
								type: 'number',
								headerAlign: 'center',
								align: 'center',
								valueGetter: ({row}) => {
									return Number(row.DriverStandings?.[0].points);
								},
								flex: 1,
								minWidth: 100
							},
							{
								field: 'wins',
								headerName: 'Wins',
								type: 'number',
								headerAlign: 'center',
								align: 'center',
								valueGetter: ({row}) => {
									return Number(row.DriverStandings?.[0].wins);
								},
								flex: 1,
								minWidth: 100
							},
							{
								field: 'team',
								headerName: 'Constructor',
								filterable: false,
								renderCell: ({row}) => {
									return <ByLine id={row.DriverStandings?.[0].Constructors?.[0].constructorId} variant="link"/>;
								},
								flex: 1,
								minWidth: 150
							}
						
						] as GridColDef<SeasonStanding>[]
					}
				/>
			</Grid>
		</Grid>
	);
}