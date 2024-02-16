import React from "react";
import styles from "@/app/styles/recommandbanner.module.scss";
import Link from "next/link";

function RecommandBanner() {
  return (
    <div className={styles.banner}>
      <h2>6가지의 Audio 특징들을 커스텀해서 음악 추천을 즐겨보세요</h2>
      <div>
        <div>
          <span>NEGATIVE</span>
          <input type="range" min="0" max="1" step="0.1" />
          <span>POSITIVE</span>
        </div>
        <div>
          <span>SOFT</span>
          <input type="range" min="0" max="1" step="0.1" />
          <span>POWERFUL</span>
        </div>
      </div>
      <div>
        <div>
          <span>STATIC</span>
          <input type="range" min="0" max="1" step="0.1" />
          <span>DYNAMIC</span>
        </div>
        <div>
          <span>MUSICAL</span>
          <input type="range" min="0" max="1" step="0.1" />
          <span>INSTRUMENTAL</span>
        </div>
      </div>
      <div>
        <div>
          <span>UNPOPULAR</span>
          <input type="range" min="0" max="100" step="1" />
          <span>POPULAR</span>
        </div>
        <div>
          <span>SLOW</span>
          <input type="range" min="60" max="180" step="5" />
          <span>FAST</span>
        </div>
      </div>

      <Link href="/algorithm">
        <button type="button">T R Y</button>
      </Link>
    </div>
  );
}

export default RecommandBanner;
