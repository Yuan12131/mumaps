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
  const [token, setToken] = useState<string | null>(null);

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

  const handleLogout = async () => {
    try {
      // 서버의 /logout 엔드포인트로 로그아웃 요청 보내기
      const response = await fetch("/logout");
  
      if (response.ok) {
        // 로그아웃 성공 시 클라이언트 상태 업데이트
        setToken(null);
  
        window.location.href = "/";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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
      {token == null ? (
          <Link href="/login">login</Link>
        ) : (
          <>
            <button className={styles.link} onClick={handleLogout}>LOGOUT</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Topbar;
