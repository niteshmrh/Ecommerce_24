import { adminOnly } from './../middlewares/auth.js';
import express from "express";
import { deleteUser, getAllUsers, getUser, newUser } from "../controllers/user.js";

const router = express.Router();

// user route - api/vi/user
router.post('/new', newUser);


// user route - api/v1/user
router.get('/all',adminOnly, getAllUsers);

// // user route - api/v1/user
// router.get('/:id', getUser);

// // user route - api/v1/user
// router.delete('/:id', deleteUser);

// we can also do this using chain this
router.route('/:id').get(adminOnly, getUser).delete(adminOnly, deleteUser);


export default router;