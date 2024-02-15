"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/app/styles/topbar.module.scss";

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

  const links = [
    { name: "SEARCH", href: "/search" },
    { name: "RECOMMAND", href: "/algorithm" },
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