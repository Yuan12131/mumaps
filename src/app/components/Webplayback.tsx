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
  const [showInfoMessage, setShowInfoMessage] = useState(false);
  const previousDeviceIdRef = useRef<string | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = async () => {
      const player = new window.Spotify.Player({
        name: "MUMUS",
        getOAuthToken: (cb) => {
          cb(props.token as string);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", async ({ device_id }) => {
        player.removeListener("ready");

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
        }

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
        window.location.href = "/login";
      });
    };

    previousDeviceIdRef.current = null;
  }, [props.token, props.trackId]);

  const handleInfoButtonClick = () => {
    setShowInfoMessage(true);
  };

  const handleInfoCloseClick = () => {
    setShowInfoMessage(false);
  };

  return (
    <div className={styles.container}>
      <div>
        <img
          src={current_track.album.images[0].url}
          alt="album"
          width={50}
          height={50}
        />
        <div>
          <p>{current_track.name}</p>
          <p>{current_track.artists[0].name}</p>
        </div>
      </div>
      <div>
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
      <button onClick={handleInfoButtonClick}>?</button>
      {showInfoMessage && (
        <div>
          <p>Spotify에서 MUMUS 디바이스를 연결해야 재생됩니다.</p>
          <button onClick={handleInfoCloseClick}>X</button>
        </div>
      )}
    </div>
  );
}

export default WebPlayback;
