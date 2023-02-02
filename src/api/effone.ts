import {Circuit} from '../types/ergast';

const data = require(`./circuits.json`);

export const getCircuitDescription = (circuitId: Circuit['circuitId']): string | undefined => {
	if (!circuitId) {
		return undefined;
	}
	
	return data[circuitId];
};