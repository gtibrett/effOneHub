import {Box} from '@mui/material';
import {ResponsiveLine, Serie as LineSerie} from '@nivo/line';
import {SeasonStanding} from '../types/ergast';
import {NivoTooltip, useGetChartColorsByConstructor, useNivoTheme} from '../ui-components/nivo';
import HistoryTooltip from './HistoryTooltip';

type HistoryChartProps = {
	seasons: SeasonStanding[];
}

const getTicks = (points: number) => {
	const ticks = [1];
	for (let i = 0; i < points; i += 100) {
		ticks.push(i);
	}
	
	return [...ticks];
};

export default function HistoryChart({seasons}: HistoryChartProps) {
	const nivoTheme                   = useNivoTheme();
	const getChartColorsByConstructor = useGetChartColorsByConstructor();
	
	if (!seasons.length) {
		return null;
	}
	
	const constructorId = seasons[0].ConstructorStandings?.[0]?.Constructors?.[0].constructorId;
	
	const colors = getChartColorsByConstructor(constructorId);
	
	const points: LineSerie = {
		id: 'points',
		data: []
	};
	
	const wins: LineSerie = {
		id: 'wins',
		data: []
	};
	
	const results: LineSerie = {
		id: 'results',
		data: []
	};
	
	let maxPoints = 0;
	let maxWins   = 0;
	seasons.forEach(s => {
		const standing = s.ConstructorStandings?.[0];
		if (standing) {
			const data = {
				points: Number(standing.points),
				position: Number(standing.position),
				wins: Number(standing.wins)
			};
			
			if (data.points > maxPoints) {
				maxPoints = data.points;
			}
			
			if (data.wins > maxWins) {
				maxWins = data.wins;
			}
			
			points.data.push({
				x: Number(s.season),
				y: Number(data.points),
				data
			});
			results.data.push({
				x: Number(s.season),
				y: Number(standing.position),
				data
			});
			wins.data.push({
				x: Number(s.season),
				y: Number(standing.wins),
				data
			});
		}
	});
	
	results.data = results.data.map(d => ({
		...d,
		y: maxPoints - ((Number(d.y) - 1) / 20 * maxPoints)
	}));
	
	wins.data = wins.data.map(d => ({
		...d,
		y: ((Number(d.y) / maxWins) * maxPoints)
	}));
	
	
	return (
		<Box sx={{height: 132, width: '100%'}} aria-hidden>
			<ResponsiveLine
				theme={nivoTheme}
				data={[results, wins, points]}
				colors={colors}
				yScale={{
					type: 'linear',
					min: 0,
					max: maxPoints
				}}
				axisLeft={null}
				axisRight={null}
				axisTop={null}
				axisBottom={null}
				enableGridX={false}
				gridYValues={getTicks(maxPoints)}
				margin={{top: 25, left: 8, right: 8, bottom: 32}}
				useMesh={true}
				crosshairType="x"
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
				tooltip={NivoTooltip(HistoryTooltip)}
			/>
		</Box>
	);
}