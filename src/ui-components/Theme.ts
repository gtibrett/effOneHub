import type {} from '@mui/x-data-grid/themeAugmentation';
import {alpha, createTheme, useMediaQuery, useTheme} from '@mui/material';
import {blueGrey, deepOrange} from '@mui/material/colors';
import {useMemo} from 'react';

export const useEffTheme = (overrideMode?: 'light' | 'dark') => {
	const prefersDarkMode = (useMediaQuery('(prefers-color-scheme: dark)') && overrideMode !== 'light') || overrideMode === 'dark';
	
	return useMemo(() => createTheme({
		palette: {
			mode: prefersDarkMode ? 'dark' : 'light',
			primary: {
				main: blueGrey[prefersDarkMode ? 400 : 800]
			},
			secondary: {
				main: deepOrange[prefersDarkMode ? 300 : 700]
			},
			background: {
				paper: prefersDarkMode ? blueGrey[900] : '#FFFFFF',
				default: prefersDarkMode ? blueGrey[700] : blueGrey[100]
			}
		},
		components: {
			MuiCard: {
				styleOverrides: {
					root: {
						overflow: 'visible'
					}
				}
			},
			MuiDataGrid: {
				styleOverrides: {
					root: {
						border: 0,
						overflow: 'auto',
						'& > .MuiDataGrid-main': {
							overflow: 'unset'
						},
						'& > div > .MuiDataGrid-footerContainer': {
							display: 'none'
						}
					}
				}
			},
			MuiDialog: {
				styleOverrides: {
					paper: {
						background: prefersDarkMode ? blueGrey[900] : '#FFFFFF'
					}
				}
			},
			MuiBackdrop: {
				styleOverrides: {
					root: {
						background: alpha(blueGrey[prefersDarkMode? 700 : 600], .5),
						backdropFilter: `blur(5px) grayscale(100%)`
					}
				}
			}
		}
	}), [prefersDarkMode]);
};

export const useInvertedTheme = () => {
	const theme = useEffTheme();
	return useEffTheme(theme.palette.mode === 'light' ? 'dark' : 'light');
};

export const usePrefersDarkMode = () => useTheme().palette.mode === 'dark';