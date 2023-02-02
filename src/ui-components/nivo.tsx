import {alpha, Box, useTheme} from '@mui/material';
import {blueGrey} from '@mui/material/colors';
import {FC} from 'react';
import {getColorByConstructorId} from '../constructors';
import {Constructor} from '../types/ergast';
import {useInvertedTheme, usePrefersDarkMode} from './Theme';

export const useNivoTheme = () => {
	const theme           = useTheme();
	const invertedTheme   = useInvertedTheme();
	const captionFontSize = 11;
	
	return {
		'background': 'transparent',
		'textColor': theme.palette.text.primary,
		'fontSize': captionFontSize,
		'axis': {
			'domain': {
				'line': {
					'stroke': theme.palette.divider,
					'strokeWidth': 1
				}
			},
			'legend': {
				'text': {
					'fontSize': captionFontSize,
					'fill': theme.palette.text.secondary
				}
			},
			'ticks': {
				'line': {
					'stroke': theme.palette.divider,
					'strokeWidth': 1
				},
				'text': {
					'fontSize': captionFontSize,
					'fill': theme.palette.text.secondary
				}
			}
		},
		'grid': {
			'line': {
				'stroke': theme.palette.divider,
				'strokeWidth': 1
			}
		},
		'legends': {
			'title': {
				'text': {
					'fontSize': captionFontSize,
					'fill': theme.palette.text.secondary
				}
			},
			'text': {
				'fontSize': captionFontSize,
				'fill': theme.palette.text.secondary
			},
			'ticks': {
				'line': {},
				'text': {
					'fontSize': captionFontSize,
					'fill': theme.palette.text.secondary
				}
			}
		},
		'annotations': {
			'text': {
				'fontSize': captionFontSize,
				'fill': theme.palette.text.secondary,
				'outlineWidth': 2,
				'outlineColor': theme.palette.background.paper,
				'outlineOpacity': 1
			},
			'link': {
				'stroke': theme.palette.text.primary,
				'strokeWidth': 1,
				'outlineWidth': 2,
				'outlineColor': theme.palette.background.paper,
				'outlineOpacity': 1
			},
			'outline': {
				'stroke': theme.palette.text.primary,
				'strokeWidth': 2,
				'outlineWidth': 2,
				'outlineColor': theme.palette.background.paper,
				'outlineOpacity': 1
			},
			'symbol': {
				'fill': theme.palette.text.primary,
				'outlineWidth': 2,
				'outlineColor': theme.palette.background.paper,
				'outlineOpacity': 1
			}
		},
		
		'tooltip': {
			'container': {
				'background': invertedTheme.palette.background.paper,
				'color': invertedTheme.palette.getContrastText(invertedTheme.palette.background.paper),
				'fontSize': captionFontSize
			},
			'basic': {},
			'chip': {},
			'table': {},
			'tableCell': {},
			'tableCellValue': {}
		}
	};
};

export const NivoTooltip = (Component: FC<any>): FC<any> => {
	return (props: any) => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const theme = useInvertedTheme();
		const sx    = {
			px: 1,
			borderRadius: 1,
			background: alpha(theme.palette.background.paper, .9),
			color: theme.palette.getContrastText(theme.palette.background.paper),
			
			'& .MuiTypography-root': {
				color: theme.palette.getContrastText(theme.palette.background.paper)
			}
		};
		
		return <Box sx={sx}>{Component(props)}</Box>;
	};
};

export function useGetChartColorsByConstructor() {
	const darkMode = usePrefersDarkMode();
	
	return (constructorId: Constructor['constructorId']) => {
		const color = getColorByConstructorId(constructorId);
		
		return darkMode
			// @ts-ignore
		       ? [color, ...(new Array(4)).fill(100).map((v, i) => blueGrey[2 * v * (i + 1)])]
			// @ts-ignore
		       : [color, ...(new Array(4)).fill(100).map((v, i) => blueGrey[900 - (2 * v * (i + 1))])];
	};
}