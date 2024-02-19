export interface TrackInfo {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  images: Image[];
  duration_ms: number;
  release_date: string;
  spotify: string;
  external_urls: {
    spotify: string;
  };
}

export interface Artist {
  id: string;
  images: Image[];
  name: string;
}

export interface Album {
  id: string;
  images: Image[];
  name: string;
}

export interface Image {
  url: string;
}