import React from "react";
import styles from "@/app/styles/searchbanner.module.scss";
import Link from "next/link";

function SearchBanner() {


  return (
          <div className={styles.banner}>
        <Link href="/search">
          <div>🔍 지금 바로 Spotify에 검색하기</div>
        </Link>
      </div>
  );
}

export default SearchBanner;
