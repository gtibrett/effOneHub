import {Card, CardContent, CardHeader, CardMedia, Divider, Grid, Typography} from '@mui/material';
import Box from '@mui/material/Box';
import {useRef} from 'react';
import {useParams} from 'react-router';
import {useAppState} from '../app/AppStateProvider';
import {getColorByConstructorId} from '../constructors';
import {ConstructorWithBio, useConstructor} from '../constructors/ConstructorProvider';
import History from '../constructors/History';
import Season from '../constructors/Season';
import Flag from '../flags/Flag';
import WikipediaLink from '../ui-components/citations/WikipediaLink';
import Link from '../ui-components/Link';
import Navigation from '../ui-components/Navigation';
import Tabs from '../ui-components/Tabs';

const ConstructorDetails = ({constructor}: { constructor: ConstructorWithBio }) => {
	return (
		<Grid container spacing={4} sx={{fontSize: '1.5em', fontWeight: 'bold'}} alignItems="center">
			<Grid item><Typography variant="h2">{constructor.name}</Typography></Grid>
			<Grid item><Flag nationality={constructor.nationality} size={48}/></Grid>
		</Grid>
	);
};


export default function Constructor() {
	const [{season}]     = useAppState();
	const ref            = useRef(null);
	const {id}           = useParams();
	const constructor    = useConstructor(id);
	const constructorBio = constructor?.bio;
	
	if (!constructor || !constructorBio) {
		return null;
	}
	
	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Navigation>
					<Link to="/">{season} Season</Link>
					<Typography>{constructor.name}</Typography>
				</Navigation>
			</Grid>
			
			<Grid item xs={12}>
				<Card elevation={0}>
					<CardHeader
						// constructor is a keyword, so using it as a prop is problematic
						// @ts-ignore
						title={<ConstructorDetails constructor={constructor}/>}
					/>
					
					<CardContent>
						<Grid container spacing={2}>
							<Grid item xs={12} md={8} lg={9} order={{xs: 2, md: 1}}>
								<Card variant="outlined">
									<Tabs active="season" tabs={[
										{
											id: 'season', label: 'Season',
											content: <Season constructorId={constructor.constructorId}/>
										},
										{
											id: 'history', label: 'History',
											content: <History constructorId={constructor.constructorId}/>
										}
									]}/>
								</Card>
							</Grid>
							
							<Grid item xs={12} md={4} lg={3} order={{xs: 1, md: 2}}>
								<Card variant="outlined">
									<CardMedia ref={ref}>
										<Box sx={{height: {xs: 24, md: 48}, background: getColorByConstructorId(constructor.constructorId)}}/>
									</CardMedia>
									<CardContent>
										<Typography variant="body1">{constructorBio.extract}</Typography>
										<Divider orientation="horizontal" sx={{my: 1}}/>
										<WikipediaLink href={constructor.url}/>
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