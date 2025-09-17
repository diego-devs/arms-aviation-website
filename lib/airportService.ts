export interface Airport {
    iata: string;
    name: string;
    city?: string;
    country?: string;
}

export interface PopularAirportGroup {
    titleKey: 'mexico' | 'usa' | 'europe' | 'dubai';
    airports: Airport[];
}

let airports: Airport[] = [];
let airportsPromise: Promise<void> | null = null;

interface RawAirport {
    name: string;
    city: string;
    country: string;
    iata_code: string;
}


const loadAirports = (): Promise<void> => {
    if (airports.length > 0) return Promise.resolve();
    if (airportsPromise) return airportsPromise;

    airportsPromise = fetch('./lib/airports.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then((allAirportsData: RawAirport[]) => {
            airports = allAirportsData
                // Fix: Explicitly type the returned object as Airport to match the type predicate in the following filter.
                .map((airport: RawAirport): Airport => ({
                    iata: airport.iata_code,
                    name: airport.name,
                    city: airport.city,
                    country: airport.country,
                }))
                .filter((airport): airport is Airport => !!airport.iata && !!airport.name); // Filter out entries without essential data
        })
        .catch(error => {
            console.error("Failed to load airport data:", error);
            airportsPromise = null;
            throw error;
        });

    return airportsPromise;
};

loadAirports();

const popularAirportIatas = {
    'mexico': ['MEX', 'CUN', 'GDL', 'TIJ', 'MTY'],
    'usa': ['ATL', 'DFW', 'DEN', 'ORD', 'LAX', 'JFK', 'MCO', 'MIA', 'LAS', 'CLT'],
    'europe': ['LHR', 'CDG', 'AMS', 'FRA', 'MAD', 'FCO', 'MUC', 'BCN', 'ZRH', 'LIS'],
    'dubai': ['DXB']
};

export const getPopularAirports = async (): Promise<PopularAirportGroup[]> => {
    await loadAirports();
    
    const popularAirportGroups: PopularAirportGroup[] = [];

    for (const [titleKey, iatas] of Object.entries(popularAirportIatas)) {
        const group: PopularAirportGroup = { titleKey: titleKey as PopularAirportGroup['titleKey'], airports: [] };
        
        const airportPromises = iatas.map(iata => getAirportByIata(iata));
        const foundAirports = await Promise.all(airportPromises);

        group.airports = foundAirports.filter((airport): airport is Airport => airport !== undefined);
        
        if (group.airports.length > 0) {
            popularAirportGroups.push(group);
        }
    }
    
    return popularAirportGroups;
};

export const searchAirports = async (query: string): Promise<Airport[]> => {
    await loadAirports();

    if (!query || query.trim().length < 2) {
        return [];
    }

    const lowerCaseQuery = query.toLowerCase();

    const results = airports.filter(airport =>
        airport.name.toLowerCase().includes(lowerCaseQuery) ||
        airport.iata.toLowerCase().includes(lowerCaseQuery) ||
        (airport.city && airport.city.toLowerCase().includes(lowerCaseQuery)) ||
        (airport.country && airport.country.toLowerCase().includes(lowerCaseQuery))
    ).slice(0, 20);

    return results;
};

export const getAirportByIata = async (iata: string): Promise<Airport | undefined> => {
    await loadAirports();
    if (!iata) return undefined;
    return airports.find(airport => airport.iata.toUpperCase() === iata.toUpperCase());
};
