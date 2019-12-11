var express = require("express");
var router  = express.Router();
var Post    = require("../models/Post");

router.get("/", function(req, res){
    Post.find({})                  // 1
        .sort("-createdAt")            // 1
        .exec(function(err, posts){    // 1
            if(err) return res.json(err);
            res.render("posts/index", {posts:posts});
        });
});

router.get("/insert", function(req, res){
    res.render("posts/insert");
});

router.post("/insert", function(req, res){
    Post.create(req.body, function(err, post){
        if(err) return res.json(err);
        res.redirect("/posts");
    });
});

router.get("/detail/:id", function(req, res){
    Post.findOne({_id:req.params.id}, function(err, post){
        if(err) return res.json(err);
        res.render("posts/detail", {post:post});
    });
});

router.get("/:id/edit", function(req, res){
    Post.findOne({_id:req.params.id}, function(err, post){
        if(err) return res.json(err);
        res.render("posts/edit", {post:post});
    });
});

router.post("/edit/:id", function(req, res){
    req.body.updatedAt = Date.now(); // 2
    Post.findOneAndUpdate({_id:req.params.id}, req.body, function(err, post){
        if(err) return res.json(err);
        res.redirect("/posts/detail/"+req.params.id);
    });
});

router.post("/detail/:id", function(req, res){
    Post.deleteOne({_id:req.params.id}, function(err){
        if(err) return res.json(err);
        res.redirect("/posts");
    });
});

module.exports = router;