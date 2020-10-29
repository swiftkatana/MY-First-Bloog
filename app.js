//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const PORT = process.env.PORT;
const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");
const multer = require("multer");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const app = express();

app.set("view engine", "ejs");
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use("/posts/uploads", express.static("uploads"));

//DB

mongoose
  .connect(process.env.DB_mongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to mongodb"))
  .catch((error) => console.log(error));

const { Post } = require("./models/post.js");
const { User } = require("./models/user.js");

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

//DB

app.get("/about", function (req, res) {
  console.log(req.ip + "enter the about ");
  res.render("about");
});

app.get("/contact", function (req, res) {
  console.log(req.ip + "enter the contact ");
  res.render("contact");
});

app.get("/register", function (req, res) {
  console.log(req.ip + " enter the register ");
  res.render("register");
});

// app.post("/register", (req, res) => {

//     console.log(req.ip + " just register to our web ");
//     User.register({ username: req.body.username }, req.body.password, (err, user) => {
//         if (err) {
//             console.log(err);
//             if (err)
//                 res.redirect("/register");
//         } else {
//             passport.authenticate("local")(req, res, () => {
//                 res.redirect("/");
//             });

//         }
//     });

// });

app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.logIn(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, () => {
        console.log(req.ip + " wellcome Login ");
        res.redirect("/createPost");
      });
    }
  });
  console.log(req.ip + " just try login ");
  res.redirect("/danielistheking");
});

app.get("/posts/:post", (req, res) => {
  Post.find({}, (err, posts) => {
    if (posts.length >= 1) {
      const post = posts[req.params.post];
      post.howManyViews++;
      console.log(
        "this post " +
          post.title +
          "have thit amount of visters" +
          post.howManyViews
      );
      post.save();
      res.render("post", { post: post });
    } else {
      Post.save();
      res.render("eror", {
        whatIsTheEror: "the page that you were looking for Does not exist  ",
      });
      whatIsTheEror;
    }
  });
});

app.get("/", function (req, res) {
  Post.find({}, function (err, post) {
    let posts = [];
    post.forEach(function (post) {
      posts.push(post);
    });
    console.log(req.ip + "enter the home ");
    res.render("home", { posts: posts });
  });
});

app.get("/createPost", function (req, res) {
  if (req.isAuthenticated()) {
    console.log(req.ip + "enter the createPost ");
    res.render("createPost");
  } else {
    console.log(req.ip + "try to enter  to the post page but not login ");
    res.redirect("/");
  }
});

app.get("/danielistheking", function (req, res) {
  res.render("login");
});

app.post("/", upload.any("photos"), function (req, res) {
  console.log(req.ip + "add a post ");
  if (req.isAuthenticated()) {
    filesImges = [];

    Post.find({}, function (err, posts) {
      let id = posts.length;
      let imgsAryy;

      if (
        req.body.imgs !== undefined &&
        req.body.imgs !== null &&
        req.body.imgs !== "" &&
        req.body.imgs !== " "
      ) {
        imgsAryy = req.body.imgs.split(" ");
        imgsAryy.forEach((img) => {
          filesImges.push(img);
        });
      }

      req.files.forEach((imgFile) => {
        filesImges.push(imgFile.path);
      });

      const post = new Post({
        title: req.body.title,
        body: req.body.post,
        time: new Date().toDateString(),
        howManyViews: 0,
        imgs: filesImges,
        id: id,
      });
      console.log(req.ip + "create post ");
      post.save(() => {
        res.redirect("/");
      });
    });
  } else {
    console.log("SomeOne try to upload and not login!!!!!");
    res.redirect("/");
  }
});

app.listen(process.env.PORT, () => {
  console.log("the server is listen to port " + process.env.PORT);
});

UpdateFileOnTheData = () => {
  // Write data in 'Output.txt' .
  fs.writeFile("Posts.json", JSON.stringify(posts), (err) => {
    // In case of a error throw err.
    if (err) throw err;
  });
};
