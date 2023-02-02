import {Box, Container, ThemeProvider} from '@mui/material';
import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import ConstructorProvider from '../constructors/ConstructorProvider';
import DriverProvider from '../drivers/DriverProvider';
import {Driver, Home, Race} from '../pages';
import About from '../pages/About';
import Circuit from '../pages/Circuit';
import Constructor from '../pages/Constructor';
import Header from '../ui-components/Header';
import {useEffTheme} from '../ui-components/Theme';
import AppStateProvider from './AppStateProvider';
import ErrorBoundary from './ErrorBoundary';
import GoogleAnalyticsProvider from './GoogleAnalyticsProvider';

function Index() {
	const theme = useEffTheme();
	
	return (
		<AppStateProvider>
			<ThemeProvider theme={theme}>
				<BrowserRouter>
					<GoogleAnalyticsProvider>
						<ConstructorProvider>
							<DriverProvider>
								<Box sx={{position: 'fixed', overflow: 'auto', scrollbarColor: theme.palette.mode, top: 0, left: 0, right: 0, bottom: 0, background: theme.palette.background.default}}>
									<Header/>
									
									<Container maxWidth="xl" component="main" sx={{py: 2}}>
										<ErrorBoundary>
											<Routes>
												<Route
													element={<Home/>}
													path="/"
												/>
												<Route
													element={<About/>}
													path="/about"
												/>
												<Route
													element={<Circuit/>}
													path="/circuit/:circuitId"
												/>
												<Route
													element={<Constructor/>}
													path="/constructor/:id"
												/>
												<Route
													element={<Driver/>}
													path="/driver/:id"
												/>
												<Route
													element={<Race/>}
													path="/race/:season?/:round?"
												/>
											</Routes>
										</ErrorBoundary>
									</Container>
								</Box>
							</DriverProvider>
						</ConstructorProvider>
					</GoogleAnalyticsProvider>
				</BrowserRouter>
			</ThemeProvider>
		</AppStateProvider>
	);
}

export default Index;
