/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef } from "react";
import ProgressBar from "./ProgressBar";
import styles from "@/app/styles/player.module.scss";

const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },      
  artists: [{ name: "" }],
};

function WebPlayback(props: { token: string | null; trackId: string }) {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [is_paused, setPaused] = useState(false);
  const [current_track, setTrack] = useState(track);
  const [duration, setDuration] = useState(1);
  const [position, setPosition] = useState(0);
  const previousDeviceIdRef = useRef<string | null>(null);
  

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = async () => {
      const player = new window.Spotify.Player({
        name: "MUMAPS",
        getOAuthToken: (cb) => {
          cb(props.token);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", async ({ device_id }) => {
        // 이전 트랙이 있다면 정리
        player.removeListener("ready");

        // 새로운 트랙을 재생
        const trackId = props.trackId;
        const response = await fetch(
          `https://api.spotify.com/v1/me/player/play`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${props.token}`,
            },
            body: JSON.stringify({
              uris: [`spotify:track:${trackId}`],
              device_id: device_id,
            }),
          }
        );
      
        if (response.ok) {
          console.log("Track played successfully");
        } else {
          console.error("Failed to play track:", response.statusText);
        alert('Spotify 디바이스에 MUMAPS를 연결하고 다시 재생해주세요.')
        }
      
        // 디바이스 아이디 저장
        previousDeviceIdRef.current = device_id;
      });
      
      

      player.addListener("player_state_changed", (state) => {
        setTrack(state.track_window.current_track);
        setPaused(state.paused);
        setPosition(state.position);
        setDuration(state.duration);
      });

      player.connect().then((success) => {
        if (success) {
          console.log(
            "The Web Playback SDK successfully connected to Spotify!"
          );
        }
      });

      player.addListener("authentication_error", ({ message }) => {
        console.log(message);
        alert("스포티파이 로그인 후 이용해주세요");
        window.location.href = "/login";
      });
    };

    previousDeviceIdRef.current = null;
  }, [props.token, props.trackId]);

  return (
    <div className={styles.container}>
      {current_track ? (
        <div className={styles.trackWrapper}>
          <img
            src={current_track.album.images[0].url}
            alt="album"
            width={50}
            height={50}
          />
          <div>
            <p className={styles.trackName}>{current_track.name}</p>
            <p className={styles.trackArtist}>
              {current_track.artists[0].name}
            </p>
          </div>
        </div>
      ) : (
        <div className={styles.trackWrapper}>
          <div className={styles.trackWrapperDiv}></div>
          <div></div>
        </div>
      )}
      <div className={styles.control}>
        <ProgressBar
          is_paused={is_paused}
          position={position}
          setPosition={setPosition}
          duration={duration}
          onSeek={(position) => {
            player?.seek(position);
            setPosition(position);
          }}
        />
      </div>
    </div>
  );
}

export default WebPlayback;
