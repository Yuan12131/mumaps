const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3001; // 포트는 필요에 따라 수정할 수 있습니다.

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Spotify API에서 인증 토큰을 얻는 엔드포인트
app.post('/getSpotifyToken', async (req, res) => {
  try {
    const clientId = '60e467fba3aa4b0e94cc77ddaa0e5937';
    const clientSecret = '8a878c6477db49b49105c0fcded3084f';

    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${clientId}:${clientSecret}`
          ).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    res.json({ accessToken: tokenResponse.data.access_token });
  } catch (error) {
    console.error('Error getting Spotify token:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Spotify API에서 곡을 검색하는 엔드포인트
app.get('/searchSpotify', async (req, res) => {
  try {
    const { query } = req.query;

    // 클라이언트로부터 받은 검색어를 이용해 Spotify API에 검색 요청
    const tokenResponse = await axios.post('http://localhost:3001/getSpotifyToken');
    const accessToken = tokenResponse.data.accessToken;

    const searchResponse = await axios.get(
      `https://api.spotify.com/v1/search?q=${query}&type=track`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.json({ searchResults: searchResponse.data.tracks.items });
  } catch (error) {
    console.error('Error searching Spotify:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
