import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { hashPassword, verifyHash } from "../hash";
import { sign } from "hono/jwt";
import { signinInput, signupInput } from "@narendira/blog-common";

const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const { success } = signupInput.safeParse(body);

  if (!success) {
    c.status(411);
    return c.json({ msg: "Invalid Inputs" });
  }

  const passwordHash = await hashPassword(body.password);
  try {
    const user = await prisma.user.create({
      data: {
        name: body.name,
        title: "Welcome New User!",
        description:
          "Hello and welcome! You've just joined an exciting network of like-minded individuals ready to share insights, discuss trends, and explore new ideas.To get started, personalize your profile so others can get to know you better.",
        email: body.email,
        password: passwordHash,
      },
    });
    const jwt = await sign({ id: user.id }, c.env.JWT);
    return c.json({ token: jwt, name: body.name });
  } catch (e: any) {
    c.status(411);
    return c.json({ msg: e.message });
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const { success } = signinInput.safeParse(body);

  if (!success) {
    c.status(411);
    return c.json({ msg: "Invalid Inputs" });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });
    if (!user) {
      c.status(403);
      return c.json({ msg: "user not found" });
    }

    const verify = await verifyHash(user.password, body.password);

    if (!verify) {
      c.status(302);
      return c.json({ msg: "Incorrect Password" });
    }

    const jwt = await sign({ id: user.id }, c.env.JWT);
    return c.json({ token: jwt, name: user.name });
  } catch (e: any) {
    c.status(411);
    return c.json({ msg: e.message });
  }
});

// userRouter.delete("/delete", async (c) => {
//   const prisma = new PrismaClient({
//     datasourceUrl: c.env.DATABASE_URL,
//   }).$extends(withAccelerate());

//   try {
//     const deleteUser = await prisma.user.deleteMany({});
//     return c.json({ msg: "done", deletemsg: deleteUser });
//   } catch (e: any) {
//     console.log(e.message);
//   }
// });

export default userRouter;
