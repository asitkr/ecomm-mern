import express from 'express';
import { forgotPasswordController, loginController, registerController, testController } from '../controllers/authController.js';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

// router object
const router = express.Router();

// routing
// register || post method
router.post('/register', registerController);

// login || post method
router.post('/login', loginController);

// forgot password || pos method
router.post('/forgot-password', forgotPasswordController);

// protected route user auth
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({
        ok: true
    });
});

// protected route admin auth
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({
        ok: true
    });
});

// test routes
router.get('/test', requireSignIn, isAdmin, testController);

export default router;