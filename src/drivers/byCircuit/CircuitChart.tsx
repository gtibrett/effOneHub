import {Box} from '@mui/material';
import {blueGrey} from '@mui/material/colors';
import {ResponsiveLine, Serie as LineSerie} from '@nivo/line';
import {getColorByConstructorId} from '../../constructors';
import {Race} from '../../types/ergast';
import {useNivoTheme} from '../../ui-components/nivo';

type CircuitChartProps = {
	races: Race[];
}

export default function CircuitChart({races}: CircuitChartProps) {
	const nivoTheme = useNivoTheme();
	
	if (!races?.[0]?.Results?.[0]) {
		return null;
	}
	
	const constructorId = races?.[races.length - 1].Results?.[0].Constructor?.constructorId;
	const color         = getColorByConstructorId(constructorId);
	
	const qualifying: LineSerie = {
		id: 'Qualifying',
		color: blueGrey[400],
		data: []
	};
	
	const results: LineSerie = {
		id: 'Results',
		color: color,
		data: []
	};
	
	let max = 20;
	races.forEach(r => {
		const result = r.Results?.[0];
		const quali  = Number(result?.grid);
		const finish = Number(result?.position);
		max          = Math.max(max, quali, finish);
		
		qualifying.data.push({
			x: Number(r.season),
			y: quali
		});
		results.data.push({
			x: Number(r.season),
			y: finish
		});
	});
	
	return (
		<Box sx={{height: 200, width: '100%', mb: 1}} aria-hidden>
			<ResponsiveLine
				theme={nivoTheme}
				data={[qualifying, results]}
				colors={({color}) => color || 'transparent'}
				yScale={{
					type: 'linear',
					min: max,
					max: 1
				}}
				axisLeft={null}
				axisRight={{
					tickSize: 0,
					tickPadding: 10,
					tickRotation: 0,
					tickValues: [1, max]
				}}
				axisTop={null}
				axisBottom={null}
				enableGridX={false}
				gridYValues={[1, 5, 10, 15, 20]}
				margin={{top: 5, left: 5, right: 25, bottom: 36}}
				legends={[
					{
						anchor: 'bottom-left',
						direction: 'row',
						justify: false,
						translateX: 0,
						translateY: 24,
						itemsSpacing: 0,
						itemDirection: 'left-to-right',
						itemWidth: 80,
						itemHeight: 20,
						itemOpacity: 0.75,
						symbolSize: 10,
						symbolShape: 'circle'
					}
				]}
			/>
		</Box>
	);
}