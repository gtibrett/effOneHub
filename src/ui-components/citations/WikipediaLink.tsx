import {faWikipediaW} from '@fortawesome/free-brands-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {LinkProps, Typography} from '@mui/material';
import {visuallyHidden} from '@mui/utils';
import Link from '../Link';


export default function WikipediaLink({href}: Pick<LinkProps, 'href'>) {
	
	return (
		<Link href={href} target="_blank" to="">
			<Typography variant="caption"><FontAwesomeIcon icon={faWikipediaW}/> more on wikipedia</Typography>
			<Typography sx={visuallyHidden}> (opens in a new window)</Typography>
		</Link>
	)
}