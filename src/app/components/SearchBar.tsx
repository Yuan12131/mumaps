import React, { FormEvent, useState } from "react";
import styles from "@/app/styles/searchbar.module.scss";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  searchType: string;
  setSearchType: (searchType: string) => void;
  searchSpotify: (query: string, searchType: string) => void;
  clearSearchResults: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, searchType, setSearchType, searchSpotify, clearSearchResults }) => {
  const [isActive, setIsActive] = useState(false);

  const onClick = (selectedType: string) => {
    setSearchType(selectedType);
    setIsActive(true);
    clearSearchResults();
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    searchSpotify(query, searchType);
  };

  return (
    <div className={styles.search}>
      <form onSubmit={onSubmit}>
        <div>
          <button
            type="button"
            value="track"
            onClick={() => onClick("track")}
            className={searchType === "track" && isActive ? styles.active : ""}
          >
            TRACK
          </button>
          <button
            type="button"
            value="artist"
            onClick={() => onClick("artist")}
            className={searchType === "artist" && isActive ? styles.active : ""}
          >
            ARTIST
          </button>
          <button
            type="button"
            value="album"
            onClick={() => onClick("album")}
            className={searchType === "album" && isActive ? styles.active : ""}
          >
            ALBUM
          </button>
        </div>
        <input
          type="text"
          id="searchInput"
          placeholder=" 듣고싶은 곡을 검색하세요"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
    </div>
  );
};

export default SearchBar;
