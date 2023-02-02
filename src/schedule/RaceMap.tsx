import {alpha, Box, Typography, useTheme} from '@mui/material';
import {GeoMapTooltip, ResponsiveGeoMap} from '@nivo/geo';
import {useMemo} from 'react';
import {useNavigate} from 'react-router';
import {feature} from 'topojson-client';
import {Location, Race} from '../types/ergast';
import {NivoTooltip, useNivoTheme} from '../ui-components/nivo';
import {useInvertedTheme} from '../ui-components/Theme';

const useLand = () => {
	const land = require('world-atlas/land-110m.json');
	
	return useMemo(() => {
		const geoJSON     = feature(land, land.objects.land);
		// @ts-ignore
		const landFeature = geoJSON.features[0];
		landFeature.id    = 'land';
		
		return landFeature;
	}, [land]);
};


const Tooltip: GeoMapTooltip = ({feature}) => {
	const theme = useInvertedTheme();
	
	if (feature?.geometry?.type !== 'Point') {
		return null;
	}
	
	const sx = {
		p: 1,
		borderRadius: 1,
		background: alpha(theme.palette.background.paper, .75),
		color: theme.palette.getContrastText(theme.palette.background.paper)
	};
	
	const race: Race = feature.race;
	
	return (
		<Box sx={sx}>
			<Typography>{race.raceName}</Typography>
			<Typography>{race.Circuit?.circuitName}</Typography>
		</Box>
	);
};

type RaceMapProps = {
	season: string | number;
	races: Race[];
	height?: number | 'auto';
	width?: number | 'auto';
	centerOn?: Location;
	zoom?: boolean;
}

export default function RaceMap({season, races, height = 300, width = 'auto', centerOn = {long: '0', lat: '0'}, zoom = false}: RaceMapProps) {
	const nivoTheme = useNivoTheme();
	const theme     = useTheme();
	const navigate  = useNavigate();
	const land      = useLand();
	
	const points = races.map((race) => ({
		'type': 'Feature',
		'properties': {
			'name': race.Circuit?.circuitName
		},
		'geometry': {
			'type': 'Point',
			'coordinates': [
				race.Circuit?.Location?.long,
				race.Circuit?.Location?.lat
			]
		},
		race,
		'id': race.round
	}));
	
	return (
		<Box sx={{height, width}} aria-hidden>
			<ResponsiveGeoMap
				theme={nivoTheme}
				features={[land, ...points]}
				margin={{top: 0, right: 0, bottom: 0, left: 0}}
				projectionType="equirectangular"
				projectionTranslation={[0.5, Number(centerOn?.lat) / 90 * .5 + .5]}
				projectionRotation={[Number(centerOn?.long) * -1, 0, 0]}
				projectionScale={zoom ? 100 : 100}
				borderWidth={0.5}
				borderColor={theme.palette.primary.main}
				tooltip={NivoTooltip(Tooltip)}
				fillColor={(feature) => {
					if (feature?.geometry?.type === 'Point') {
						return theme.palette.secondary.main;
					}
					else {
						return alpha(theme.palette.primary.light, .25);
					}
					
				}}
				onClick={(feature) => {
					if (feature?.geometry?.type === 'Point') {
						return navigate(`/race/${season}/${feature.race.round}`);
					}
				}}
			/>
		</Box>
	);
};