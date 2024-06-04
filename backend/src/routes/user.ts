import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { hashPassword, verifyHash } from "../hash";
import { sign, verify, decode } from "hono/jwt";
import { signinInput, signupInput } from "@narendira/blog-common";

import fetch from "isomorphic-fetch";

const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT: string;
    EmailToken: string;
  };
  Variables: {
    userId: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const { success } = signupInput.safeParse(body);

  if (!success) {
    c.status(403);
    return c.json({ msg: "Invalid Inputs" });
  }

  const sendMail = async () => {
    const header = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${c.env.EmailToken}`,
    };

    const data = JSON.stringify({
      user: "Arc",
      recipient: body.email,
      url: "https://arc.narendira.tech",
    });

    const response = await fetch("https://verify.narendira.tech/send", {
      method: "POST",
      headers: header,
      body: data,
    });

    if (response.statusText === "OK") {
      interface parsedType {
        msg: string;
        sent: boolean;
      }
      const parsed: parsedType = await response.json();
      console.log(parsed);
      if (parsed.sent === true) {
        return "Ok";
      }
      throw new Error("Something Went Wrong Try Again Later");
    }
    throw new Error("Something Went Wrong Try Again Later");
  };

  try {
    const passwordHash = await hashPassword(body.password);
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
    await sendMail();
    // const jwt = await sign({ id: user.id }, c.env.JWT);
    // return c.json({ token: jwt, name: body.name });
    return c.json({ msg: "true" });
  } catch (e: any) {
    c.status(400);
    if (e.code === "P2002") {
      return c.json({ msg: "Email Already Exists" });
    }
    return c.json({ msg: "Bad Request" });
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const { success } = signinInput.safeParse(body);

  if (!success) {
    c.status(403);
    return c.json({ msg: "Invalid Inputs" });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });
    if (!user) {
      c.status(400);
      return c.json({ msg: "user not found" });
    }

    if (!user.verified) {
      c.status(400);
      return c.json({ msg: "Email not verified" });
    }

    const verify = await verifyHash(user.password, body.password);

    if (!verify) {
      c.status(302);
      return c.json({ msg: "Incorrect Password" });
    }

    const jwt = await sign({ id: user.id }, c.env.JWT);
    return c.json({ token: jwt, name: user.name });
  } catch (e: any) {
    c.status(400);
    return c.json({ msg: e.message });
  }
});

userRouter.post("/resend", async (c) => {
  const body = await c.req.json();

  const sendMail = async () => {
    const header = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${c.env.EmailToken}`,
    };

    const data = JSON.stringify({
      user: "Arc",
      recipient: body.email,
      url: "https://arc.narendira.tech",
    });

    const response = await fetch("https://verify.narendira.tech/send", {
      method: "POST",
      headers: header,
      body: data,
    });

    if (response.statusText === "OK") {
      interface parsedType {
        msg: string;
        sent: boolean;
      }
      const parsed: parsedType = await response.json();
      console.log(parsed);
      if (parsed.sent === true) {
        return "Ok";
      }
      throw new Error("Something Went Wrong Try Again Later");
    }
    throw new Error("Something Went Wrong Try Again Later");
  };

  try {
    await sendMail();
    return c.json({ msg: "true" });
  } catch (e: any) {
    c.status(400);
    return c.json({ msg: "Bad Request" });
  }
});

