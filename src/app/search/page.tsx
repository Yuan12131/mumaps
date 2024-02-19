"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "@/app/styles/searchpage.module.scss";
import WebPlayback from "../components/Webplayback";
import SearchBar from "../components/SearchBar";
import SearchResult from "../components/SearchResult";
import { TrackInfo } from "../components/utils/trackinfo";
import { getSearchToken, getAccessToken } from "../components/utils/auth";

const SearchPage = () => {
  const [query, setQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<TrackInfo[]>([]);
  const [searchType, setSearchType] = useState<string>("track"); // 초기값은 'track'으로 설정
  const [token, setToken] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<TrackInfo | null>(null);
  const [searchToken, setSearchToken] = useState<string | null>(null);

  useEffect(() => {
    async function getTokens() {
      try {
        const searchToken = await getSearchToken();
        const accessToken = await getAccessToken();
        setToken(accessToken)
        setSearchToken(searchToken);
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

  const handleTrackClick = (track: TrackInfo) => {
    setSelectedTrack(track);
  };

  return (
    <div className={styles.container}>
      <SearchBar
        query={query}
        setQuery={setQuery}
        searchType={searchType}
        setSearchType={setSearchType}
        searchSpotify={searchSpotify}
        clearSearchResults={() => setSearchResults([])}
      />

      <SearchResult
        searchResults={searchResults}
        searchType={searchType}
        handleTrackClick={handleTrackClick}
      />

      {searchType === "track" && selectedTrack && (
        <WebPlayback trackId={selectedTrack.id} token={token} />
      )}
    </div>
  );
};

export default SearchPage;
