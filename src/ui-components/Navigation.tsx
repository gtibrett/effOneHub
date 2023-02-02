import {Breadcrumbs, Grid, Paper} from '@mui/material';
import {PropsWithChildren} from 'react';
import SeasonMenu from '../schedule/SeasonMenu';

export default function Navigation({children}: PropsWithChildren) {
	return (
		<Paper sx={{p: 2}} elevation={0}>
			<Grid container spacing={1} alignItems="center">
				<Grid item xs>
					<Breadcrumbs separator="|">
						{children}
					</Breadcrumbs>
				</Grid>
				<Grid item><SeasonMenu/></Grid>
			</Grid>
		</Paper>
	);
}