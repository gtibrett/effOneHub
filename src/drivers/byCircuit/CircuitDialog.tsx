import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Box, Dialog, DialogContent, DialogTitle, Grid, IconButton, Tooltip, Typography, useTheme} from '@mui/material';
import CircuitMap from '../../circuits/CircuitMap';
import {Driver} from '../../types/ergast';
import Tabs from '../../ui-components/Tabs';
import CircuitPerformance from '../analysis/CircuitPerformance';
import LapTimesByYearSwarm from '../analysis/LapTimesByYearSwarm';
import CircuitChart from './CircuitChart';
import {CircuitWithRaces} from './Circuits';
import CircuitTable from './CircuitTable';

type CircuitProps = {
	driver: Driver;
	circuit: CircuitWithRaces | undefined;
	onClose: () => void
};
export default function CircuitDialog({driver, circuit, onClose}: CircuitProps) {
	const theme = useTheme();
	if (!circuit) {
		return null;
	}
	
	return (
		<Dialog open={true} onClose={onClose} maxWidth="lg" fullWidth>
			<DialogTitle>
				<Grid container spacing={2}>
					<Grid item xs>
						{circuit.circuitName}
						<Typography paragraph variant="subtitle1">{driver.givenName} {driver.familyName}</Typography>
					</Grid>
					<Grid item>
						<Tooltip title="Close" arrow placement="left">
							<IconButton color="secondary" onClick={onClose}><FontAwesomeIcon fixedWidth icon={faTimes}/></IconButton>
						</Tooltip>
					</Grid>
				</Grid>
			</DialogTitle>
			<DialogContent dividers sx={{height: '90vh'}}>
				<Grid container spacing={2}>
					<Grid item xs={9}>
						<Tabs active="results" tabs={[
							{
								id: 'results',
								label: 'Results',
								content: (
									<>
										<CircuitChart races={circuit.races}/>
										<CircuitTable races={circuit.races}/>
									</>
								)
							},
							{
								id: 'laptimes',
								label: 'Lap Times',
								content: <LapTimesByYearSwarm driverId={driver.driverId} circuitId={circuit.circuitId}/>
							}
						]}/>
					</Grid>
					<Grid item xs={3}>
						<Box sx={{border: `1px solid ${theme.palette.divider}`, borderRadius: theme.shape.borderRadius / 2, overflow: 'hidden', mb: 2}}>
							<CircuitMap circuits={[circuit]} height={200} centerOn={circuit.Location} zoom/>
						</Box>
						<CircuitPerformance driverId={driver.driverId} circuitId={circuit.circuitId}/>
					</Grid>
				</Grid>
			</DialogContent>
		</Dialog>
	);
	
}