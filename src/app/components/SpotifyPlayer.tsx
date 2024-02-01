import styles from '@/app/styles/player.module.scss';
import { getCookie } from 'cookies-next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import api from './api';
import { loginDataState } from './atoms';
import ProgressBar from './ProgressBar';
import VolumeBar from './VolumeBar';
import { get } from 'http';

const SpotifyPlayer = () => {
  const [is_paused, setPaused] = useState(true);
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [current_track, setTrack] = useState<Spotify.Track | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const [volume, setVolume] = useState(0);

  const loginData = useRecoilValue(loginDataState);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'player',
        getOAuthToken: (cb) => {
          cb(getCookie('spotifyToken') as string);
          console.log(getCookie('spotifyToken') as string);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);

        api.put('https://api.spotify.com/v1/me/player', {
          device_ids: [device_id],
        });

        player.getVolume().then((volume) => {
          console.log('Volume of device is', volume);
          setVolume(volume);
        });
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.addListener('player_state_changed', (state) => {
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
          console.log('The Web Playback SDK successfully connected to Spotify!');
        }
      });
      player.addListener('initialization_error', ({ message }) => {
        console.log(message);
      });

      player.addListener('authentication_error', ({ message }) => {
        console.log(message);
      });

      player.addListener('account_error', ({ message }) => {
        console.log(message);
      });
    };
  }, [loginData]);

  return (
    <div className={styles.container}>
      {current_track ? (
        <div className={styles.trackWrapper}>
          <Image src={current_track.album.images[0].url} alt="album" width={64} height={64} />
          <div>
            <p className={styles.trackName}>{current_track.name}</p>
            <p className={styles.trackArtist}>{current_track.artists[0].name}</p>
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
            src={`/images/${is_paused ? 'play' : 'pause'}_circle.svg`}
            alt={is_paused ? 'play' : 'pause'}
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
};

export default SpotifyPlayer;