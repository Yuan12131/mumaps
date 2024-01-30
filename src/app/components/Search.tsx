import React, { useState } from 'react';
import axios from 'axios';
import styles from "@/app/styles/search.module.scss";

interface TrackInfo {
  id: string;
  name: string;
}

const Search = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TrackInfo[]>([]);

  const searchSpotify = async () => {
    try {
      // 클라이언트 ID와 클라이언트 시크릿은 실제 값으로 대체되어야 합니다.
      const clientId = '60e467fba3aa4b0e94cc77ddaa0e5937';
      const clientSecret = '8a878c6477db49b49105c0fcded3084f';

      // Spotify API에 인증 토큰을 요청합니다.
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

      const accessToken = tokenResponse.data.access_token;

      // Spotify API에서 곡을 검색합니다.
      const searchResponse = await axios.get(
        `https://api.spotify.com/v1/search?q=${query}&type=track`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setSearchResults(searchResponse.data.tracks.items);
    } catch (error) {
      console.error('Error searching Spotify:', error);
    }
  };

  return (
    <div>
        <div className={styles.searchbox}>🔍
        <input type="text" placeholder="듣고싶은 곡을 검색하세요" className={styles.search} value={query}
        onChange={(e) => setQuery(e.target.value)}/>
      <button onClick={searchSpotify}>Search</button>
        </div>

      <ul>
        {searchResults.map((track) => (
          <li key={track.id}>{track.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
