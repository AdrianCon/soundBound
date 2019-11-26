var router = require('express').Router();
var passport = require('passport');
var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var User = mongoose.model('User');
var Comment = mongoose.model('Comment');
var auth = require('../auth');

router.param('article', function(req, res, next, slug) {
  Article.findOne({ slug: slug})
    .populate('author')
    .then(function (article) {
      if (!article) { return res.sendStatus(404); }

      req.article = article;

      return next();
    }).catch(next);
});

//Middleware to resolve commnet
router.param('comment', function(req, res, next, id) {
  Comment.findById(id).then(function(comment){
    if(!comment) { return res.sendStatus(404); }

    req.comment = comment;

    return next();
  }).catch(next);
});


//Post article
router.post('/', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    var article = new Article(req.body.article);

    article.author = user;

    return article.save().then(function(){
      console.log(article.author);
      return res.json({article: article.toJSONFor(user)});
    });
  }).catch(next);
});

//Read article
router.get('/:article', auth.optional, function(req, res, next) {
  Promise.all([
    req.payload ? User.findById(req.payload.id) : null,
    req.article.populate('author').execPopulate()
  ]).then(function(results){
    var user = results[0];

    return res.json({article: req.article.toJSONFor(user)});
  }).catch(next);
});

//Update article
router.put('/:article', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if(req.article.author._id.toString() === req.payload.id.toString()){
      if(typeof req.body.article.title !== 'undefined'){
        req.article.title = req.body.article.title;
      }

      if(typeof req.body.article.description !== 'undefined'){
        req.article.description = req.body.article.description;
      }

      if(typeof req.body.article.body !== 'undefined'){
        req.article.body = req.body.article.body;
      }

      req.article.save().then(function(article){
        return res.json({article: article.toJSONFor(user)});
      }).catch(next);
    } else {
      return res.sendStatus(403);
    }
  });
});

//Delete article
// router.delete('/delete', auth.required, function(req, res, next) {
//   User.findById(req.payload.id).then(function(){
//     if(req.article.author._id.toString() === req.payload.id.toString()){
//       return req.article.remove().then(function(){
//         return res.sendStatus(204);
//       });
//     } else {
//       return res.sendStatus(403);
//     }
//   });
// });

router.delete('/delete', function(req, res, next) {
  Article.findById(req.body.id).then(function(art){
    if(art){
      return art.remove().then(function(){
        return res.sendStatus(204);
      });
    } else {
      return res.sendStatus(403);
    }
  });
});

//Delete article
// router.delete('/:id', auth.required, function(req, res, next) {
//   console.log("inside");
//   var id = req.payload.id;
//   Article.findOne({_id : id}).then(function(delArticle){
//     if(delArticle){
//       return delArticle.remove().then(function(){
//         return res.sendStatus(204);
//       });
//     } else {
//       return res.sendStatus(403);
//     }
//   });
// }); 

// Favorite an article
router.post('/:article/favorite', auth.required, function(req, res, next) {
  var articleId = req.article._id;

  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    return user.favorite(articleId).then(function(){
      return req.article.updateFavoriteCount().then(function(article){
        return res.json({article: article.toJSONFor(user)});
      });
    });
  }).catch(next);
});

// Unfavorite an article
router.delete('/:article/favorite', auth.required, function(req, res, next) {
  var articleId = req.article._id;

  User.findById(req.payload.id).then(function (user){
    if (!user) { return res.sendStatus(401); }

    return user.unfavorite(articleId).then(function(){
      return req.article.updateFavoriteCount().then(function(article){
        return res.json({article: article.toJSONFor(user)});
      });
    });
  }).catch(next);
});

//Create comment
router.post('/:article/comments', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }

    console.log(23);
    var comment = new Comment(req.body.comment);
    comment.article = req.article;
    comment.author = user;

    return comment.save().then(function(){
      req.article.comments.push(comment);

      return req.article.save().then(function(article) {
        res.json({comment: comment.toJSONFor(user)});
      });
    });
  }).catch(next);
});

//List comments of articles
router.get('/:article/comments', auth.optional, function(req, res, next){
  Promise.resolve(req.payload ? User.findById(req.payload.id) : null).then(function(user){
    return req.article.populate({
      path: 'comments',
      populate: {
        path: 'author'
      },
      options: {
        sort: {
          createdAt: 'desc'
        }
      }
    }).execPopulate().then(function(article) {
      return res.json({comments: req.article.comments.map(function(comment){
        return comment.toJSONFor(user);
      })});
    });
  }).catch(next);
});

//Delete comment
router.delete('/:article/comments/:comment', auth.required, function(req, res, next) {
  if(req.comment.author.toString() === req.payload.id.toString()){
    req.article.comments.remove(req.comment._id);
    req.article.save()
      .then(Comment.find({_id: req.comment._id}).remove().exec())
      .then(function(){
        res.sendStatus(204);
      });
  } else {
    res.sendStatus(403);
  }
});

//Get all articles
router.get('/', auth.optional, function(req, res, next) {
	var query = {};
	var limit = 10; // Default 10
	var offset = 0; //Number of articles to skip for query

	if(typeof req.query.limit !== 'undefined'){
	limit = req.query.limit;
	}

	if(typeof req.query.offset !== 'undefined'){
	offset = req.query.offset;
	}

	//Filer articles by tag if tag is provided
	if( typeof req.query.tag !== 'undefined' ){
	query.tagList = {"$in" : [req.query.tag]};
	}

	Promise.all([
   		req.query.author ? User.findOne({username: req.query.author}) : null,
    	req.query.favorited ? User.findOne({username: req.query.favorited}) : null
  	]).then(function(results){
    	var author = results[0];
    	var favoriter = results[1];
 
    	if(author){
      		query.author = author._id;
    	}
    	if(favoriter){
      		query._id = {$in: favoriter.favorites};
    	} else if(req.query.favorited){
      		query._id = {$in: []};
    	}

		return Promise.all([
		Article.find(query)
		  	.limit(Number(limit))
		  	.skip(Number(offset))
		  	.sort({createdAt: 'desc'})
		  	.populate('author')
		  	.exec(),
			Article.count(query).exec(),
			req.payload ? User.findById(req.payload.id) : null, //If user isnt logged in
			]).then(function(results){
				var articles = results[0];
				var articlesCount = results[1];
				var user = results[2];

				return res.json({
				    articles: articles.map(function(article){
				    	return article.toJSONFor(user);
				  	}),
				  	articlesCount: articlesCount
				});
			});
  	}).catch(next);
});

//Curated articles of followed users
router.get('/feed', auth.required, function(req, res, next) {
  var limit = 20;
  var offset = 0;

  if(typeof req.query.limit !== 'undefined'){
    limit = req.query.limit;
  }

  if(typeof req.query.offset !== 'undefined'){
    offset = req.query.offset;
  }

  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    Promise.all([
      Article.find({ author: {$in: user.following}})
        .limit(Number(limit))
        .skip(Number(offset))
        .populate('author')
        .exec(),
      Article.count({ author: {$in: user.following}})
    ]).then(function(results){
      var articles = results[0];
      var articlesCount = results[1];

      return res.json({
        articles: articles.map(function(article){
          return article.toJSONFor(user);
        }),
        articlesCount: articlesCount
      });
    }).catch(next);
  });
});

module.exports = router;
