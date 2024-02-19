const express = require("express");
const axios = require("axios");
const next = require("next");
const request = require("request");
const crypto = require("crypto");
const cors = require("cors");
const querystring = require("querystring");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();

  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
  const session_secret = process.env.SESSION_SECRET;

  const generateRandomString = (length) => {
    return crypto.randomBytes(60).toString("hex").slice(0, length);
  };

  const stateKey = "spotify_auth_state";

  server
    .use(express.static(__dirname + "/public"))
    .use(cors())
    .use(cookieParser());

  server.use(
    session({
      secret: session_secret,
      resave: false,
      saveUninitialized: true,
    })
  );

  server.get("/login", function (req, res) {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    const scope =
      "user-read-private user-read-playback-state user-modify-playback-state streaming app-remote-control user-read-currently-playing";
    res.redirect(
      "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
          response_type: "code",
          client_id: client_id,
          scope: scope,
          redirect_uri: redirect_uri,
          state: state,
        })
    );
  });

  server.get("/callback", function (req, res) {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
      res.redirect(
        "/#" +
          querystring.stringify({
            error: "state_mismatch",
          })
      );
    } else {
      res.clearCookie(stateKey);
      const authOptions = {
        url: "https://accounts.spotify.com/api/token",
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: "authorization_code",
        },
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            new Buffer.from(client_id + ":" + client_secret).toString("base64"),
        },
        json: true,
      };

      request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          const access_token = body.access_token,
            refresh_token = body.refresh_token;
          // 세션에 access_token 저장
          req.session.access_token = access_token;
          const options = {
            url: "https://api.spotify.com/v1/me",
            headers: { Authorization: "Bearer " + access_token },
            json: true,
          };

          request.get(options, function (error, response, body) {
            console.log(body);
          });

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

  // 주기적으로 액세스 토큰을 갱신하는 함수
const refreshAccessToken = async () => {
  try {
    const authResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      null,
      {
        params: {
          grant_type: "client_credentials",
        },
        auth: {
          username: client_id,
          password: client_secret,
        },
      }
    );

    accessToken = authResponse.data.access_token;
    console.log("Access token refreshed:", new Date());
  } catch (error) {
    console.error("Error refreshing access token:", error);
  }
};

  setInterval(refreshAccessToken, 60 * 60 * 1000); // 1시간마다 실행

  
  server.get("/auth/token", (req, res) => {
    res.json({
      access_token: req.session.access_token || "",
    });
  });

  server.get("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        res.status(500).send("Internal Server Error");
      } else {
        res.status(200).send("Logout successful");
      }
    });
  });

  // 클라이언트에서 검색 토큰 요청 시 처리
  server.get("/auth/searchToken", async (req, res) => {
    try {
      const authResponse = await axios.post(
        "https://accounts.spotify.com/api/token",
        null,
        {
          params: {
            grant_type: "client_credentials",
          },
          auth: {
            username: client_id,
            password: client_secret,
          },
        }
      );

      const searchToken = authResponse.data.access_token;

      // 검색 토큰을 클라이언트에 응답
      res.json({ access_token: searchToken });
    } catch (error) {
      console.error("Error generating search token:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
