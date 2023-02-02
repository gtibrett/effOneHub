import {faRobot} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Typography} from '@mui/material';
import {visuallyHidden} from '@mui/utils';
import Link from '../Link';

export default function OpenAILink() {
	
	return (
		<Link href="https://openai.com" target="_blank" to="">
			<Typography variant="caption"><FontAwesomeIcon icon={faRobot}/> written by OpenAI</Typography>
			<Typography sx={visuallyHidden}> (opens in a new window)</Typography>
		</Link>
	);
}