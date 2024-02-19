/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "@/app/styles/searchresult.module.scss";
import formatDuration from "../../utils/formatDuration";
import { TrackInfo } from "../../types/trackinfo";

interface SearchResultsProps {
  searchResults: TrackInfo[];
  searchType: string;
  handleTrackClick: (track: TrackInfo) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchResults,
  searchType,
  handleTrackClick,
}) => {
  
  return (
    <div className={styles.result}>
      {searchType === "track" && (
        <div className={styles.trackResult}>
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
                {track.album &&
                  track.album.images &&
                  track.album.images.length > 0 && (
                    <img
                      src={track.album.images[0].url}
                      alt={track.name}
                      style={{
                        width: "4vw",
                        height: "4vw",
                        borderRadius: "2px",
                      }}
                    />
                  )}
              </div>
              <div>{track.name}</div>
              <div>
                {track.artists && track.artists.length > 0
                  ? track.artists.map((artist) => artist.name).join(", ")
                  : ""}
              </div>
              <div>{track.album && track.album.name}</div>
              <div>{formatDuration(track.duration_ms)}</div>
              <div>
                <img
                  src="/images/play_circle.svg"
                  alt={track.name}
                  style={{
                    width: "3vw",
                    height: "3vw",
                    cursor: "pointer",
                  }}
                  onClick={() => handleTrackClick(track)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {searchType === "artist" && (
        <div className={styles.artistResults}>
          {searchResults.map((artist) => (
            <div key={artist.id}>
              <a
                href={artist.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.name}
              >
                {artist.images && artist.images.length > 0 && (
                  <img
                    src={artist.images[0].url}
                    alt={artist.name}
                    style={{
                      width: "10vw",
                      height: "10vw",
                      borderRadius: "10vw",
                    }}
                  />
                )}
              </a>
              <p>{artist.name}</p>
              <p>artist</p>
            </div>
          ))}
        </div>
      )}

      {searchType === "album" && (
        <div className={styles.albumResults}>
          {searchResults.map((album) => (
            <div key={album.id}>
              <a
                href={album.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.name}
              >
                {album.images && album.images.length > 0 && (
                  <img
                    src={album.images[0].url}
                    alt={album.name}
                    style={{
                      width: "12vw",
                      height: "12vw",
                      borderRadius: "10px",
                    }}
                  />
                )}
              </a>
              <p>{album.name}</p>
              <p>
                {new Date(album.release_date).getFullYear()}{" "}
                {album.artists[0].name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
