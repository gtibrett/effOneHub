import {Link} from '@gtibrett/mui-additions';
import {Alert, Skeleton} from '@mui/material';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import ByLine from '../drivers/ByLine';
import {CircuitDataProps, CircuitHistoryData} from './useCircuitByRef';

export default function History({data, loading}: CircuitDataProps) {
	if (loading) {
		return <Skeleton variant="rectangular" height={400}/>;
	}
	
	if (!data?.circuit.history.length) {
		return <Alert variant="outlined" severity="info">Race Data Not Available</Alert>;
	}
	
	return (
		<DataGrid
			rows={data.circuit.history}
			autoHeight
			density="compact"
			getRowId={r => r.year}
			initialState={{
				sorting: {
					sortModel: [{field: 'year', sort: 'desc'}]
				}
			}}
			columns={
				[
					{
						field:       'year',
						headerName:  'P',
						width:       60,
						headerAlign: 'center',
						align:       'center'
					},
					{
						field:       'date',
						headerName:  'Date',
						headerAlign: 'center',
						type:        'date',
						align:       'center',
						valueGetter: ({value}) => (new Date(value)),
						renderCell:  ({value}) => value.toLocaleDateString(),
						minWidth:    100
					},
					{
						field:      'name',
						headerName: 'Race',
						flex:       1,
						renderCell: ({row, value}) => (
							<Link to={`/season/${row.year}/${row.round}#${row.name}`}>{row.year} {value}</Link>
						),
						minWidth:   200
					},
					{
						field:      'winner',
						headerName: 'Winner',
						flex:       1,
						renderCell: ({row}) => {
							if (!row.results.length) {
								return '--';
							}
							
							return <ByLine id={row.results[0]?.driverId}/>;
						},
						minWidth:   200
					},
					{
						field:       'time',
						headerName:  'Time',
						sortable:    false,
						headerAlign: 'left',
						align:       'left',
						flex:        .5,
						renderCell:  ({row}) => row.results[0]?.time || '--',
						minWidth:    110
					}
				] as GridColDef<CircuitHistoryData>[]
			}
		/>
	);
}