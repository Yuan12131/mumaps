import React, { useState, FC, FormEvent } from "react";
import styles from "@/app/styles/recommandbar.module.scss";

interface RecommandBarProps {
  valence: number;
  energy: number;
  danceability: number;
  instrumentalness: number;
  popularity: number;
  tempo: number;
  onSubmit: (
    e: FormEvent,
    valence: number,
    energy: number,
    danceability: number,
    instrumentalness: number,
    popularity: number,
    tempo: number
  ) => void;
}

const RecommandBar: FC<RecommandBarProps> = ({ onSubmit }) => {
  const [valence, setValence] = useState<number>(0.5);
  const [danceability, setDanceability] = useState<number>(0.5);
  const [energy, setEnergy] = useState<number>(0.5);
  const [instrumentalness, setInstrumentalness] = useState<number>(0.5);
  const [tempo, setTempo] = useState<number>(120);
  const [popularity, setPopularity] = useState<number>(50);

  return (
    <>
      <div className={styles.slider}>
        NEGATIVE
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={valence}
          onChange={(e) => setValence(parseFloat(e.target.value))}
        />
        POSITIVE
      </div>
      <div className={styles.slider}>
        SOFT
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={energy}
          onChange={(e) => setEnergy(parseFloat(e.target.value))}
        />
        POWERFUL
      </div>
      <div className={styles.slider}>
        STATIC
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={danceability}
          onChange={(e) => setDanceability(parseFloat(e.target.value))}
        />
        DYNAMIC
      </div>
      <div className={styles.slider}>
        MUSICAL
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={instrumentalness}
          onChange={(e) => setInstrumentalness(parseFloat(e.target.value))}
        />
        INSTRUMENTAL
      </div>
      <div className={styles.slider}>
        UNPOPULAR
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={popularity}
          onChange={(e) => setPopularity(parseFloat(e.target.value))}
        />
        POPULAR
      </div>
      <div className={styles.slider}>
        SLOW
        <input
          type="range"
          min="60"
          max="180"
          step="5"
          value={tempo}
          onChange={(e) => setTempo(parseFloat(e.target.value))}
        />
        FAST
      </div>
      <div className={styles.go}>
        <button
          type="button"
          onClick={(e) =>
            onSubmit(
              e,
              valence,
              energy,
              danceability,
              instrumentalness,
              popularity,
              tempo
            )
          }
        >
          GO
        </button>
      </div>
    </>
  );
};

export default RecommandBar;
