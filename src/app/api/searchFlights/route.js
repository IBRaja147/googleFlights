// app/api/searchFlights/route.js
import axios from 'axios';

export async function GET(request) {
    console.log('API Route Invoked: GET /api/searchFlights');

    const { searchParams } = new URL(request.url);
    const originSkyId = searchParams.get('originSkyId');
    const destinationSkyId = searchParams.get('destinationSkyId');
    const originEntityId = searchParams.get('originEntityId');
    const destinationEntityId = searchParams.get('destinationEntityId');
    const date = searchParams.get('date');
    const returnDate = searchParams.get('returnDate');
    const cabinClass = searchParams.get('cabinClass') || 'economy';
    const adults = searchParams.get('adults') || '1';
    const sortBy = searchParams.get('sortBy') || 'best';
    const currency = searchParams.get('currency') || 'USD';
    const market = searchParams.get('market') || 'en-US';
    const countryCode = searchParams.get('countryCode') || 'US';

    console.log({
        originSkyId,
        destinationSkyId,
        originEntityId,
        destinationEntityId,
        cabinClass,
        adults,
        sortBy,
        currency,
        market,
        countryCode
    });

    // Validate required parameters
    if (!originSkyId || !destinationSkyId || !originEntityId || !destinationEntityId) {
        console.log('Missing required parameters.');
        return new Response(JSON.stringify({ error: 'Missing required parameters.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const options = {
        method: 'GET',
        url: 'https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights',
        params: {
            originSkyId,
            destinationSkyId,
            originEntityId,
            destinationEntityId,
            date,
            returnDate,
            cabinClass,
            adults,
            sortBy,
            currency,
            market,
            countryCode
        },
        headers: {
            'x-rapidapi-key': '3a3450fc87mshdf5a44b20c1558dp1cef93jsn81788884fac7',
            'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        console.log('Flights fetched successfully:', response.data);
        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching flights:', error.response?.data || error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}


