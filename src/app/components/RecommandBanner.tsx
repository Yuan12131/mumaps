import React from "react";
import styles from "@/app/styles/recommandbanner.module.scss";
import Link from "next/link";

function RecommandBanner() {
  return (
    <div className={styles.banner}>
      <h2>6가지의 Audio 특징들을 커스텀해서 음악 추천을 즐겨보세요</h2>
      <div>
        <div>
          NEGATIVE
          <input type="range" min="0" max="1" step="0.1" />
          POSITIVE
        </div>
        <div>
          SOFT
          <input type="range" min="0" max="1" step="0.1" />
          POWERFUL
        </div>
      </div>
      <div>
        <div>
          STATIC
          <input type="range" min="0" max="1" step="0.1" />
          DYNAMIC
        </div>
        <div>
          MUSICAL
          <input type="range" min="0" max="1" step="0.1" />
          INSTRUMENTAL
        </div>
      </div>
      <div>
        <div>
          UNPOPULAR
          <input type="range" min="0" max="100" step="1" />
          POPULAR
        </div>
        <div>
          SLOW
          <input type="range" min="60" max="180" step="5" />
          FAST
        </div>
      </div>

      <Link href="/recommand">
        <button type="button">T R Y</button>
      </Link>
    </div>
  );
}

export default RecommandBanner;
