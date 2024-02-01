"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/app/styles/topbar.module.scss";
import jwt, { JwtPayload } from "jsonwebtoken";
import LoginButton from "./Login";
import { useRouter } from "next/navigation";

const links = [
  { name: "Search", href: "/search" },
  { name: "Algorithm", href: "/algorithm" },
  { name: "Map", href: "/map" },
];

function Topbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState<string | JwtPayload>("");

  useEffect(() => {
    const loadUserFromToken = () => {
      const token = localStorage.getItem("token");

      if (token) {
        const decodedToken = jwt.decode(token) as JwtPayload;

        if (decodedToken) {
          const userName = decodedToken.name;
          setIsLoggedIn(true);
          setName(userName);
        }
      } else {
        setIsLoggedIn(false);
        setName("");
      }
    };

    loadUserFromToken();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setName("");
    window.location.href = "/";
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
        {isLoggedIn ? (
          <>
            <p>{`${name} 님`}</p>
            <Link href="/mypage/myinfo">MYPAGE</Link>
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
