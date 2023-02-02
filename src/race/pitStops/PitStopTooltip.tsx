import {Grid, List, ListItem, ListItemAvatar, ListItemText} from '@mui/material';
import {BarTooltipProps} from '@nivo/bar';
import ByLine from '../../drivers/ByLine';
import DriverAvatar from '../../drivers/DriverAvatar';
import {getTimeStringFromDate} from '../lapTimes/helpers';
import {PitStopSerie} from './PitStopsChart';

export default function PitStopTooltip(props: BarTooltipProps<PitStopSerie>) {
	const {indexValue, value, id} = props;
	const driverId                = String(indexValue);
	
	return (
		<List dense>
			<ListItem>
				<ListItemAvatar><DriverAvatar id={driverId} size={42}/></ListItemAvatar>
				<ListItemText secondaryTypographyProps={{component: 'div'}} primary={<ByLine id={driverId} variant="name"/>} secondary={
					<Grid container spacing={2} alignItems="center">
						<Grid item xs>Stop {id}</Grid>
						<Grid item>{getTimeStringFromDate(new Date(value))}</Grid>
					</Grid>
				}/>
			</ListItem>
		</List>
	);
}