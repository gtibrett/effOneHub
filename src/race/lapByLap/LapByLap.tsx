import {Box, Skeleton} from '@mui/material';
import {ResponsiveBump} from '@nivo/bump';
import ByLine from '../../drivers/ByLine';
import {Lap, Race} from '../../types/ergast';
import {NivoTooltip, useNivoTheme} from '../../ui-components/nivo';
import LapByLapTooltip from './LapByLapTooltip';
import useLapByLapChartData from './useLapByLapChartData';

export type LapByLapProps = {
	laps: Lap[];
	results: Race['Results']
}

type LapChartDatum = {
	x: number,
	y: number | null
}

export type LapChartSeries = {
	id: string;
	color?: string;
	data: LapChartDatum[]
}

const getTicks = (laps: number) => {
	const ticks = [1];
	for (let i = 1; i < laps; i++) {
		if (i % 10 === 0) {
			ticks.push(i);
		}
	}
	
	return [...ticks, laps];
};

function LapByLap({laps, results}: LapByLapProps) {
	const nivoTheme = useNivoTheme();
	const data      = useLapByLapChartData(laps, results);
	
	let content = <Skeleton variant="rectangular" sx={{width: '100%'}} height="100%"/>;
	if (laps.length) {
		content = (
			<ResponsiveBump
				theme={nivoTheme}
				data={data}
				colors={({color}) => color || 'transparent'}
				lineWidth={3}
				activeLineWidth={6}
				inactiveLineWidth={3}
				inactiveOpacity={0.35}
				pointSize={0}
				activePointSize={0}
				inactivePointSize={0}
				pointBorderWidth={0}
				activePointBorderWidth={0}
				// @ts-ignore
				startLabel={({id}) => <ByLine variant="code" id={id}/>}
				endLabel={false}
				enableGridX={false}
				enableGridY={false}
				axisTop={null}
				axisLeft={null}
				axisBottom={{
					tickSize: 0,
					tickPadding: 5,
					tickRotation: 0,
					tickValues: getTicks(Number(results?.[0].laps))
				}}
				axisRight={{
					tickSize: 0,
					tickPadding: 10,
					tickRotation: 0
				}}
				margin={{top: 0, right: 24, bottom: 24, left: 40}}
				tooltip={NivoTooltip(LapByLapTooltip)}
			/>
		);
	}
	
	return (
		<Box sx={{height: '60vh', width: '100%'}} aria-hidden>
			{content}
		</Box>
	);
}

export default LapByLap;