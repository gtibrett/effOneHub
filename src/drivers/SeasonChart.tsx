import {Box} from '@mui/material';
import {ResponsiveLine, Serie as LineSerie} from '@nivo/line';
import {Race} from '../types/ergast';
import {useGetChartColorsByConstructor, useNivoTheme} from '../ui-components/nivo';

type SeasonChartProps = {
	races: Race[];
}

export default function SeasonChart({races}: SeasonChartProps) {
	const nivoTheme                   = useNivoTheme();
	const getChartColorsByConstructor = useGetChartColorsByConstructor();
	
	if (!races?.[0]?.Results?.[0]) {
		return null;
	}
	
	const colors = getChartColorsByConstructor(races?.[0].Results?.[0].Constructor?.constructorId);
	
	const qualifying: LineSerie = {
		id: 'qualifying',
		data: []
	};
	
	const results: LineSerie = {
		id: 'results',
		data: []
	};
	
	races.forEach(r => {
		const result = r.Results?.[0];
		qualifying.data.push({
			x: Number(r.round),
			y: Number(result?.grid)
		});
		results.data.push({
			x: Number(r.round),
			y: Number(result?.position)
		});
	});
	
	return (
		<Box sx={{height: 132, width: '100%'}} aria-hidden>
			<ResponsiveLine
				theme={nivoTheme}
				data={[results, qualifying]}
				colors={colors}
				yScale={{
					type: 'linear',
					min: 20,
					max: 1
				}}
				axisLeft={null}
				axisRight={{
					tickSize: 0,
					tickPadding: 10,
					tickRotation: 0,
					tickValues: [1, 20]
				}}
				axisTop={null}
				axisBottom={null}
				enableGridX={false}
				gridYValues={[1, 5, 10, 15, 20]}
				margin={{top: 5, left: 5, right: 25, bottom: 32}}
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