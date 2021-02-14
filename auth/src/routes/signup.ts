import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { BadRequestError } from "./../errors/bad-request-error";
import { validationRequest } from "./../middlewares/validate-request";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20"),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("email already exists");
    }

    const user = User.build({ email, password });
    await user.save();
    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // Store in session
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);
router.get("/api/users/signup", async (req, res) => {
  const result = await User.find();
  res.status(200).send(result);
});

export { router as signupRouter };
