import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { commonMiddleware } from "../middlewares/common.middleware";

const router = Router();

router.get("/", userController.getList);
router.post(
  "/",
  commonMiddleware.validateBody("create"),
  userController.create,
);

router.get(
  "/:userId",
  commonMiddleware.isValidId("userId"),
  userController.getUserById,
);
router.put(
  "/:userId",
  commonMiddleware.validateBody("update"),
  userController.updateUser,
);
router.delete("/:userId", userController.deleteUser);

export const userRouter = router;
