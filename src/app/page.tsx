"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/app/styles/main.module.scss";
import Topbar from "@/app/components/Topbar";
import Search from "@/app/components/Search";

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
          <button>지금 바로 시작하기</button>
          </Link>
        </div>
      </div>

      <div className={styles.banner2}>

        <Search/>
      </div>
      <div className={styles.banner3}>
      </div>
      <div className={styles.banner4}>
      </div>
      <div className={styles.banner5}>
      </div>
    </div>
  );
}

export default Index;