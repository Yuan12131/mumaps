"use client";

import React, { useEffect, useState, FormEvent } from "react";
import styles from "@/app/styles/algorithm.module.scss";
import Topbar from "@/app/components/Topbar";
import axios from "axios";
import { useRouter } from "next/navigation";

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
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<TrackInfo[]>([]);
  const [query, setQuery] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("track");
  const router = useRouter();

  useEffect(() => {
    const getToken = async () => {
      try {
        const clientId = "60e467fba3aa4b0e94cc77ddaa0e5937";
        const clientSecret = "8a878c6477db49b49105c0fcded3084f";

        const { data } = await axios.post(
          "https://accounts.spotify.com/api/token",
          "grant_type=client_credentials",
          {
            headers: {
              Authorization: `Basic ${Buffer.from(
                `${clientId}:${clientSecret}`
              ).toString("base64")}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        const accessToken = data.access_token;
        setSpotifyToken(accessToken);
      } catch (error) {
        console.error("Error getting Spotify access token:", error);
      }
    };

    // 페이지가 로드될 때 액세스 토큰을 얻도록 호출
    getToken();
  }, []);

  const searchSpotify = async () => {
    try {
      if (!spotifyToken) {
        console.error("No Spotify access token available");
        return;
      }

      const queryParams = `target_valence=${valence}&target_danceability=${danceability}&target_energy=${energy}&target_instrumentalness=${instrumentalness}&target_popularity=${popularity}&target_tempo=${tempo}`;

      const { data } = await axios.get(
        `https://api.spotify.com/v1/recommendations?seed_artists=7tYKF4w9nC0nq9CsPZTHyP&seed_genres=pop%2Cedm%2Ccountry&${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${spotifyToken}`,
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
          <span>우울한</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={valence}
            onChange={(e) => setValence(parseFloat(e.target.value))}
          />
          <span>밝은</span>
        </div>
        <div
          className={`${styles.slider} ${
            showResults ? styles.sliderActive : ""
          }`}
        >
          <span>차분한</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={energy}
            onChange={(e) => setEnergy(parseFloat(e.target.value))}
          />
          <span>강렬한</span>
        </div>
        <div
          className={`${styles.slider} ${
            showResults ? styles.sliderActive : ""
          }`}
        >
          <span>나만아는</span>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={popularity}
            onChange={(e) => setPopularity(parseFloat(e.target.value))}
          />
          <span>대중적인</span>
        </div>
        <div
          className={`${styles.slider} ${
            showResults ? styles.sliderActive : ""
          }`}
        >
          <span>가마니</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={danceability}
            onChange={(e) => setDanceability(parseFloat(e.target.value))}
          />
          <span>춤추기 좋은</span>
        </div>
        <div
          className={`${styles.slider} ${
            showResults ? styles.sliderActive : ""
          }`}
        >
          <span>보컬</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={instrumentalness}
            onChange={(e) => setInstrumentalness(parseFloat(e.target.value))}
          />
          <span>반주</span>
        </div>
        <div
          className={`${styles.slider} ${
            showResults ? styles.sliderActive : ""
          }`}
        >
            <span>느린 템포</span>
            <input
              type="range"
              min="60"
              max="180"
              step="5"
              value={tempo}
              onChange={(e) => setTempo(parseFloat(e.target.value))}
            />
            <span>빠른 템포</span>
            </div>
            <div
          className={`${styles.resultBtn} ${
            showResults ? styles.sliderActive : ""
          }`}
        >
          <button type="button" onClick={onSubmit}>
            결과 보기
          </button>
          </div>
        {showResults && (
          <div>
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
                          style={{ width: "4vw", height: "4vw" }}
                        />
                      )}
                    </td>
                    <td>{track.name}</td>
                    <td>{track.artists[0].name}</td>
                    <td>{track.album.name}</td>
                    <td>{formatDuration(track.duration_ms)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Algorithm;
