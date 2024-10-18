// app/api/flights/route.js
import axios from 'axios';

export async function GET(request) {
    console.log('API Route Invoked: GET /api/flights');

    const { searchParams } = new URL(request.url);
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const departureDate = searchParams.get('departureDate');
    const returnDate = searchParams.get('returnDate');

    console.log({ origin, destination, departureDate, returnDate });

    if (!origin || !destination || !departureDate) {
        console.log('Missing required parameters.');
        return new Response(JSON.stringify({ error: 'Missing required parameters.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const options = {
        method: 'GET',
        url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights', // Replace with correct endpoint
        params: {
            originSkyId: origin,
            destinationSkyId: destination,
            fromDate: departureDate,
            returnDate: returnDate,
            currency: 'USD'

        },
        headers: {
            'x-rapidapi-key': '3a3450fc87mshdf5a44b20c1558dp1cef93jsn81788884fac7',
            'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
        },
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
