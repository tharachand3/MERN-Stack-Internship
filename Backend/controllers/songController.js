import axios from "axios";

const JAMENDO_BASE_URL = "https://api.jamendo.com/v3.0/tracks/";
const CLIENT_ID = process.env.JAMENDO_CLIENT_ID;

/* GET ALL SONGS */
export const getSongs = async (req, res) => {
  try {
    const response = await axios.get(JAMENDO_BASE_URL, {
      params: {
        client_id: CLIENT_ID,
        format: "json",
        limit: 15,
      },
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "getSongs error:",
      error?.response?.data || error.message
    );
    return res.status(500).json({ message: "Failed to fetch songs" });
  }
};

/* GET PLAYLIST BY TAG */
export const getPlaylistByTag = async (req, res) => {
  try {
    const tag = (req.params.tag || req.query.tag || "").trim();

    if (!tag) {
      return res.status(400).json({ message: "Missing Tag Parameters" });
    }

    const limit = parseInt(req.query.limit ?? "10", 10);

    const response = await axios.get(JAMENDO_BASE_URL, {
      params: {
        client_id: CLIENT_ID,
        format: "json",
        tags: tag,
        limit,
      },
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "getPlaylistByTag error:",
      error?.response?.data || error.message
    );
    return res.status(500).json({ message: "Failed to fetch playlist" });
  }
};

/* TOGGLE FAVOURITE */
export const toggleFavourite = async (req, res) => {
  try {
    const user = req.user;
    const song = req.body.song;

    if (!song || !song.id) {
      return res.status(400).json({ message: "Song data missing" });
    }

    const exists = user.favourites.find((fav) => fav.id === song.id);

    if (exists) {
      user.favourites = user.favourites.filter(
        (fav) => fav.id !== song.id
      );
    } else {
      user.favourites.push(song);
    }

    await user.save();
    return res.status(200).json(user.favourites);
  } catch (error) {
    console.error(error.message);
    return res
      .status(400)
      .json({ message: "Favourites not updated" });
  }
};
