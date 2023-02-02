import {Backdrop, Card, CardContent, CardHeader, CardMedia, Grid, Hidden, Typography, useTheme} from '@mui/material';

import Box from '@mui/material/Box';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router';
import Caxios from '../api/Caxios';
import {getCircuitDescription} from '../api/effone';
import {getAPIUrl, mapRace} from '../api/Ergast';
import Laps from '../race/Laps';
import PitStops from '../race/pitStops/PitStops';
import Podium from '../race/Podium';
import Qualifying from '../race/Qualifying';
import Results from '../race/Results';
import RaceMap from '../schedule/RaceMap';
import {Race as RaceT, Responses} from '../types/ergast';
import OpenAILink from '../ui-components/citations/OpenAILink';
import Link from '../ui-components/Link';
import Navigation from '../ui-components/Navigation';
import Tabs from '../ui-components/Tabs';

export default function Race() {
	const theme           = useTheme();
	const {season, round} = useParams();
	const [race, setRace] = useState<RaceT | undefined>(undefined);
	
	useEffect(() => {
		if (season && round) {
			Caxios.get<Responses['ResultsByYearResponse']>(getAPIUrl(`/${season}/${round}/results.json`), {params: {limit: 2000}})
			      .then(mapRace)
			      .then(data => {
				      setRace(data);
			      });
		}
	}, [season, round]);
	
	if (!season || !round) {
		throw new Error('Page Not found');
	}
	
	if (!race) {
		return <Backdrop open/>;
	}
	
	const circuitDescription = getCircuitDescription(race.Circuit?.circuitId) || '';
	
	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Navigation>
					<Link to="/">{season} Season</Link>
					<Typography>Round {round}</Typography>
				</Navigation>
			</Grid>
			
			<Grid item xs={12}>
				<Card elevation={0}>
					<CardHeader title={race.raceName} subheader={<>
						<Typography>Round {race.round}, {(new Date(race.date || '')).toLocaleDateString()}</Typography>
					</>}
					            action={<Hidden mdDown><Podium results={race.Results}/></Hidden>}
					/>
					
					<CardContent>
						<Grid container spacing={2}>
							<Hidden mdUp>
								<Grid item xs={12} order={2}><Podium results={race.Results}/></Grid>
							</Hidden>
							
							<Grid item xs={12} md={8} lg={9} order={{xs: 3, md: 1}}>
								<Tabs active="race" tabs={[
									{
										id: 'race', label: 'Race',
										content: <Results results={race.Results}/>
									},
									{
										id: 'quali', label: 'Qualifying',
										content: <Qualifying season={season} round={round}/>
									},
									{
										id: 'laps', label: 'Laps',
										content: <Laps season={season} round={round} results={race.Results}/>
									},
									{
										id: 'pit-stops', label: 'Pit Stops',
										content: race.Results ? <PitStops season={season} round={round} results={race.Results}/> : ''
									}
								
								]}/>
							</Grid>
							
							<Grid item xs={12} md={4} lg={3} order={{xs: 1, md: 3}}>
								<Card variant="outlined">
									<CardMedia sx={{borderBottom: `1px solid ${theme.palette.divider}`}}>
										<RaceMap season={season} races={[race]} height={200} centerOn={race.Circuit?.Location} zoom/>
									</CardMedia>
									<CardHeader title={<Link to={`/circuit/${race.Circuit?.circuitId}`}>{race.Circuit?.circuitName}</Link>} subheader={<Typography>{race.Circuit?.Location?.locality}, {race.Circuit?.Location?.country}</Typography>}/>
									{circuitDescription && (
										<CardContent>
											<Typography variant="body2">{circuitDescription}</Typography>
											<Box textAlign="right" display="block"><OpenAILink/></Box>
										</CardContent>
									)}
								</Card>
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
}