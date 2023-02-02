import {Paper} from '@mui/material';
import {blueGrey, deepPurple, green, red} from '@mui/material/colors';
import {ResponsivePie} from '@nivo/pie';
import {useNivoTheme} from '../../ui-components/nivo';
import {usePrefersDarkMode} from '../../ui-components/Theme';
import {DriverId} from '../DriverProvider';
import {useCareerResults} from '../hooks';

type Stats = {
	wins: number;
	podiums: number;
	inPoints: number;
	dnfs: number;
	appearances: number;
}

const usePerformanceData = (driverId: DriverId): Stats | undefined => {
	const careerResults = useCareerResults(driverId);
	
	if (!driverId || !careerResults) {
		return undefined;
	}
	
	return {
		wins: careerResults.filter(r => Number(r.Results?.[0].position) === 1).length,
		podiums: careerResults.filter(r => Number(r.Results?.[0].position) <= 3).length,
		inPoints: careerResults.filter(r => Number(r.Results?.[0].position) <= 10).length,
		dnfs: careerResults.filter(r => r.Results?.[0].positionText !== r.Results?.[0].position).length,
		appearances: careerResults.length
	};
};

type CareerPerformanceProps = {
	driverId: DriverId;
}

export default function CareerPerformance({driverId}: CareerPerformanceProps) {
	const nivoTheme       = useNivoTheme();
	const data            = usePerformanceData(driverId);
	const prefersDarkMode = usePrefersDarkMode();
	
	if (!data) {
		return null;
	}
	
	const chartData = [
		{
			'id': 'wins',
			'label': `Wins: ${data.wins}`,
			'value': data.wins
		},
		{
			'id': 'podiums',
			'label': `Podiums: ${data.podiums}`,
			'value': data.podiums - data.wins
		},
		{
			'id': 'inPoints',
			'label': `In Points: ${data.inPoints}`,
			'value': data.inPoints - data.podiums
		},
		{
			'id': 'appearances',
			'label': `Appearances: ${data.appearances}`,
			'value': data.appearances - data.inPoints - data.dnfs
		},
		{
			'id': 'dnfs',
			'label': `DNFs: ${data.dnfs}`,
			'value': data.dnfs
		}
	];
	
	return (
		<Paper variant="outlined" sx={{height: 132, p: 1}} aria-hidden>
			<ResponsivePie
				enableArcLinkLabels={false}
				enableArcLabels={false}
				theme={nivoTheme}
				data={chartData}
				colors={[
					deepPurple[prefersDarkMode ? 200 : 600],
					green[prefersDarkMode ? 200 : 600],
					blueGrey[prefersDarkMode ? 200 : 600],
					blueGrey[prefersDarkMode ? 100 : 300],
					red[prefersDarkMode ? 200 : 600]
				]}
				innerRadius={.1}
				padAngle={3}
				cornerRadius={3}
				margin={{top: 0, right: 110, bottom: 0, left: 0}}
				legends={[
					{
						anchor: 'right',
						direction: 'column',
						justify: false,
						translateX: 40,
						translateY: 0,
						itemsSpacing: 0,
						itemWidth: 50,
						itemHeight: 18,
						itemDirection: 'left-to-right',
						symbolSize: 10,
						symbolShape: 'circle'
					}
				]}
			/>
		</Paper>
	);
}