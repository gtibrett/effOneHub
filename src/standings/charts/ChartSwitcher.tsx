import {Box, Skeleton} from '@mui/material';
import {FC} from 'react';
import PointsChart from './PointsChart';
import PositionsChart from './PositionsChart';
import {RaceStandingsWithEntities} from './types';
import useChartData from './useChartData';

export type ChartSwitcherProps = {
	data: RaceStandingsWithEntities[];
	loading: boolean;
	mode: 'position' | 'points';
	PointsTooltip: FC<any>;
	PositionsTooltip: FC<any>;
}

export default function ChartSwitcher(props: ChartSwitcherProps) {
	const {mode, data, loading, PositionsTooltip, PointsTooltip} = props;
	const chartData                                              = useChartData(data, mode);
	
	if (loading) {
		return <Skeleton variant="rectangular" height="100%"/>;
	}
	
	if (!data.length) {
		return null;
	}
	
	return (
		<Box height="100%" width="100%" sx={{boxSizing: 'border-box'}} aria-hidden>
			{
				mode === 'position'
				? <PositionsChart data={chartData} TooltipComponent={PositionsTooltip}/>
				: <PointsChart data={chartData} TooltipComponent={PointsTooltip}/>
			}
		</Box>
	);
}