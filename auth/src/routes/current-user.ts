import express from "express";

const router = express.Router();

router.get("/api/test", (req, res) => {
  res.send("Hi there");
});

router.get("/api/users/currentuser", (req, res) => {
  res.send("Hi there");
});

export { router as currentUserRouter };
