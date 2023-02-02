import {Backdrop, Box, Card, CardContent, CardHeader, CardMedia, Grid, Typography, useTheme} from '@mui/material';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router';
import Caxios from '../api/Caxios';
import {getCircuitDescription} from '../api/effone';
import {getAPIUrl, mapCircuits} from '../api/Ergast';
import {useAppState} from '../app/AppStateProvider';
import CircuitMap from '../circuits/CircuitMap';
import History from '../circuits/History';
import Season from '../circuits/Season';
import {Circuit as CircuitT, Responses} from '../types/ergast';
import OpenAILink from '../ui-components/citations/OpenAILink';
import Link from '../ui-components/Link';
import Navigation from '../ui-components/Navigation';
import Tabs from '../ui-components/Tabs';

export default function Circuit() {
	const theme                 = useTheme();
	const [{season}]            = useAppState();
	const {circuitId}           = useParams();
	const [circuit, setCircuit] = useState<CircuitT | undefined>(undefined);
	
	useEffect(() => {
		if (circuitId) {
			Caxios.get<Responses['CircuitsResponse']>(getAPIUrl(`/circuits/${circuitId}.json`), {params: {limit: 100}})
			      .then(mapCircuits)
			      .then(data => {
				      setCircuit(data?.[0]);
			      });
		}
	}, [circuitId]);
	
	if (!circuitId) {
		throw new Error('Page Not found');
	}
	
	if (!circuit) {
		return <Backdrop open/>;
	}
	
	const circuitDescription = getCircuitDescription(circuit.circuitId) || '';
	
	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Navigation>
					<Link to="/">{season} Season</Link>
					<Typography>{circuit.circuitName}</Typography>
				</Navigation>
			</Grid>
			
			<Grid item xs={12}>
				<Card elevation={0}>
					<CardHeader title={circuit.circuitName} subheader={<Typography>{circuit.Location?.locality}, {circuit.Location?.country}</Typography>}/>
					
					<CardContent>
						<Grid container spacing={2}>
							<Grid item xs={12} md={8} sx={{order: {xs: 2, md: 1}}}>
								<Tabs active="season" tabs={[
									{
										id: 'season', label: 'Season',
										content: <Season circuitId={circuitId}/>
									},
									{
										id: 'history', label: 'History',
										content: <History circuitId={circuitId}/>
									}
								]}/>
							</Grid>
							
							<Grid item xs={12} md={4} sx={{order: {xs: 1, md: 2}, borderBottom: `1px solid ${theme.palette.divider}`}}>
								<Card variant="outlined">
									<CardMedia sx={{borderBottom: `1px solid ${theme.palette.divider}`}}>
										<CircuitMap circuits={[circuit]} height={200} centerOn={circuit.Location} zoom/>
									</CardMedia>
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