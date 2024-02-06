import React, { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import VolumeBar from "./VolumeBar";
import styles from "@/app/styles/player.module.scss";
import Image from 'next/image';

const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};

function WebPlayback(props: { token: string }) {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState(track);
  const [duration, setDuration] = useState(1);
  const [position, setPosition] = useState(0);
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(props.token);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }
        console.log(state);
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
    };
  }, [props.token]);

  return (
    <div className={styles.container}>
      {current_track ? (
        <div className={styles.trackWrapper}>
          <Image
            src={current_track.album.images[0].url}
            alt="album"
            width={64}
            height={64}
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
        <div className={styles.playback}>
          <Image
            src="/images/prev_song_arrow.svg"
            alt="previous"
            width={36}
            height={36}
            onClick={() => {
              player?.previousTrack();
              setPosition(0);
            }}
          />
          <Image
            src={`/images/${is_paused ? "play" : "pause"}_circle.svg`}
            alt={is_paused ? "play" : "pause"}
            width={36}
            height={36}
            onClick={() => player?.togglePlay()}
          />
          <Image
            src="/images/next_song_arrow.svg"
            alt="next"
            width={36}
            height={36}
            onClick={() => {
              player?.nextTrack();
              setPosition(0);
            }}
          />
        </div>
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
      <div className={styles.option}>
        <VolumeBar
          volume={volume}
          onSeek={() => {
            player?.setVolume(volume);
            setVolume(volume);
          }}
        />
      </div>
    </div>
  );
}

export default WebPlayback;