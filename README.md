# 🏁 effOne Hub

> [Live Demo](https://effonehub.com/)

React & Material-UI app consuming the [Ergast API](https://ergast.com/mrd/) Formula One dataset.

View historical Formula One data back to 1950. Race results, qualifying, Driver's and Constructor's championship standings. Lap times and overtakes for each race. 

Data supplemented by [wikipedia](https://wikipedia.com)

## API

* [Documentation](https://ergast.com/mrd/)
* [Postman Docs](https://documenter.getpostman.com/view/11586746/SztEa7bL#intro)
* [GitHub Project](https://github.com/jcnewell/ergast-f1-api)

## Configurable Environment Variables

Both API base URL and Google Analytics Tracking ID can be specified via env vars.  The latter is optional, and omitting it will disable GA integration.

### Sample .env file
```
REACT_APP_API_URL=https://ergast.com/api/f1
REACT_APP_GA_TRACKING_ID=X-XXXXXXXXXX
```

### Local API

Follow instructions for the GitHub repo above to run the API locally. Couple tweaks to point this project there.

#### Add .env.development.local
```
REACT_APP_API_URL=http://localhost:8000/api/f1
```

#### Add index to the API's DB
Connect to the DB for the API and run the following SQL
```
CREATE INDEX races_year_round_idx ON races (year, round);
CREATE INDEX races_circuit_idx ON races (circuitId);
CREATE INDEX results_driver_idx ON results (driverId);
CREATE INDEX results_driver_race_idx ON results (raceId, driverId);
CREATE INDEX lapTimes_race_idx ON lapTimes (raceId);
CREATE INDEX pitStops_race_lap_idx ON pitStops (raceId, lap);
```

## Development

This is a typical CRA using yarn.

```
yarn install
yarn start
```

### Production Build

```
yarn run build
```

## Notable Dependencies

* UI
  * [Material UI](https://mui.com)
  * [FontAwesome](https://fontawesome.com/)
  * [Nivo Charts](https://nivo.rocks)
* Nationalities
  * [emoji-flag](https://www.npmjs.com/package/emoji-flag)
  * [i18n-nationality](https://www.npmjs.com/package/i18n-nationality)
* Race Maps
  * [world-atlas](https://www.npmjs.com/package/world-atlas)
  * [topojson-client](https://www.npmjs.com/package/topojson-client)
* Data
  * [ergast-f1-api](https://github.com/jcnewell/ergast-f1-api)
  * [wikipedia](https://www.npmjs.com/package/wikipedia)
  * [axios](https://www.npmjs.com/package/axios)
