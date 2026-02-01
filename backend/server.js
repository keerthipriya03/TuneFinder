import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
app.use(cors());
dotenv.config();

const PORT = process.env.PORT || 3000;

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;


// 🔑 Get Spotify access token
async function getAccessToken() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  return data.access_token;
}

// 🔍 Search route
app.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    const token = await getAccessToken();

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${query}&type=track&limit=12`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    // ✅ CREATE songsArray (THIS WAS MISSING)
    const songsArray = data.tracks.items.map(track => ({
      id: track.id,
      title: track.name,
      artist: track.artists[0].name,
      image: track.album.images[0]?.url,
      preview: track.preview_url,
    }));

    // ✅ Send simplified array
    res.json(songsArray);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch songs" });
  }
});

app.listen(PORT, () =>
  console.log(`✅ Backend running on http://localhost:${PORT}`)
);

