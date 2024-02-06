const express = require("express");
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

  const client_id = "60e467fba3aa4b0e94cc77ddaa0e5937"; // your clientId
  const client_secret = "8a878c6477db49b49105c0fcded3084f"; // Your secret
  const redirect_uri = "http://localhost:3000/callback"; // Your redirect uri

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
      secret: "your-secret-key",
      resave: false,
      saveUninitialized: true,
    })
  );
  server.get("/login", function (req, res) {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    const scope =
      "user-read-private user-read-email user-read-playback-state user-modify-playback-state streaming";
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
    // your application requests refresh and access tokens
    // after checking the state parameter

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

  server.get("/refresh_token", function (req, res) {
    const refresh_token = req.query.refresh_token;
    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          new Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      form: {
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        const access_token = body.access_token,
          refresh_token = body.refresh_token;
        res.send({
          access_token: access_token,
          refresh_token: refresh_token,
        });
      }
    });
  });

  server.get("/auth/token", (req, res) => {
    res.json({
      access_token: req.session.access_token || "",
    });
  });

  server.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).send('Logout successful');
      }
    });
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
