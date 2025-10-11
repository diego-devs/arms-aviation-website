
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

interface RawAirport {
    name: string;
    city: string;
    country: string;
    iata_code: string;
}

let airports: Airport[] = [];
let airportsPromise: Promise<void> | null = null;

const loadAirports = (): Promise<void> => {
    if (airports.length > 0) {
        return Promise.resolve();
    }
    if (airportsPromise) {
        return airportsPromise;
    }

    // Use an absolute path from the web root, which should work in production
    airportsPromise = fetch('/lib/airports.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for /lib/airports.json`);
            }
            return response.json();
        })
        .then(allAirportsData => {
            airports = (allAirportsData as RawAirport[])
                .map((airport: RawAirport): Airport => ({
                    iata: airport.iata_code,
                    name: airport.name,
                    city: airport.city,
                    country: airport.country,
                }))
                .filter((airport): airport is Airport => !!airport.iata && !!airport.name);
        })
        .catch(error => {
            console.error("Could not load airport data:", error);
            // Reset promise on error to allow retrying
            airportsPromise = null;
        });

    return airportsPromise;
};


const popularAirportIatas = {
    'mexico': ['MEX', 'CUN', 'GDL', 'TIJ', 'MTY'],
    'usa': ['ATL', 'DFW', 'DEN', 'ORD', 'LAX', 'JFK', 'MCO', 'MIA', 'LAS', 'CLT'],
    'europe': ['LHR', 'CDG', 'AMS', 'FRA', 'MAD', 'FCO', 'MUC', 'BCN', 'ZRH', 'LIS'],
    'dubai': ['DXB']
};

const getAirportByIata = (iata: string): Airport | undefined => {
    if (!iata) return undefined;
    return airports.find(airport => airport.iata.toUpperCase() === iata.toUpperCase());
};

export const getPopularAirports = async (): Promise<PopularAirportGroup[]> => {
    await loadAirports();
    
    const popularAirportGroups: PopularAirportGroup[] = [];

    for (const [titleKey, iatas] of Object.entries(popularAirportIatas)) {
        const group: PopularAirportGroup = { titleKey: titleKey as PopularAirportGroup['titleKey'], airports: [] };
        
        const foundAirports = iatas.map(iata => getAirportByIata(iata)).filter((airport): airport is Airport => airport !== undefined);

        group.airports = foundAirports;
        
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