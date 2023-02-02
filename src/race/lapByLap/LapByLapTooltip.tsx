import {faSquare} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {List, ListItem, ListItemAvatar, ListItemText} from '@mui/material';
import {BumpSerie} from '@nivo/bump/dist/types/bump/types';
import ByLine from '../../drivers/ByLine';
import DriverAvatar from '../../drivers/DriverAvatar';

export default function LapByLapTooltip({serie}: { serie: BumpSerie<any, any> }) {
	const {color, id: driverId} = serie;
	
	return (
		<List dense>
			<ListItem secondaryAction={<FontAwesomeIcon icon={faSquare} color={color}/>}>
				<ListItemAvatar><DriverAvatar id={driverId} size={42}/></ListItemAvatar>
				<ListItemText primary={<ByLine id={driverId} variant="name"/>}/>
			</ListItem>
		</List>
	);
}