const router = require('express').Router();
const { Post } = require('../models/');
const withAuth = require('../utils/auth');

// withAuth allows us to make sure the user as authorization in order to access a route
router.get('/', withAuth, async (req, res) => {
  try {
    // allows us to grab all posts belonging to the user ID  which matches session userId
    const postData = await Post.findAll({
      where: {
        userId: req.session.userId,
      },
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    // Setting up the object containing data which we will then use in res.render (to render)
    let dataToRender = {
      title: `Dashboard`,
      year: new Date().getFullYear(), 
      userId: req.session.userId, 
      path: req.route.path,
    }
    
    // rendering here using the layout: dashboard
    res.render('all-posts-admin', {
      layout: 'dashboard',
      posts,
      ...dataToRender
    });
  } catch (err) {
    res.redirect('login');
  }
});

router.get('/new', withAuth, (req, res) => {
  let dataToRender = {
    title: `New Post`,
    year: new Date().getFullYear(), 
    userId: req.session.userId, 
    path: req.route.path,
  }
  res.render('new-post', {
    layout: 'dashboard',
    ...dataToRender
  });
});

// to do: handling editing

module.exports = router;
