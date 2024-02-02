"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/app/styles/topbar.module.scss";
import jwt, { JwtPayload } from "jsonwebtoken";
import { useRouter } from "next/navigation";

const links = [
  { name: "SEARCH", href: "/search" },
  { name: "PLAYLIST", href: "/algorithm" },
  { name: "MAP", href: "/map" },
];


function Topbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState<string | JwtPayload>("");
  const [spotifyToken, setSpotifyToken] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const loadUserFromToken = async () => {
      const token = localStorage.getItem("token");
  
      if (token) {
        const decodedToken = jwt.decode(token) as JwtPayload;
  
        if (decodedToken) {
          const spotifyToken = getCookie("access_token");
          setIsLoggedIn(true);
  
          // 서버에 토큰 유효성 검사 요청 보내기
          const response = await fetch("/api/checkToken");  // 수정된 부분: "/api" 경로 추가
          const { valid } = await response.json();
  
          if (!valid) {
            // 토큰이 유효하지 않으면 로그아웃 처리
            alert('로그인해주세요');
          }
        }
      } else {
        setIsLoggedIn(false);
        setName("");
      }
  
      // 쿠키에서 스포티파이 토큰을 가져옴
      setSpotifyToken(spotifyToken);
    };
  
    loadUserFromToken();
  }, []);
  


const handleLogout = async () => {
  try {
    // 서버의 /logout 엔드포인트로 로그아웃 요청 보내기
    const response = await fetch("/logout");

    if (response.ok) {
      // 로그아웃 성공 시 클라이언트 상태 업데이트
      localStorage.removeItem("token");
      document.cookie = "spotifyToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setIsLoggedIn(false);
      setName("");
      setSpotifyToken(null);

      window.location.href = "/";
    } else {
      console.error("Logout failed");
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
};
  // 쿠키에서 값을 가져오는 함수
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
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
        {isLoggedIn || spotifyToken ? (
          <>
            <button className={styles.link} onClick={handleLogout}>
              LOGOUT
            </button>
          </>
        ) : (
          <>
            <Link href="/login">login</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Topbar;
