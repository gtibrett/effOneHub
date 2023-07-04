import {faGithub} from '@fortawesome/free-brands-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Card, CardContent, CardHeader, List, ListItem, ListItemIcon, ListItemText} from '@mui/material';
import {OpensInNewWindow} from '../ui-components';
import {Link} from '@gtibrett/mui-additions';

const Repositories = () => (
	<Card sx={{height: '100%'}}>
		<CardHeader title="Repositories"/>
		<CardContent>
			<List>
				<ListItem>
					<ListItemIcon><FontAwesomeIcon icon={faGithub}/></ListItemIcon>
					<ListItemText
						primary={<Link href="https://github.com/gtibrett/effOneHub">effOneHub <OpensInNewWindow/></Link>}
						secondary="This site. Go look under the engine cover."
					/>
				</ListItem>
				<ListItem>
					<ListItemIcon><FontAwesomeIcon icon={faGithub}/></ListItemIcon>
					<ListItemText
						primary={<Link href="https://github.com/gtibrett/effone-hub-api">effone-hub-api <OpensInNewWindow/></Link>}
						secondary="A nodejs implementation of the Ergast API. Still a work in progress."
					/>
				</ListItem>
				<ListItem>
					<ListItemIcon><FontAwesomeIcon icon={faGithub}/></ListItemIcon>
					<ListItemText
						primary={<Link href="https://github.com/gtibrett/mui-additions">mui-additions <OpensInNewWindow/></Link>}
						secondary="Some reusable additions to MUI, including some useful Jest-based testing functionality."
					/>
				</ListItem>
			</List>
		</CardContent>
	</Card>
);

export default Repositories;