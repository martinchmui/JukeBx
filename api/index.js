const express = require("express");
const config = require("dotenv").config();
const { google } = require("googleapis");
const app = express();
const port = process.env.PORT || 8000;
const apiKey = process.env.YOUTUBE_API_KEY;
const youtube = google.youtube({
  version: "v3",
  auth: apiKey,
  params: {
    type: "video",
    maxResults: 5,
  },
});
const ytdl = require("ytdl-core");
var he = require("he");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.send('Hello world')
});

app.get("/search", async (req, res, next) => {
  try {
    const searchQuery = req.query.search_query;
    const response = await youtube.search.list({
      part: "snippet",
      q: searchQuery,
      pageToken: req.query.pageToken,
    });
    const nextPageToken = response.data.nextPageToken;
    const getDuration = async (id) => {
      const response = await ytdl.getBasicInfo(
        `http://www.youtube.com/watch?v=${id}`
      );
      return response.videoDetails.lengthSeconds;
    };

    const results = await Promise.all(
      response.data.items.map(async (item) => {
        return {
          "etag": item.etag,
          "videoId": item.id.videoId,
          "title": he.decode(item.snippet.title),
          "channelTitle": he.decode(item.snippet.channelTitle),
          "thumbnails": item.snippet.thumbnails,
          "duration": await getDuration(item.id.videoId)
        };
      })
    );
    const object = {
      "nextPageToken": nextPageToken,
      "results": results
    };
    res.send(object);
  } catch (err) {
    console.log(err);
  }
});

app.get("/youtube", (req, res) => {
  try {
    const id = req.query.id;
    const response = ytdl(`http://www.youtube.com/watch?v=${req.query.id}`, {
      quality: "highestaudio",
      filter: "audioonly",
    }).pipe(res);
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
