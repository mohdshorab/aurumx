export type Metals = Record<string, number>;

export type Currencies = Record<string, number>;

export type Timestamps = {
	metal: string;
	currency: string;
};

export type MetalsResponse = {
	status: string;
	currency: string;
	unit: string;
	metals: Metals;
	currencies: Currencies;
	timestamps: Timestamps;
};

export default MetalsResponse;

