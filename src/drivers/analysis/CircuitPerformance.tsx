import {Paper} from '@mui/material';
import {ResponsiveRadar} from '@nivo/radar';
import {getColorByConstructorId} from '../../constructors';
import {Circuit} from '../../types/ergast';
import {useNivoTheme} from '../../ui-components/nivo';
import useComponentDimensionsWithRef from '../../ui-components/useComponentDimensions';
import {DriverId} from '../DriverProvider';
import {useCareerResults} from '../hooks';

type Stats = {
	wins: number;
	podiums: number;
	inPoints: number;
	appearances: number;
	dnfs: number;
}

const usePerformanceData = (driverId: DriverId, circuitId: Circuit['circuitId']): Stats | undefined => {
	const careerResults = useCareerResults(driverId);
	
	if (!driverId || !careerResults) {
		return undefined;
	}
	
	const circuitResults = careerResults.filter(r => r.Circuit?.circuitId === circuitId);
	
	return {
		wins: circuitResults.filter(r => Number(r.Results?.[0].position) === 1).length,
		podiums: circuitResults.filter(r => Number(r.Results?.[0].position) <= 3).length,
		inPoints: circuitResults.filter(r => Number(r.Results?.[0].position) <= 10).length,
		dnfs: circuitResults.filter(r => r.Results?.[0].positionText !== r.Results?.[0].position).length,
		appearances: circuitResults.length
	};
};

type CircuitPerformanceProps = {
	driverId: DriverId
	circuitId: Circuit['circuitId']
}

export default function CircuitPerformance({driverId, circuitId}: CircuitPerformanceProps) {
	const nivoTheme                  = useNivoTheme();
	const {ref, dimensions: {width}} = useComponentDimensionsWithRef();
	const careerResults              = useCareerResults(driverId);
	const data                       = usePerformanceData(driverId, circuitId);
	
	if (!data || !careerResults?.length) {
		return null;
	}
	
	const chartData = [
		{
			'stat': 'Wins',
			'value': data.wins
		},
		{
			'stat': 'Podiums',
			'value': data.podiums
		},
		{
			'stat': 'In Points',
			'value': data.inPoints
		},
		{
			'stat': 'DNFs',
			value: data.dnfs
		}
	];
	
	const color = getColorByConstructorId(careerResults[careerResults.length - 1].Results?.[0]?.Constructor?.constructorId);
	
	return (
		<Paper variant="outlined" ref={ref} sx={{height: width, p: 1}}>
			<ResponsiveRadar
				theme={nivoTheme}
				data={chartData}
				keys={['value']}
				maxValue={data.appearances}
				indexBy="stat"
				valueFormat=">-,.2"
				margin={{top: 10, right: 50, bottom: 10, left: 50}}
				borderColor={{from: 'color'}}
				borderWidth={1}
				dotSize={6}
				dotColor={{from: 'color'}}
				gridLevels={3}
				gridLabelOffset={8}
				colors={[color]}
				blendMode="normal"
				fillOpacity={.5}
				animate={false}
			/>
		</Paper>
	);
}