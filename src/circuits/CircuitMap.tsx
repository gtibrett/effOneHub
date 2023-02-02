import {alpha, Box, useTheme} from '@mui/material';
import {ResponsiveGeoMap} from '@nivo/geo';
import {useMemo} from 'react';
import {feature} from 'topojson-client';
import {Circuit, Location} from '../types/ergast';
import {useNivoTheme} from '../ui-components/nivo';

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

type CircuitMapProps = {
	height?: number | 'auto';
	width?: number | 'auto';
	centerOn?: Location;
	zoom?: boolean;
	circuits?: Circuit[];
}

export default function CircuitMap({circuits, height = 300, width = 'auto', centerOn = {long: '0', lat: '0'}, zoom = false}: CircuitMapProps) {
	const nivoTheme = useNivoTheme();
	const theme     = useTheme();
	const land      = useLand();
	
	if (!circuits) {
		return null;
	}
	
	const points = circuits.map((circuit) => ({
		'type': 'Feature',
		'properties': {
			'name': circuit.circuitName
		},
		'geometry': {
			'type': 'Point',
			'coordinates': [
				circuit.Location?.long,
				circuit.Location?.lat
			]
		},
		'id': circuit.circuitId
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
				fillColor={(feature) => {
					if (feature?.geometry?.type === 'Point') {
						return theme.palette.secondary.main;
					}
					else {
						return alpha(theme.palette.primary.light, .25);
					}
					
				}}
			/>
		</Box>
	);
};