"use client"

import React, { useState, FormEvent } from 'react';
import { useRouter } from "next/navigation";
import styles from "@/app/styles/search.module.scss";

interface SearchProps {
  onSearchComplete: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearchComplete }) => {
  const [query, setQuery] = useState<string>('');
  const router = useRouter();

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    onSearchComplete(query); // 검색 완료 시 부모 컴포넌트로 검색어 전달
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSearch} className={styles.form}>
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
