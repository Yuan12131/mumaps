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
          나만의 취향으로 만드는 <br></br>나만의 플레이리스트<br></br>
          <Link href={`/algorithm`}>
            <button className={styles.try}>지금 바로 시작하기</button>
          </Link>
        </div>
      </div>

      <div className={styles.banner6}>
      </div>
      <div className={styles.banner2}>
        <Link href="/search">
          <div className={styles.form}>🔍 지금 바로 Spotify에 검색하기</div>
        </Link>
      </div>
      <div className={styles.banner3}>
        <Link href="/algorithm">
          <img
            src="/images/Group 1.svg"
            alt="fd"
            style={{ width: "80vw", height: "80vh", marginLeft: "10vw" }}
          />
        </Link>
      </div>
      <div className={styles.banner4}>
        <Link href="/map">
          <img
            src="/images/map.jpg"
            alt="fd"
            style={{ width: "100vw", height: "80vh" }}
          />
        </Link>
      </div>
      <div className={styles.banner5}>
        <div className={styles.name}>MUMAPS</div>
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
