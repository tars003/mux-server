require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const Mux = require("@mux/mux-node");
const { Video } = new Mux(
  'af3a8cf4-611e-411b-948b-971936aa3f12',
  'Q5cfbnAvzcTpD3kxDrJnyakfvcd0t/2J1ORKpt6IsDx7CZMk3E+a0Bu1o6oyx3nnrBuWPKvCnmJ'
);
const app = express();
const port = process.env.PORT;

var jsonParser = bodyParser.json();

app.post("/assets", jsonParser, async (req, res) => {
  console.log("BODY: " + req.body.videoUrl);

  const asset = await Video.Assets.create({
    input: req.body.videoUrl,
    playback_policy: "public",
  });

  res.json({
    data: {
      id: asset.id,
      status: asset.status,
      playback_ids: asset.playback_ids,
      created_at: asset.created_at,
    },
  });
});

app.get("/assets", async (req, res) => {
  const assets = await Video.Assets.list();

  res.json({
    data: assets.map((asset) => ({
      id: asset.id,
      status: asset.status,
      playback_ids: asset.playback_ids,
      created_at: asset.created_at,
      duration: asset.duration,
      max_stored_resolution: asset.max_stored_resolution,
      max_stored_frame_rate: asset.max_stored_frame_rate,
      aspect_ratio: asset.aspect_ratio,
    })),
  });
});

app.get("/asset", async (req, res) => {
  let videoId = req.query.videoId;
  const asset = await Video.Assets.get(videoId);

  console.log(asset);

  res.json({
    data: {
      id: asset.id,
      status: asset.status,
      playback_ids: asset.playback_ids,
      created_at: asset.created_at,
      duration: asset.duration,
      max_stored_resolution: asset.max_stored_resolution,
      max_stored_frame_rate: asset.max_stored_frame_rate,
      aspect_ratio: asset.aspect_ratio,
    },
  });
});

app.listen(port, () => {
  console.log(`Mux API listening on port ${port}`);
});
