import {Paper} from '@mui/material';
import {ResponsiveLine, Serie as LineSerie} from '@nivo/line';
import {SeasonStanding} from '../types/ergast';
import {NivoTooltip, useGetChartColorsByConstructor, useNivoTheme} from '../ui-components/nivo';
import CareerTooltip from './CareerTooltip';

type CareerChartProps = {
	seasons: SeasonStanding[];
}

const getTicks = (points: number) => {
	const ticks = [1];
	for (let i = 0; i < points; i += 100) {
		ticks.push(i);
	}
	
	return [...ticks];
};

export default function CareerChart({seasons}: CareerChartProps) {
	const nivoTheme                   = useNivoTheme();
	const getChartColorsByConstructor = useGetChartColorsByConstructor();
	
	if (!seasons.length) {
		return null;
	}
	
	const constructorId = seasons[seasons.length - 1].DriverStandings?.[0].Constructors?.[0]?.constructorId;
	const colors        = getChartColorsByConstructor(constructorId);
	const max           = Math.max(...seasons.map(s => Number(s.DriverStandings?.[0].position)));
	
	const points: LineSerie = {
		id: 'Points',
		data: []
	};
	
	const wins: LineSerie = {
		id: 'Wins',
		data: []
	};
	
	const results: LineSerie = {
		id: 'Results',
		data: []
	};
	
	let maxPoints = 0;
	let maxWins   = 0;
	seasons.forEach(s => {
		const standing = s.DriverStandings?.[0];
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
		y: maxPoints - ((Number(d.y) - 1) / Math.max(20, max) * maxPoints)
	}));
	
	wins.data = wins.data.map(d => ({
		...d,
		y: ((Number(d.y) / maxWins) * maxPoints)
	}));
	
	
	return (
		<Paper variant="outlined" sx={{height: 132, p: 1}} aria-hidden>
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
				margin={{top: 8, left: 8, right: 8, bottom: 36}}
				useMesh={true}
				crosshairType="x"
				tooltip={NivoTooltip(CareerTooltip)}
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
		</Paper>
	);
}