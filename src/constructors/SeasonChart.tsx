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
	if (!races?.[0]?.Results?.[0]?.Driver || !races?.[0]?.Results?.[1]?.Driver) {
		return null;
	}
	
	const constructorId = races?.[0].Results?.[0].Constructor?.constructorId;
	const colors        = getChartColorsByConstructor(constructorId);
	
	const driver1                = races[0].Results[0].Driver;
	const driver2                = races[0].Results[1].Driver;
	const driver1Data: LineSerie = {
		id: driver1.code || '',
		data: []
	};
	
	const driver2Data: LineSerie = {
		id: driver2.code || '',
		data: []
	};
	
	races.forEach(race => {
		const r1 = race.Results?.find(r => r.Driver?.driverId === driver1.driverId);
		const r2 = race.Results?.find(r => r.Driver?.driverId === driver2.driverId);
		driver1Data.data.push({
			x: Number(race.round),
			y: Number(r1?.position)
		});
		driver2Data.data.push({
			x: Number(race.round),
			y: Number(r2?.position)
		});
	});
	
	return (
		<Box sx={{height: 132, width: '100%'}} aria-hidden>
			<ResponsiveLine
				theme={nivoTheme}
				data={[driver1Data, driver2Data]}
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
						anchor: 'bottom',
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