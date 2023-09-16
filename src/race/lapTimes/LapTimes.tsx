import {Box, Skeleton, useTheme} from '@mui/material';
import {ResponsiveHeatMap} from '@nivo/heatmap';
import {HeatMapSerie} from '@nivo/heatmap/dist/types/types';
import {useMemo} from 'react';
import ByLine from '../../drivers/ByLine';
import {NivoTooltip, useNivoTheme} from '../../ui-components';
import {useLapByLapData} from '../lapByLap/useLapByLapChartData';
import {getTicks} from './helpers';
import LapTooltip from './LapTooltip';
import useLapTimeChartData, {LapChartDatum} from './useLapTimeChartData';

export type LapTimesProps = {
	season: number;
	round: number;
}

type ChartProps = {
	lapCount: number;
	data: HeatMapSerie<LapChartDatum, any>[];
}

const Chart = ({data, lapCount}: ChartProps) => {
	const nivoTheme = useNivoTheme();
	const theme     = useTheme();
	
	return useMemo(() => (
		<ResponsiveHeatMap
			theme={nivoTheme}
			animate={false}
			data={data}
			forceSquare={true}
			// colors={({data: {color}}) => color}
			enableLabels={false}
			borderWidth={2}
			borderColor={theme.palette.background.paper}
			margin={{top: 0, right: 0, bottom: 60, left: 40}}
			axisTop={null}
			axisRight={null}
			axisBottom={{
				tickSize:       5,
				tickPadding:    5,
				tickRotation:   0,
				legend:         'Lap',
				legendPosition: 'middle',
				legendOffset:   46,
				tickValues:     getTicks(lapCount)
			}}
			axisLeft={{
				tickSize:     0,
				tickPadding:  5,
				tickRotation: 0,
				format:       (v => {
					return <ByLine variant="code" id={v}/>;
				})
			}}
			tooltip={NivoTooltip(LapTooltip)}
			hoverTarget="cell"
			layers={['cells', 'axes']}
		/>
	), [data, theme, nivoTheme, lapCount]);
};

function LapTimes({season, round}: LapTimesProps) {
	const lapByLapData = useLapByLapData(season, round);
	const {totalLaps}  = lapByLapData;
	const data         = useLapTimeChartData(lapByLapData);
	
	let content = <Skeleton variant="rectangular" width="100%" height="100%"/>;
	if (data.length && totalLaps) {
		content = <Chart lapCount={totalLaps} data={data}/>;
	}
	
	return (
		<Box sx={{height: '50vh', width: '100%'}}>
			{content}
		</Box>
	);
}

export default LapTimes;