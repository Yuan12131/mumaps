/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState, FormEvent } from "react";
import styles from "@/app/styles/searchpage.module.scss";
import Topbar from "@/app/components/Topbar";
import axios from "axios";
import { useRouter } from "next/navigation";
import WebPlayback from "../components/Webplayback";

interface TrackInfo {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  images: Image[];
  duration_ms: number;
  release_date: string;
  spotify: string;
  external_urls: {
    spotify: string;
  };
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
  const [isActive, setIsActive] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [playlist, setPlaylist] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState<TrackInfo | null>(null);

  // 검색을 위한 별도의 토큰 상태
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

  const searchSpotify = async (query: string, searchType: string) => {
    try {
      if (!searchToken) {
        console.error("No Spotify search token available");
        return;
      }

      const searchResponse = await axios.get(
        `https://api.spotify.com/v1/search?q=${query}&type=${searchType}`,
        {
          headers: {
            Authorization: `Bearer ${searchToken}`,
          },
        }
      );

      const items = searchResponse.data[`${searchType}s`]?.items || [];

      if (!items) {
        console.error("No items found in the Spotify search response");
        return;
      }

      setSearchResults(items);
    } catch (error) {
      console.error("Error searching Spotify:", error);
    }
  };

  const handleSearchComplete = (query: string, searchType: string) => {
    setQuery(query); // 검색 완료 시 검색어 설정
    setSearchType(searchType); // 검색 유형 업데이트
    searchSpotify(query, searchType); // Spotify 검색 호출
  };

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

  const handleTrackClick = (track: TrackInfo) => {
    // 클릭한 트랙의 ID를 상태에 설정
    setSelectedTrack(track);
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
                        style={{
                          width: "5vw",
                          height: "5vw",
                          borderRadius: "2px",
                        }}
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
        )}

        {searchType === "artist" && (
          <div className={styles.artistResults}>
            {searchResults.map((artist) => (
              <div className={styles.artistCard} key={artist.id}>
                <a
                  href={artist.external_urls.spotify}
                  target="_blank" // Open the link in a new tab
                  rel="noopener noreferrer" // Recommended for security reasons
                  className={styles.name}
                >
                  {artist.images && artist.images.length > 0 && (
                    <img
                      src={artist.images[0].url}
                      alt={artist.name}
                      style={{
                        width: "11vw",
                        height: "11vw",
                        borderRadius: "11vw",
                      }}
                    />
                  )}
                </a>
                <p className={styles.name}>{artist.name}</p>
                <p className={styles.artist}>artist</p>
              </div>
            ))}
          </div>
        )}

        {searchType === "album" && (
          <div className={styles.albumResults}>
            {searchResults.map((album) => (
              <div className={styles.albumCard} key={album.id}>
                <a
                  href={album.external_urls.spotify}
                  target="_blank" // Open the link in a new tab
                  rel="noopener noreferrer" // Recommended for security reasons
                  className={styles.name}
                >
                  {album.images && album.images.length > 0 && (
                    <img
                      src={album.images[0].url}
                      alt={album.name}
                      style={{
                        width: "11vw",
                        height: "11vw",
                        borderRadius: "10px",
                      }}
                    />
                  )}
                </a>
                <p className={styles.album}>{album.name}</p>
                <p className={styles.year}>
                  {new Date(album.release_date).getFullYear()}{" "}
                  {album.artists[0].name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      {searchType === "track" && selectedTrack && (
        <WebPlayback trackId={selectedTrack.id} token={token} />
      )}
    </div>
  );
};

export default SearchPage;
