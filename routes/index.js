const express = require("express");
const router = express.Router();

router.get("/movies", async (req, res) => {
  options = {
    headers: {
      Authorization: process.env.READ_ONLY_TOKEN,
    },
  };
  const movies = await fetch(
    "https://api.themoviedb.org/3/discover/movie",
    options
  )
    .then((r) => r.json())
    .then(async (data) => {
      const config = await fetch(
        "https://api.themoviedb.org/3/configuration",
        options
      ).then((r) => r.json());
      return data.results.map((movieObj) => {
        const posterObj = {
          poster: `${config.images.base_url}${config.images.poster_sizes[4]}${movieObj.poster_path}`,
        };
        movieObj.overview =
          movieObj.overview.length > 250
            ? movieObj.overview.slice(0, 250) + "..."
            : movieObj.overview;
        return Object.assign(movieObj, posterObj);
      });
    });

  res.json({ movies });
});

module.exports = router;
