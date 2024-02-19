"use client";

import React, { useEffect, useState, FormEvent } from "react";
import styles from "@/app/styles/recommandpage.module.scss";
import axios from "axios";
import WebPlayback from "../components/Webplayback";
import RecommandBar from "../components/RecommandBar";
import { TrackInfo } from "../components/utils/trackinfo";
import { getSearchToken, getAccessToken } from "../components/utils/auth";
import RecommandResult from "../components/RecommandResult";

const Recommend = () => {
  const [valence, setValence] = useState<number>(0.5);
  const [danceability, setDanceability] = useState<number>(0.5);
  const [energy, setEnergy] = useState<number>(0.5);
  const [instrumentalness, setInstrumentalness] = useState<number>(0.5);
  const [tempo, setTempo] = useState<number>(120);
  const [popularity, setPopularity] = useState<number>(50);

  const [showResults, setShowResults] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<TrackInfo[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<TrackInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [searchToken, setSearchToken] = useState<string | null>(null);

  useEffect(() => {
    async function getTokens() {
      try {
        const searchToken = await getSearchToken();
        const accessToken = await getAccessToken();
        setToken(accessToken);
        setSearchToken(searchToken);
      } catch (error) {
        console.error("토큰을 가져오는 도중 오류가 발생했습니다.", error);
      }
    }

    getTokens();
  }, []);

  const searchSpotify = async () => {
    try {
      if (!searchToken) {
        console.error("No Spotify access token available");
        return;
      }

      const queryParams = `target_valence=${valence}&target_danceability=${danceability}&target_energy=${energy}&target_instrumentalness=${instrumentalness}&target_popularity=${popularity}&target_tempo=${tempo}`;

      const { data } = await axios.get(
        `https://api.spotify.com/v1/recommendations?seed_artists=6RHTUrRF63xao58xh9FXYJ&seed_genres=pop%2Cedm%2Ccountry&${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${searchToken}`,
          },
        }
      );
      setShowResults(true);

      const recommendedTracks = data.tracks || [];

      setSearchResults(recommendedTracks);
    } catch (error) {
      console.error("Error searching Spotify:", error);
    }
  };

  const onNewSearch = () => {
    setShowResults(false);
  };

  const handleTrackClick = (track: TrackInfo) => {
    setSelectedTrack(track);
  };

  return (
    <div className={styles.container}>
      <div>
        {!showResults && (
          <RecommandBar
            valence={valence}
            setValence={setValence}
            energy={energy}
            setEnergy={setEnergy}
            danceability={danceability}
            setDanceability={setDanceability}
            instrumentalness={instrumentalness}
            setInstrumentalness={setInstrumentalness}
            popularity={popularity}
            setPopularity={setPopularity}
            tempo={tempo}
            setTempo={setTempo}
            searchSpotify={searchSpotify}
          />
        )}
        {showResults && (
          <>
            <div className={styles.grid}>
              <div>VALENCE<br></br>0-1</div>
              <div>ENERGY<br></br>0-1</div>
              <div>DANCEANILITY<br></br>0-1</div>
              <div>INSTRUMENTALNESS<br></br>0-1</div>
              <div>POPULARITY<br></br>0-100</div>
              <div>BPM<br></br>60-180</div>
              <div>
                <button type="button" className="back" onClick={onNewSearch}>
                  🔙
                </button>
              </div>
              <div>{valence}</div>
              <div>{energy}</div>
              <div>{danceability}</div>
              <div>{instrumentalness}</div>
              <div>{popularity}</div>
              <div>{tempo}</div>
            </div>
            <RecommandResult
              searchResults={searchResults}
              onTrackClick={handleTrackClick}
            />
          </>
        )}
      </div>

      {showResults && selectedTrack && (
        <WebPlayback trackId={selectedTrack.id} token={token} />
      )}
    </div>
  );
};

export default Recommend;
