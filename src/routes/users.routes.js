const {Router} = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");
const UsersController = require("../controllers/UsersController")
const UserAvatarController = require("../controllers/UserAvatarController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const usersRouter = Router();
const upload = multer(uploadConfig.MULTER);
const userController = new UsersController();   // class allocation in memory
const userAvatarController = new UserAvatarController();

usersRouter.post("/", userController.create);
usersRouter.put("/", ensureAuthenticated, userController.update);

usersRouter.patch( "/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update);

module.exports = usersRouter;
