import express from 'express';
import ArticleController from '../../controllers/articleController';
import RateController from '../../controllers/rateController';
import upload from '../../helpers/cloudinary';
import ArticleValidations from '../../middlewares/articleValidations';
import RateValidations from '../../middlewares/rateValidations';
import Authenticator from '../../middlewares/authenticator';
import LikeController from '../../controllers/likeController';
import SearchController from '../../controllers/searchController';

const { checkToken, checkStatToken } = Authenticator;

const router = express.Router();
/* Article Endpoint */
router.post('/articles', checkToken, upload.single('imgUrl'), ArticleValidations.validateCreateArticle, ArticleController.createArticle);
router.get('/articles/feed', ArticleController.getAllArticles);
router.get('/articles', checkToken, ArticleController.getUserArticles);
router.get('/articles/:slug', checkStatToken, ArticleController.getSingleArticle);
router.delete('/articles/:slug', checkToken, ArticleController.deleteArticle);
router.put('/articles/:slug', checkToken, upload.single('imgUrl'), ArticleValidations.validateUpdateArticle, ArticleController.updateArticle);
router.post('/articles/:slug/rate', checkToken, RateValidations.validateRating, RateController.rateArticle);
router.post('/articles/:slug/like', checkToken, LikeController.likeArticle);
router.post('/articles/:slug/dislike', checkToken, LikeController.dislikeArticle);

router.get('/search', SearchController.searchWith);
export default router;
