"use client"

import React, { useState, FormEvent } from 'react';
import { useRouter } from "next/navigation";
import styles from "@/app/styles/search.module.scss";

interface SearchProps {
  onSearchComplete: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearchComplete }) => {
  const [query, setQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<string>('track'); // 초기값은 'track'으로 설정

  const router = useRouter();

  const handleSearch = async (e: FormEvent, searchType: string) => {
    e.preventDefault();
    onSearchComplete(query, searchType); // 검색 완료 시 부모 컴포넌트로 검색어와 검색 유형 전달
    router.push(`/search?q=${encodeURIComponent(query)}&type=${searchType}`);
  };
  };

  return (
    <form onSubmit={handleSearch} className={styles.form}>
      <div className={styles.btndiv}>
      <button onClick={() => setSearchType('track')} value="track">TRACK</button>
      <button onClick={() => setSearchType('artist')} value="artist">ARTIST</button>
      <button onClick={() => setSearchType('album')} value="album">ALBUM</button>
      </div>
      <label htmlFor="searchInput">🔍</label>
      <input
        type="text"
        id="searchInput"
        placeholder="듣고싶은 곡을 검색하세요"
        className={styles.search}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
};

export default Search;
