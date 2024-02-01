"use client";

import React, { useEffect, useState, FormEvent } from "react";
import styles from "@/app/styles/searchpage.module.scss";
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

const SearchPage = () => {
  const [query, setQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<TrackInfo[]>([]);
  const [searchType, setSearchType] = useState<string>("track"); // 초기값은 'track'으로 설정
  const router = useRouter();
  const [isActive, setIsActive] = useState<boolean>(false);
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const clientId = "60e467fba3aa4b0e94cc77ddaa0e5937";
        const clientSecret = "8a878c6477db49b49105c0fcded3084f";

        const tokenResponse = await axios.post(
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

        const accessToken = tokenResponse.data.access_token;
        setSpotifyToken(accessToken);
      } catch (error) {
        console.error("Error getting Spotify access token:", error);
      }
    };

    // 페이지가 로드될 때 액세스 토큰을 얻도록 호출
    getToken();
  }, []);

  const searchSpotify = async (query: string, searchType: string) => {
    try {
      if (!spotifyToken) {
        console.error("No Spotify access token available");
        return;
      }

      const searchResponse = await axios.get(
        `https://api.spotify.com/v1/search?q=${query}&type=${searchType}`,
        {
          headers: {
            Authorization: `Bearer ${spotifyToken}`,
          },
        }
      );

      const items = searchResponse.data[`${searchType}s`]?.items || [];

      if (!items) {
        console.error("No items found in the Spotify search response");
        return;
      }

      setSearchResults(items);
      router.push("/search");
    } catch (error) {
      console.error("Error searching Spotify:", error);
    }
  };

  const handleSearchComplete = (query: string, searchType: string) => {
    setQuery(query); // 검색 완료 시 검색어 설정
    setSearchType(searchType); // 검색 유형 업데이트
    searchSpotify(query, searchType); // Spotify 검색 호출
  };

  const handleTrackPlay = (trackId: string) => {
    const playTrack = async () => {
      try {
        if (!spotifyToken) {
          console.error("No Spotify access token available");
          return;
        }

        // Spotify Web API 엔드포인트 및 토큰 정보 (실제로는 안전한 방법으로 관리해야 함)
        const spotifyApiEndpoint = 'https://api.spotify.com/v1/me/player/play';

        // 트랙 재생을 위한 요청 데이터
        const requestData = {
          uris: [`spotify:track:${trackId}`],
        };

        // Spotify Web API에 PUT 요청 보내기
        await axios({
          method: 'put',
          url: spotifyApiEndpoint,
          headers: {
            Authorization: `Bearer ${spotifyToken}`,
            'Content-Type': 'application/json',
          },
          data: requestData,
        });

        console.log('Track is playing!');
      } catch (error) {
        console.error('Error playing track:', error);
      }
    };

    // playTrack 함수 호출
    playTrack();
  }

  const formatDuration = (durationInMs: number) => {
    const totalSeconds = durationInMs / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSearchComplete(query, searchType);
  };

  const onClick = (selectedType: string) => {
    setSearchType(selectedType);
    setIsActive(true); // 버튼 활성화 상태 변경
    setSearchResults([]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.div1}>
        <Topbar />
      </div>
      <div className={styles.div2}>
        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.btndiv}>
            <button
              type="button"
              value="track"
              onClick={() => onClick("track")}
              className={
                searchType === "track" && isActive ? styles.active : ""
              }
            >
              TRACK
            </button>
            <button
              type="button"
              value="artist"
              onClick={() => onClick("artist")}
              className={
                searchType === "artist" && isActive ? styles.active : ""
              }
            >
              ARTIST
            </button>
            <button
              type="button"
              value="album"
              onClick={() => onClick("album")}
              className={
                searchType === "album" && isActive ? styles.active : ""
              }
            >
              ALBUM
            </button>
          </div>
          <input
            type="text"
            id="searchInput"
            placeholder="🔍 듣고싶은 곡을 검색하세요"
            className={styles.search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </div>
      <div className={styles.div3}>
        {searchType === "track" && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th></th>
                <th>제목</th>
                <th></th>
                <th>아티스트</th>
                <th>앨범</th>
                <th>🕛</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((track, index) => (
                <tr className={styles.row} key={track.id} onClick={() => handleTrackPlay(track.id)}>
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
        )}

        {searchType === "artist" && (
          <div className={styles.artistResults}>
            {searchResults.map((artist) => (
              <div className={styles.artistCard} key={artist.id}>
                {artist.images && artist.images.length > 0 && (
                  <img
                    src={artist.images[0].url}
                    alt={artist.name}
                    style={{
                      width: "10vw",
                      height: "10vw",
                      borderRadius: "10vw",
                    }}
                  />
                )}
                <p>{artist.name}</p>
                <p>artist</p>
              </div>
            ))}
          </div>
        )}

        {searchType === "album" && (
          <div className={styles.albumResults}>
            {searchResults.map((album) => (
              <div className={styles.albumCard} key={album.id}>
                {album.images && album.images.length > 0 && (
                  <img
                    src={album.images[0].url}
                    alt={album.name}
                    style={{
                      width: "10vw",
                      height: "10vw",
                      borderRadius: "10px",
                    }}
                  />
                )}
                <p>{album.name}</p>
                <p>{new Date(album.release_date).getFullYear()} {album.artists[0].name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
