import {alpha, FormControl, MenuItem, Select, useTheme} from '@mui/material';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router';
import {getAPIUrl} from '../api/Ergast';
import {useAppState} from '../app/AppStateProvider';
import {Responses} from '../types/ergast';

const useSelectSx = () => {
	const theme = useTheme();
	
	return {
		m: 0,
		minWidth: 120,
		borderRadius: 1,
		border: `1px solid ${theme.palette.text.primary}`,
		'&:hover': {
			backgroundColor: alpha(theme.palette.divider, 0.05)
		},
		
		// arrow icon
		'& > .MuiInputBase-root > .MuiSvgIcon-root': {
			// color: theme.palette.common.white
		},
		
		'& > .MuiInputBase-root > .MuiOutlinedInput-notchedOutline': {
			border: 0
		}
	};
};

export default function SeasonMenu() {
	const {pathname}            = useLocation();
	const navigate              = useNavigate();
	const sx                    = useSelectSx();
	const [{season}, setState]  = useAppState();
	const [seasons, setSeasons] = useState<number[]>([]);
	
	const setSeason = (value: number) => {
		if (pathname.includes(`/${season}`)) {
			navigate(pathname.replace(`/${season}`, `/${value}`));
		}
		
		setState({
			season: value
		});
	};
	
	useEffect(() => {
		if (!seasons.length) {
			axios.get<Responses['SeasonsResponse']>(getAPIUrl('/seasons.json'), {params: {limit: 100}})
			     .then(response => response.data.MRData?.SeasonTable?.Seasons || [{season: (new Date()).getFullYear()}])
			     .then((seasons) => {
				     seasons.sort();
				     seasons.reverse();
				     return seasons;
			     })
			     .then((seasons) => setSeasons(seasons.map(s => Number(s.season))));
		}
	}, [seasons, setSeasons]);
	
	if (!seasons.length) {
		return null;
	}
	
	return (
		<FormControl fullWidth sx={sx} size="small">
			<Select
				inputProps={{'aria-label': 'Season'}}
				sx={{color: 'inherit', p: 0, border: 0}}
				id="season-select"
				value={season}
				label="Season"
				onChange={(ev) => setSeason(ev.target.value as number)}
			>
				{seasons.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
			</Select>
		</FormControl>
	);
}