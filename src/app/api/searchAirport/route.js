
import axios from 'axios';

export async function GET(request) {
    console.log('API Route Invoked: GET /api/searchAirport');

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    console.log({ query });

    if (!query) {
        console.log('Missing required parameter: query');
        return new Response(JSON.stringify({ error: 'Missing required parameter: query' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const options = {
        method: 'GET',
        url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport', // Replace with correct endpoint
        params: {
            query:query, // Adjust based on API documentation

        },
        headers: {
            'x-rapidapi-key': '3a3450fc87mshdf5a44b20c1558dp1cef93jsn81788884fac7',
            'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        console.log('Airports fetched successfully:', response.data);
        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching airports:', error.response?.data || error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}


