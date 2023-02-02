import {Card, CardContent, CardHeader, CardMedia, Divider, Grid, Hidden, Typography} from '@mui/material';
import {useParams} from 'react-router';
import {useAppState} from '../app/AppStateProvider';
import Circuits from '../drivers/byCircuit/Circuits';
import Career from '../drivers/Career';
import DriverAvatar from '../drivers/DriverAvatar';
import {DriverWithBio, useDriver} from '../drivers/DriverProvider';
import Season from '../drivers/Season';
import Flag from '../flags/Flag';
import WikipediaLink from '../ui-components/citations/WikipediaLink';
import Link from '../ui-components/Link';
import Navigation from '../ui-components/Navigation';
import Tabs from '../ui-components/Tabs';
import useComponentDimensionsWithRef from '../ui-components/useComponentDimensions';

const DriverDetails = ({driver}: { driver: DriverWithBio }) => {
	return (
		<Grid container spacing={2} sx={{fontSize: '1.5em', fontWeight: 'bold'}} alignItems="center">
			<Grid item><Typography variant="h2">{driver.givenName} {driver.familyName}</Typography></Grid>
			<Hidden mdDown>
				<Grid item><Flag nationality={driver.nationality} size={48}/></Grid>
				<Grid item xs/>
				<Grid item>{driver.code}</Grid>
				<Grid item sx={{fontFamily: 'Racing Sans One', fontSize: '1.1em'}}>{driver.permanentNumber}</Grid>
			</Hidden>
		</Grid>
	);
};


export default function Driver() {
	const [{season}]                 = useAppState();
	const {ref, dimensions: {width}} = useComponentDimensionsWithRef();
	const {id}                       = useParams();
	const driver                     = useDriver(id);
	const driverBio                  = driver?.bio;
	
	if (!driver || !driverBio) {
		return null;
	}
	
	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Navigation>
					<Link to="/">{season} Season</Link>
					<Typography>{driver.givenName} {driver.familyName}</Typography>
				</Navigation>
			</Grid>
			
			<Grid item xs={12}>
				<Card elevation={0}>
					<CardHeader
						title={<DriverDetails driver={driver}/>}
					/>
					
					<CardContent>
						<Grid container spacing={2}>
							<Grid item xs={12} md={8} lg={9} order={{xs: 2, md: 1}}>
								<Tabs active="season" tabs={[
									{id: 'season', label: 'Season', content: <Season driverId={id}/>},
									{id: 'career', label: 'Career', content: <Career driverId={id}/>},
									{id: 'circuits', label: 'Circuits', content: <Circuits driverId={id}/>}
								]}/>
							</Grid>
							
							<Grid item xs={12} md={4} lg={3} order={{xs: 1, md: 2}}>
								<Card variant="outlined">
									
									<CardMedia ref={ref}>
										<Hidden mdDown>
											<DriverAvatar id={id} size={width}/>
										</Hidden>
									</CardMedia>
									
									<CardContent>
										<Grid container spacing={2}>
											<Hidden mdUp>
												<Grid item><DriverAvatar id={id} size={128}/></Grid>
											</Hidden>
											
											<Grid item xs>
												<Typography variant="body2">Born: {(new Date(driver.dateOfBirth || '')).toLocaleDateString()}</Typography>
												<Divider orientation="horizontal" sx={{my: 1}}/>
												<Typography variant="body1">{driverBio.extract}</Typography>
												<Divider orientation="horizontal" sx={{my: 1}}/>
												<WikipediaLink href={driver.url}/>
											</Grid>
										</Grid>
									</CardContent>
								</Card>
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
}