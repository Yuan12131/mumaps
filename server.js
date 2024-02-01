const express = require("express");
const next = require("next");
const bodyParser = require("body-parser");
const axios = require("axios");
const request = require('request');
const crypto = require('crypto');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const querystring = require("querystring");
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();

  // 임의의 문자열 생성 함수 (실제로는 더 강력한 방법을 사용해야 함)
  const generateRandomString = (length) => {
    return crypto
    .randomBytes(60)
    .toString('hex')
    .slice(0, length);
  }

  const stateKey = 'spotify_auth_state';

  const clientId = "60e467fba3aa4b0e94cc77ddaa0e5937";
  const clientSecret = "8a878c6477db49b49105c0fcded3084f";
  const redirectUri = "http://localhost:3000/callback";

  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.json());
  server.use(cookieParser());

  server.get("/login", function (req, res) {
    // 생성된 'state'를 'spotify_auth_state'라는 이름의 쿠키에 저장 (CSRF공격을 방지하기 위해 사용)
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    // 사용자에게 요청할 권한(scope)을 정의합니다.
    const scope = "user-read-private user-read-email";

    // 사용자를 Spotify 인증 URL로 보냄
    res.redirect(
      "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
          response_type: "code", // 인증 코드 플로우를 지정합니다.
          client_id: clientId,
          scope: scope, //권한
          redirect_uri: redirectUri,
          state: state, //보안을 위해 생성된 랜덤 state
        })
    );
  });

  server.get("/callback", function (req, res) {
    // your application requests refresh and access tokens
    // after checking the state parameter

    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
      res.redirect(
        "/#" +
          querystring.stringify({
            error: "state_mismatch",
          })
      );
    } else {
      res.clearCookie(stateKey);
      var authOptions = {
        url: "https://accounts.spotify.com/api/token",
        form: {
          code: code,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        },
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            new Buffer.from(clientId + ":" + clientSecret).toString("base64"),
        },
        json: true,
      };

      request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          var access_token = body.access_token,
            refresh_token = body.refresh_token;

          var options = {
            url: "https://api.spotify.com/v1/me",
            headers: { Authorization: "Bearer " + access_token },
            json: true,
          };

          // use the access token to access the Spotify Web API
          request.get(options, function (error, response, body) {
            console.log(body);
          });

          // we can also pass the token to the browser to make requests from there
          res.redirect(
            "/#" +
              querystring.stringify({
                access_token: access_token,
                refresh_token: refresh_token,
              })
          );
        } else {
          res.redirect(
            "/#" +
              querystring.stringify({
                error: "invalid_token",
              })
          );
        }
      });
    }
  });

  // 음악 재생 API 엔드포인트 수정
  server.get("/play-music/:trackId", async (req, res) => {
    try {
      // 사용자가 로그인되어 있는지 확인
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      // 사용자의 Spotify 토큰 가져오기
      const spotifyToken = req.user.accessToken;

      // 클라이언트에서 전달한 트랙 ID
      const trackId = req.params.trackId;

      // Spotify Web API 엔드포인트 및 토큰 정보 (실제로는 안전한 방법으로 관리해야 함)
      const spotifyApiEndpoint = "https://api.spotify.com/v1/me/player/play";

      // 트랙 재생을 위한 요청 데이터
      const requestData = {
        uris: [trackId],
      };

      // Spotify Web API에 PUT 요청 보내기
      await axios({
        method: "put",
        url: spotifyApiEndpoint,
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
          "Content-Type": "application/json",
        },
        data: requestData,
      });

      res.json({ success: true, message: "Track is playing!" });
    } catch (error) {
      console.error("Error playing track:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // 기본적인 Next.js 페이지 핸들링
  server.get("*", (req, res) => {
    return handle(req, res);
  });

  // Spotify API에서 인증 토큰을 얻는 엔드포인트
  server.post("/getSpotifyToken", async (req, res) => {
    try {
      const tokenResponse = await axios.post(
        "https://accounts.spotify.com/api/token",
        "grant_type=client_credentials",
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${clientId}:${clientSecret}`
            ).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      res.json({ accessToken: tokenResponse.data.access_token });
    } catch (error) {
      console.error("Error getting Spotify token:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  server.post("/searchSpotify", async (req, res) => {
    try {
      const { query, type } = req.body; // 클라이언트로부터 검색어와 검색 유형을 받음

      const tokenResponse = await axios.post(
        "http://localhost:3000/getSpotifyToken",
        "grant_type=client_credentials",
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      );

      const accessToken = tokenResponse.data.accessToken;

      const searchResponse = await axios.get(
        `https://api.spotify.com/v1/search?q=${query}&type=${type}&sort=popularity`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      res.json({ searchResults: searchResponse.data.tracks.items });
    } catch (error) {
      console.error("Error searching Spotify:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

