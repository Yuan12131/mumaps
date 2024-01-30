/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import styles from "@/app/styles/searchpage.module.scss";
import Topbar from "@/app/components/Topbar";
import Search from "@/app/components/Search";
import axios from "axios";
import { useRouter } from "next/navigation";

interface TrackInfo {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  duration_ms: number;
}

interface Artist {
  id: string;
  name: string;
}

interface Album {
  id: string;
  name: string;
  images: Image[];
}

interface Image {
  url: string;
}

const SearchPage = () => {
  const [query, setQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<TrackInfo[]>([]);
  const router = useRouter();

  const searchSpotify = async (query: string) => {
    try {
      // 클라이언트 ID와 클라이언트 시크릿은 실제 값으로 대체되어야 합니다.
      const clientId = "60e467fba3aa4b0e94cc77ddaa0e5937";
      const clientSecret = "8a878c6477db49b49105c0fcded3084f";

      // Spotify API에 인증 토큰을 요청합니다.
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

      // Spotify API에서 곡을 검색합니다.
      const searchResponse = await axios.get(
        `https://api.spotify.com/v1/search?q=${query}&type=track`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const items = searchResponse.data.tracks.items;

      setSearchResults(items);
      router.push("/search");
      console.log(items);
    } catch (error) {
      console.error("Error searching Spotify:", error);
    }
  };

  const handleSearchComplete = (query: string) => {
    setQuery(query); // 검색 완료 시 검색어 설정
    searchSpotify(query); // Spotify 검색 호출
    console.log("Search completed with query:", query);
  };

  const formatDuration = (durationInMs:number) => {
    const totalSeconds = durationInMs / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.div1}>
        <Topbar />
      </div>
      <div className={styles.div2}>
        <Search onSearchComplete={handleSearchComplete} />
      </div>
      <div className={styles.div3}>
        <ul className={styles.ul}>
          {searchResults.map((track) => (
            <li className={styles.li} key={track.id}>
              <div className={styles.result}>
                <img
                  src={track.album.images[0].url}
                  alt={track.name}
                  style={{ width: "5vw", height: "5vw" }}
                />
                <p>{track.artists[0].name}</p>
                <p>{track.name}</p>
                <p>{track.album.name}</p>
                <p>{formatDuration(track.duration_ms)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchPage;
