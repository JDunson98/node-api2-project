const express = require("express");
const posts = require("./data/db");


const router = express.Router();

// Getting posts
router.get("/posts", (req, res) => {
  posts
    .find(req.query)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The posts information could not be retrieved.",
      });
    });
});


router.post("/posts", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    return res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  }

  posts
    .insert(req.body)
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "There was an error while saving the post to the database",
      });
    });
});

router.post("/posts/:id/comments", (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({
      errorMessage: "Please provide text for the comment.",
    });
  }
  posts.insertComment({
    text: req.body.text,
    post_id: req.params.id,
  })
    .then((comment) => {
      if (comment) {
        res.status(201).json(comment);
      } else {
        res.status(404).json({
          message: "The post with the specified ID does not exist.",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "There was an error while saving the comment to the database",
      });
    });
});

router.get("/posts/:id", (req, res) => {
  posts
    .findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "The post with the specified ID does not exist.",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The post information could not be retrieved.",
      });
    });
});

router.delete("/posts/:id", (req, res) => {
  posts.findById(req.params.id)
    .then((post) => {
      posts.remove(req.params.id)
      .then(() => {
        res.status(200).json(post);
      })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "The post could not be removed." });
      });
    })
    .catch((err) => {
      console.log(err);

      res.status(404).json({ message: "The post with the specified ID does not exist." })
    });
    
});

router.put("/posts/:id", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    return res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  }

  posts
    .update(req.params.id, req.body)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "The post with the specified ID does not exist.",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The post information could not be modified.",
      });
    });
});

module.exports = router;