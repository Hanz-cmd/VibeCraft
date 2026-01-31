const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET weather by city
router.get('/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
      // Return mock data if no API key
      return res.json({
        city,
        temp: 22,
        condition: 'sunny',
        humidity: 45,
        recommendation: 'Light layers recommended'
      });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const { main, weather } = response.data;
    
    let recommendation = '';
    if (main.temp < 10) recommendation = 'Warm layers and jacket needed';
    else if (main.temp < 20) recommendation = 'Light jacket or sweater';
    else if (main.temp < 28) recommendation = 'Light, breathable clothes';
    else recommendation = 'Stay cool with loose, light clothing';

    if (weather[0].main === 'Rain') recommendation += '. Bring rain gear!';

    res.json({
      city,
      temp: Math.round(main.temp),
      condition: weather[0].main.toLowerCase(),
      humidity: main.humidity,
      recommendation
    });
  } catch (error) {
    console.error('Weather API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather' });
  }
});

module.exports = router;
