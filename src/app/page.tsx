"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/app/styles/index.module.scss";
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
      <div className={styles.top}>
      <Topbar />
      </div>
      <div className={`${styles.div} ${styles.gray}`}>
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
        </div>
      </div>
      <div className={`${styles.div} ${styles.yellow}`}>
      </div>
      <div className={`${styles.div} ${styles.purple}`}>
        {/* <SlideComponent/> */}
      </div>
      <div className={`${styles.div} ${styles.blue}`}>
      </div>
    </div>
  );
}

export default Index;