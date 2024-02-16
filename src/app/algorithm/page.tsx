/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState, FormEvent } from "react";
import styles from "@/app/styles/algorithm.module.scss";
import Topbar from "@/app/components/Topbar";
import axios from "axios";
import WebPlayback from "../components/Webplayback";

interface TrackInfo {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  images: Image[];
  duration_ms: number;
  release_date: string;
}

interface Artist {
  id: string;
  images: Image[];
  name: string;
}

interface Album {
  id: string;
  images: Image[];
  name: string;
}

interface Image {
  url: string;
}

const Algorithm = () => {
  const [valence, setValence] = useState<number>(0.5);
  const [danceability, setDanceability] = useState<number>(0.5);
  const [energy, setEnergy] = useState<number>(0.5);
  const [instrumentalness, setInstrumentalness] = useState<number>(0.5);
  const [tempo, setTempo] = useState<number>(120);
  const [popularity, setPopularity] = useState<number>(50);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<TrackInfo[]>([]);
  const [searchType, setSearchType] = useState<string>("track");
  const [selectedTrack, setSelectedTrack] = useState<TrackInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [searchToken, setSearchToken] = useState<string | null>(null);

  useEffect(() => {
    async function getTokens() {
      try {
        const response = await fetch("/auth/token");
        const json = await response.json();

        if (json.access_token) {
          setToken(json.access_token);
        } else {
          console.error("토큰이 비어 있습니다.");
        }

        // 검색을 위한 토큰 설정
        const searchResponse = await fetch("/auth/searchToken");
        const searchJson = await searchResponse.json();

        if (searchJson.access_token) {
          setSearchToken(searchJson.access_token);
        } else {
          console.error("검색 토큰이 비어 있습니다.");
        }
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

      const recommendedTracks = data.tracks || [];

      setSearchResults(recommendedTracks);
    } catch (error) {
      console.error("Error searching Spotify:", error);
    }
  };

  const formatDuration = (durationInMs: number) => {
    const totalSeconds = durationInMs / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await searchSpotify();
    setShowResults(true);
  };

  const onNewSearch = () => {
    setShowResults(false);
  };

  const handleTrackClick = (track: TrackInfo) => {
    // 클릭한 트랙의 ID를 상태에 설정
    setSelectedTrack(track);
  };

  return (
    <div className={styles.container}>
      <div className={styles.div1}>
        <Topbar />
      </div>
      <div
        className={`${styles.sliderContainer} ${
          showResults ? styles.sliderActive : ""
        }`}
      >
        <div
          className={`${styles.slider} ${
            showResults ? styles.sliderActive : ""
          }`}
        >
          <span>NEGATIVE</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={valence}
            onChange={(e) => setValence(parseFloat(e.target.value))}
          />
          <span>POSITIVE</span>
        </div>
        <div
          className={`${styles.slider} ${
            showResults ? styles.sliderActive : ""
          }`}
        >
          <span>SOFT</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={energy}
            onChange={(e) => setEnergy(parseFloat(e.target.value))}
          />
          <span>POWERFUL</span>
        </div>
        <div
          className={`${styles.slider} ${
            showResults ? styles.sliderActive : ""
          }`}
        >
          <span>STATIC</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={danceability}
            onChange={(e) => setDanceability(parseFloat(e.target.value))}
          />
          <span>DYNAMIC</span>
        </div>
        <div
          className={`${styles.slider} ${
            showResults ? styles.sliderActive : ""
          }`}
        >
          <span>MUSICAL</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={instrumentalness}
            onChange={(e) => setInstrumentalness(parseFloat(e.target.value))}
          />
          <span>INSTRUMENTAL</span>
        </div>
        <div
          className={`${styles.slider} ${
            showResults ? styles.sliderActive : ""
          }`}
        >
          <span>UNPOPULAR</span>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={popularity}
            onChange={(e) => setPopularity(parseFloat(e.target.value))}
          />
          <span>POPULAR</span>
        </div>
        <div
          className={`${styles.slider} ${
            showResults ? styles.sliderActive : ""
          }`}
        >
          <span>SLOW</span>
          <input
            type="range"
            min="60"
            max="180"
            step="5"
            value={tempo}
            onChange={(e) => setTempo(parseFloat(e.target.value))}
          />
          <span>FAST</span>
        </div>
        <div
          className={`${styles.resultBtn} ${
            showResults ? styles.sliderActive : ""
          }`}
        >
          <button type="button" onClick={onSubmit}>
            GO
          </button>
        </div>
        {showResults && (
          <div
            className={`${styles.resultDiv} ${
              showResults ? styles.sliderActive : ""
            }`}
          >
            <table
              className={`${styles.input} ${
                showResults ? styles.sliderActive : ""
              }`}
            >
              <thead>
                <tr>
                  <th>
                    VALENCE<br></br>0-1
                  </th>
                  <th>
                    ENERGY<br></br> 0-1
                  </th>
                  <th>
                    DANCEANILITY <br></br>0-1
                  </th>
                  <th>
                    INSTRUMENTALNESS<br></br> 0-1
                  </th>
                  <th>
                    POPULARITY <br></br>0-100
                  </th>
                  <th>
                    BPM <br></br>60-180
                  </th>
                  <th>
                    {" "}
                    <button
                      type="button"
                      className={styles.back}
                      onClick={onNewSearch}
                    >
                      🔙
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{valence}</td>
                  <td>{energy}</td>
                  <td>{danceability}</td>
                  <td>{instrumentalness}</td>
                  <td>{popularity}</td>
                  <td>{tempo}</td>
                </tr>
              </tbody>
            </table>
            <table
              className={`${styles.class} ${
                showResults ? styles.sliderActive : ""
              }`}
            >
              <thead>
                <tr>
                  <th>#</th>
                  <th></th>
                  <th>제목</th>
                  <th>아티스트</th>
                  <th>앨범</th>
                  <th>🕛</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((track, index) => (
                  <tr className={styles.row} key={track.id}>
                    <td>{index + 1}</td>
                    <td>
                      {track.album.images && track.album.images.length > 0 && (
                        <img
                          src={track.album.images[0].url}
                          alt={track.name}
                          style={{ width: "5vw", height: "5vw" }}
                        />
                      )}
                    </td>
                    <td>{track.name}</td>
                    <td>{track.artists[0].name}</td>
                    <td>{track.album.name}</td>
                    <td>{formatDuration(track.duration_ms)}</td>
                    <td>
                      <img
                        src="/images/play_circle.svg"
                        alt={track.name}
                        style={{
                          width: "3vw",
                          height: "3vw",
                          borderRadius: "2px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleTrackClick(track)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {searchType === "track" && selectedTrack && (
        <WebPlayback trackId={selectedTrack.id} token={token} />
      )}
    </div>
  );
};

export default Algorithm;
