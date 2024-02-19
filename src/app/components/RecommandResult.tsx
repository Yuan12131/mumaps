/* eslint-disable @next/next/no-img-element */
import React, { FC } from "react";
import styles from "@/app/styles/recommandresult.module.scss";
import { TrackInfo } from "../../types/trackinfo";
import formatDuration from "../../utils/formatDuration";

interface RecoomandResultProps {
  searchResults: TrackInfo[];
  onTrackClick: (track: TrackInfo) => void;
}

const RecoomandResult: FC<RecoomandResultProps> = ({
  searchResults,
  onTrackClick,
}) => {
  return (
      <div className={styles.gridTable}>
        <div>
        <div>#</div>
        <div></div>
        <div>제목</div>
        <div>아티스트</div>
        <div>앨범</div>
        <div>🕛</div>
        <div></div>
        </div>

        {searchResults.map((track, index) => (
          <div key={track.id}>
            <div>{index + 1}</div>
            <div>
              {track.album.images && track.album.images.length > 0 && (
                <img
                  src={track.album.images[0].url}
                  alt={track.name}
                  style={{ width: "4vw", height: "4vw", }}
                />
              )}
            </div>
            <div>{track.name}</div>
            <div>{track.artists[0].name}</div>
            <div>{track.album.name}</div>
            <div>{formatDuration(track.duration_ms)}</div>
            <div>
              <img
                src="/images/play_circle.svg"
                alt={track.name}
                style={{
                  width: "3vw",
                  height: "3vw",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => onTrackClick(track)}
              />
            </div>
          </div>
        ))}
      </div>
  );
};

export default RecoomandResult;
