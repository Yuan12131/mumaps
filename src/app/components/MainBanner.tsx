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
      {hasWindow && (
        <video
          className={styles.video}
          autoPlay={true}
          muted={true}
          loop={true}
          src={require("../../../public/video.mp4")}
        />
      )}
      <div>
        나만의 취향으로 만드는 <br></br>나만의 플레이어<br></br>
        <Link href={`/search`}>
          <button>T R Y </button>
        </Link>
      </div>
    </div>
  );
}

export default MainBanner;
