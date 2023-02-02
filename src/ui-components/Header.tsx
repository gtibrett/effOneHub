import {faFlagCheckered} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {AppBar, Grid, Hidden, SxProps, Toolbar, Tooltip, Typography, useTheme} from '@mui/material';
import {useLocation} from 'react-router';
import Link from './Link';

export default function Header() {
	const theme      = useTheme();
	const {pathname} = useLocation();
	
	const navLinkSx: SxProps = {
		textDecoration: 'none',
		py: .5,
		px: .5,
		mx: 2,
		borderBottom: '8px solid transparent',
		'&:hover, &:focus': {
			borderBottomColor: theme.palette.secondary.light
		},
		'&.active': {
			borderBottomColor: theme.palette.primary.light
		}
	};
	
	const background = theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.primary.dark;
	
	return (
		<header>
			<AppBar component="nav" color="primary" sx={{background}}>
				<Toolbar>
					<Grid container spacing={2} alignItems="center">
						<Hidden mdUp>
							<Grid item>
								<Link to="/" color="inherit" sx={{textDecoration: 'none'}}>
									<Tooltip title="effOne Hub" placement="right">
										<FontAwesomeIcon icon={faFlagCheckered} size="3x"/>
									</Tooltip>
								</Link>
							</Grid>
						</Hidden>
						<Hidden mdDown>
							<Grid item>
								<Link to="/" color="inherit" sx={{textDecoration: 'none'}}>
									<Typography variant="h3" component="h1" sx={{fontFamily: 'Racing Sans One'}}><FontAwesomeIcon icon={faFlagCheckered} size="1x" style={{marginRight: 4}}/> effOne Hub</Typography>
								</Link>
							</Grid>
						</Hidden>
						<Grid item xs/>
						<Grid item><Link color="inherit" to="/about" sx={navLinkSx} className={pathname === '/about' ? 'active' : ''}>About</Link></Grid>
					</Grid>
				</Toolbar>
			</AppBar>
			<Toolbar/>
		</header>
	);
}