/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/app/styles/main.module.scss";
import Topbar from "@/app/components/Topbar";

interface DataItem {
  name: string;
  price: number;
  week: number;
  Subs_Index: number;
  imageUrl: string;
}

function Index() {
  const [hasWindow, setHasWindow] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, [hasWindow]);

  return (
    <div className={styles.container}>
      <div className={styles.banner1}>
        <Topbar />
        {hasWindow && (
          <video
            className={styles.video}
            autoPlay={true}
            muted={true}
            loop={true}
            src={require("../../public/video.mp4")}
          />
        )}
        <div className={styles.box1}>
          나만의 취향으로 만드는 <br></br>나만의 플레이어<br></br>
          <Link href={`/search`}>
            <button className={styles.try}>T R Y </button>
          </Link>
        </div>
      </div>

      <div className={styles.banner6}></div>
      <div className={styles.banner2}>
        <Link href="/search">
          <div className={styles.form}>🔍 지금 바로 Spotify에 검색하기</div>
        </Link>
      </div>
      <div className={styles.banner3}>
        <h2>세분화된 음악 특징을 기반으로 한 맞춤형 음악 추천을 즐겨보세요</h2>
        <div className={styles.sliderContainer}>
          <div className={styles.slider}>
            <span>NEGATIVE</span>
            <input type="range" min="0" max="1" step="0.1" />
            <span>POSITIVE</span>
          </div>
          <div className={styles.slider}>
            <span>SOFT</span>
            <input type="range" min="0" max="1" step="0.1" />
            <span>POWERFUL</span>
          </div>
        </div>
        <div  className={styles.sliderContainer}>
          <div className={styles.slider}>
            <span>STATIC</span>
            <input type="range" min="0" max="1" step="0.1" />
            <span>DYNAMIC</span>
          </div>
          <div className={styles.slider}>
            <span>MUSICAL</span>
            <input type="range" min="0" max="1" step="0.1" />
            <span>INSTRUMENTAL</span>
          </div>
        </div>
        <div  className={styles.sliderContainer}>
          <div className={styles.slider}>
            <span>UNPOPULAR</span>
            <input type="range" min="0" max="100" step="1" />
            <span>POPULAR</span>
          </div>
          <div className={styles.slider}>
            <span>SLOW</span>
            <input type="range" min="60" max="180" step="5" />
            <span>FAST</span>
          </div>
        </div>

        <Link href="/algorithm">
          <button className={styles.go} type="button">
          T R Y
          </button>
        </Link>
      </div>
      <div className={styles.banner5}>
        <div className={styles.name}>MUMUS</div>
        <div className={styles.info}>
          <p>이용약관 l 개인정보처리방침</p>
          <p>CEO : 그린</p>
          <p>H.P : 070-3232-3232</p>
          <p>FAX : +82-02-3232-3233</p>
          <p>ADDRESS : 대전광역시 서구 대덕대로</p>
          <p>ⓒ 2023 MK. All rights reserved</p>
        </div>
      </div>
    </div>
  );
}

export default Index;
