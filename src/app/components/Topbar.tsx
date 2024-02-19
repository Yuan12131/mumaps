"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/app/styles/topbar.module.scss";
import { getAccessToken } from "../../utils/auth";

function Topbar() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function getTokens() {
      try {
        const accessToken = await getAccessToken();

        setToken(accessToken);
      } catch (error) {
        console.error("토큰을 가져오는 도중 오류가 발생했습니다.", error);
      }
    }

    getTokens();
  }, []);

  const links = [
    { name: "SEARCH", href: "/search" },
    { name: "RECOMMAND", href: "/recommand" },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch("/logout");
  
      if (response.ok) {
        setToken(null);
  
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className={styles.topbar}>
      <div>
        {links.map((link) => (
          <Link key={link.name} href={link.href}>
            <p>{link.name}</p>
          </Link>
        ))}
      </div>

      <div>
        <Link href="/">MUMUS</Link>
      </div>

      <div>
        {token == null ? (
          <Link href="/login">
            <button className={styles.login} >LOGIN</button>
          </Link>
        ) : (
          <button onClick={handleLogout}>LOGOUT</button>
        )}
      </div>
    </div>
  );
}

export default Topbar;