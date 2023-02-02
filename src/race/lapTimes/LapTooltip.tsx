import {faSquare} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Grid, List, ListItem, ListItemAvatar, ListItemText} from '@mui/material';
import {TooltipProps} from '@nivo/heatmap';
import ByLine from '../../drivers/ByLine';
import DriverAvatar from '../../drivers/DriverAvatar';
import {LapChartDatum} from './useLapTimeChartData';

export default function LapTooltip({cell}: TooltipProps<LapChartDatum>) {
	const {color, data}    = cell;
	const {driverId, time} = data.timing;
	
	return (
		<List dense>
			<ListItem>
				<ListItemAvatar><DriverAvatar id={driverId} size={42}/></ListItemAvatar>
				<ListItemText secondaryTypographyProps={{component: 'div'}} primary={<ByLine id={driverId} variant="name"/>} secondary={
					<Grid container spacing={2} alignItems="center">
						<Grid item><FontAwesomeIcon icon={faSquare} color={color}/></Grid>
						<Grid item xs>Lap {data.x}</Grid>
						<Grid item>{time}</Grid>
					</Grid>
				}/>
			</ListItem>
		</List>
	);
}