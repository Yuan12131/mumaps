/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import styles from "@/app/styles/mainbanner.module.scss";
import Link from "next/link";

function MainBanner() {
  const [hasWindow, setHasWindow] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, [hasWindow]);

  return (
    <div className={styles.banner}>
        <img
          className={styles.img}
          alt="play.jpg"
          src={"/play.jpg"}
        />
      <div>
        나만의 취향으로 만드는 <br></br>나만의 플레이어<br></br>
        <Link href={`/search`}>
          <button>SEARCH</button>
        </Link>
        <Link href={`/recommand`}>
          <button>RECOMMAND</button>
        </Link>
      </div>
    </div>
  );
}

export default MainBanner;