userRouter.post("/verify", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const verifyMail = async () => {
    const header = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${c.env.EmailToken}`,
    };

    const data = JSON.stringify({
      user: "Arc",
      token: body.token,
    });

    const response = await fetch("https://verify.narendira.tech/verify", {
      method: "POST",
      headers: header,
      body: data,
    });

    if (response.statusText === "OK") {
      interface parsedType {
        msg: string;
        verfied: boolean;
      }
      const parsed: parsedType = await response.json();
      if (parsed.verfied === true) {
        return "Ok";
      }
      throw new Error("Something Went Wrong Try Again Later");
    }
    throw new Error("Something Went Wrong Try Again Later");
  };

  try {
    await verifyMail();
    const email = decode(body.token).payload.email;
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        verified: true,
      },
    });
    c.status(200);
    return c.json({ msg: "verified" });
  } catch (e) {
    c.status(400);
    return c.json({ msg: "Bad Request" });
  }
});

userRouter.use("/*", async (c, next) => {
  const header = c.req.header("authorization");
  if (!header) {
    c.status(401);
    return c.json({ msg: "Jwt token not found" });
  }
  const authToken = header.split(" ")[1];
  if (!authToken) {
    c.status(401);
    return c.json({ msg: "Invalid Request" });
  }
  try {
    const value = await verify(authToken, c.env.JWT);
    c.set("userId", value.id);
    await next();
  } catch {
    c.status(401);
    return c.json({ msg: "Invalid Jwt" });
  }
});

userRouter.get("/me", async (c) => {
  c.status(200);
  return c.json({ verified: true });
});

userRouter.delete("/me", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const authId = c.get("userId");

  try {
    const deleteUser = await prisma.user.delete({
      where: {
        id: authId,
      },
    });
    return c.json({ msg: "User Deleted" });
  } catch (e) {
    c.status(400);
    return c.json({ msg: "Bad Request" });
  }
});

userRouter.get("/profile", async (c) => {
  const authId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const getProfileDetails = await prisma.user.findFirst({
      where: {
        id: authId,
      },
    });
    if (!getProfileDetails) {
      return c.json({ msg: "User Details not found" });
    }
    const { name, title, description } = getProfileDetails;
    return c.json({ details: { name, title, description } });
  } catch (e) {
    c.status(400);
    return c.json({ msg: "Bad Request" });
  }
});

userRouter.put("/profile", async (c) => {
  const authId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  try {
    const updateProfile = await prisma.user.update({
      where: {
        id: authId,
      },
      data: {
        name: body.name,
        title: body.title,
        description: body.description,
      },
    });
    c.status(200);
    return c.json({ updated: true });
  } catch (e) {
    c.status(400);
    return c.json({ msg: "Bad Request" });
  }
});

userRouter.get("/published", async (c) => {
  const authId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const publishedBlog = await prisma.post.findMany({
      where: {
        authorId: authId,
        published: true,
      },
      select: {
        id: true,
        created_at: true,
        title: true,
        content: true,
        published: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    const hiddenBlogs = await prisma.post.findMany({
      where: {
        authorId: authId,
        published: false,
      },
      select: {
        id: true,
        created_at: true,
        title: true,
        content: true,
        published: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    c.status(200);
    return c.json({ publishedBlog, hiddenBlogs });
  } catch (e) {
    c.status(400);
    return c.json({ msg: "Bad Request" });
  }
});

userRouter.post("/save", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const authId = c.get("userId");
  const body = await c.req.json();

  try {
    const res = await prisma.savedPost.create({
      data: {
        postId: body.postId,
        userId: authId,
      },
    });
    return c.json({ msg: res });
  } catch (e) {
    c.status(400);
    return c.json({ msg: "Bad Request" });
  }
});

userRouter.get("/save", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const authId = c.get("userId");

  try {
    const res = await prisma.savedPost.findMany({
      where: {
        userId: authId,
        post: {
          published: true,
        },
      },
      select: {
        id: true,
        postId: true,
        post: {
          select: {
            id: true,
            title: true,
            content: true,
            created_at: true,
          },
        },
      },
    });

    return c.json({ data: res });
  } catch (e) {
    c.status(400);
    return c.json({ msg: "Bad Request" });
  }
});

userRouter.delete("/save", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  try {
    const dbres = await prisma.savedPost.delete({
      where: {
        id: body.id,
      },
    });
    return c.json({ msg: "success" });
  } catch (e) {
    c.status(400);
    return c.json({ msg: "Bad Request" });
  }
});

export default userRouter;
