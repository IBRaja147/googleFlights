'use client';

import { useState } from 'react';
import axios from 'axios';
import {
    Container,
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    CardActions,
    CircularProgress,
    Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import FlightIcon from '@mui/icons-material/Flight';
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

export default function Home() {
    // storing data in state using useState
    const [origin, setOrigin] = useState('');
    const [originDetails, setOriginDetails] = useState({});
    const [destination, setDestination] = useState('');
    const [destinationDetails, setDestinationDetails] = useState({});
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getEntityId = async (value) => {
        try {
            const response = await axios.get('/api/searchAirport', {
                params: { query: value },
            });
            return response.data.data.find(val => val.skyId === value);
        } catch (error) {
            console.error('Error fetching airports:', error);
        }
    }
    // getting
    const handleOrigin = async (value) => {
        setOrigin(value);
        if (value.length > 2) {
            const res = await getEntityId(value);
            setOriginDetails(res);
        }
    }

    const handleDestination = async (value) => {
        setDestination(value);
        if (value.length > 2) {
            const res = await getEntityId(value);
            setDestinationDetails(res);
        }
    }

    const convertFlightsResponse = (response) => {
        if( response.data.data.itineraries.length === 0){
            setError("no flights found");
        }
        const flightResults = [];
        response.data.data.itineraries.forEach((itinerary) => {
            const price = itinerary.price ? `${itinerary.price.formatted}` : 'N/A';
            itinerary.legs.forEach((leg) => {
                const flightObj = {
                    origin: leg.origin.displayCode,
                    destination: leg.destination.displayCode,
                    departureDate: leg.departure.split('T')[0],
                    arrivalDate: leg.arrival.split('T')[0],
                    departureTime: leg.departure.split('T')[1],
                    arrivalTime: leg.arrival.split('T')[1],
                    durationInMinutes: leg.durationInMinutes,
                    stops: leg.stopCount,
                    operatingCarrier: leg.carriers.marketing[0]?.name || 'Unknown',
                    operatingCarrierLogo: leg.carriers.marketing[0]?.logoUrl || 'N/A',
                    price: price,
                };
                flightResults.push(flightObj);
            });
        });
        setFlights(flightResults);
    }
// method the searchFlights
    const searchFlights = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/searchFlights', {
                params: {
                    originSkyId: originDetails.skyId,
                    destinationSkyId: destinationDetails.skyId,
                    originEntityId: originDetails.entityId,
                    destinationEntityId: destinationDetails.entityId,
                    date: departureDate,
                    returnDate: returnDate,
                    cabinClass: 'economy',
                    adults: '1',
                    sortBy: 'best',
                    currency: 'USD',
                    market: 'en-US',
                    countryCode: 'US',
                },
            });
            convertFlightsResponse(response);
        } catch (err) {
            setError('Failed to fetch flights. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    // rendering the  UI
    return (
        <Container maxWidth="md" sx={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                <FlightIcon color="primary" /> Flight Search
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Origin"
                        variant="outlined"
                        required
                        fullWidth
                        value={origin}
                        onChange={(e) => handleOrigin(e.target.value)}
                        placeholder="e.g., NYC"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Destination"
                        variant="outlined"
                        required
                        fullWidth
                        value={destination}
                        onChange={(e) => handleDestination(e.target.value)}
                        placeholder="e.g., LAX"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Departure Date"
                        type="date"
                        variant="outlined"
                        required
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Return Date"
                        type="date"
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} style={{ textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={searchFlights}
                        disabled={loading}
                        size="large"
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Search Flights'}
                    </Button>
                </Grid>
            </Grid>

            {error && (
                <Alert severity="error" sx={{ marginTop: '1rem' }}>
                    {error}
                </Alert>
            )}

            {flights.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                    <Typography variant="h5" gutterBottom>
                        Available Flights
                    </Typography>
                    <Grid container spacing={2}>
                        {flights.map((flight, index) => (
                            <Grid item xs={12} key={index}>
                                <Card>
                                    <CardContent>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item>

                                                <img
                                                    src={flight.operatingCarrierLogo} alt={`${flight.operatingCarrier} logo`} width="50"
                                                    />
                                            </Grid>
                                            <Grid item xs={12} sm={8}>
                                            <Typography variant="h6">
                                                    {flight.origin} &rarr; {flight.destination}
                                                </Typography>
                                                <Typography color="textSecondary">
                                                    Departure: {flight.departureDate} at {flight.departureTime}
                                                </Typography>
                                                <Typography color="textSecondary">
                                                    Arrival: {flight.arrivalDate} at {flight.arrivalTime}
                                                </Typography>
                                                <Typography color="textSecondary">
                                                    Airline: {flight.operatingCarrier}
                                                </Typography>

                                                <Typography color="textSecondary">
                                                    Price: <strong>{flight.price}</strong>
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" color="primary" variant="contained">
                                            Book Now
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            )}
        </Container>
    );
}
