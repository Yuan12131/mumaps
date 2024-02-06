"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/app/styles/topbar.module.scss";

const links = [
  { name: "SEARCH", href: "/search" },
  { name: "PLAYLIST", href: "/algorithm" },
  { name: "MAP", href: "/map" },
];

function Topbar() {
  const [token, setToken] = useState("");

  useEffect(() => {
    async function getToken() {
      try {
        const response = await fetch("/auth/token");
        const json = await response.json();

        if (json.access_token) {
          // 토큰이 존재할 경우에만 상태를 업데이트합니다.
          setToken(json.access_token);
        } else {
          console.error("토큰이 비어 있습니다.");
        }
      } catch (error) {
        console.error("토큰을 가져오는 도중 오류가 발생했습니다.", error);
      }
    }

    getToken();
  }, []);

  return (
    <div className={styles.topbar}>
      <div className={styles.div1}>
        {links.map((link) => (
          <Link key={link.name} href={link.href}>
            <p className={styles.linkname}>{link.name}</p>
          </Link>
        ))}
      </div>

      <div className={styles.div2}>
        <Link href="/">MUMAPS</Link>
      </div>

      <div className={styles.div3}>
        {token === "" ? (
          <Link href="/login">login</Link>
        ) : (
          <>
            <button className={styles.link}>LOGOUT</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Topbar;
