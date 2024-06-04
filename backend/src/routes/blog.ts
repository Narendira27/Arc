import { Hono } from "hono";
import { Prisma, PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@narendira/blog-common";

const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
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
    return c.json({ msg: "Invalid Jwt " });
  }
});

blogRouter.get("/me", async (c) => {
  c.status(200);
  return c.json({ verified: true });
});

blogRouter.get("/profile", async (c) => {
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
      return c.json({ msg: "UserDetails not found" });
    }
    const { name, title, description } = getProfileDetails;
    return c.json({ details: { name, title, description } });
  } catch (e: any) {
    c.status(400);
    return c.json({ msg: "Server Error", errorMsg: e.message });
  }
});

blogRouter.put("/profile", async (c) => {
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
  } catch (e: any) {
    c.status(400);
    return c.json({ msg: "Server Error", errorMsg: e.message });
  }
});

blogRouter.get("/published", async (c) => {
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
  } catch (e: any) {
    c.status(400);
    return c.json({ msg: "Server Error", errorMsg: e.message });
  }
});

blogRouter.post("/", async (c) => {
  const authId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const publishedInput = body.published || false;

  const { success } = createBlogInput.safeParse(body);

  if (!success) {
    c.status(411);
    return c.json({ msg: "Invalid Inputs" });
  }

  try {
    const blog = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        published: publishedInput,
        authorId: authId,
      },
    });
    return c.json({ id: blog.id });
  } catch (e: any) {
    c.status(411);
    return c.json({ msg: e.message });
  }
});

blogRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const publishedData = body.published || false;

  const { success } = updateBlogInput.safeParse(body);

  if (!success) {
    c.status(411);
    return c.json({ msg: "Invalid Inputs" });
  }

  try {
    const blog = await prisma.post.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
        published: publishedData,
      },
    });
    return c.json({ id: blog.id });
  } catch (e: any) {
    c.status(411);
    return c.json({ msg: e.message });
  }
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const authId = c.get("userId");

  try {
    const blog = await prisma.post.findMany({
      where: {
        published: true,
      },
      select: {
        id: true,
        created_at: true,
        title: true,
        content: true,
        published: true,
        savedPost: {
          select: {
            id: true,
            postId: true,
          },
          where: {
            userId: authId,
          },
        },
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    return c.json({ blog });
  } catch (e: any) {
    c.status(411);
    return c.json({ msg: e.message });
  }
});

blogRouter.post("/save", async (c) => {
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
  } catch (e: any) {
    c.status(400);
    return c.json({ msg: "error occurred", error: e.message });
  }
});

blogRouter.get("/save", async (c) => {
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
  } catch (e: any) {
    c.status(400);
    return c.json({ msg: "Something Went Wrong", error: e.message });
  }
});

blogRouter.delete("/save", async (c) => {
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
  } catch (e: any) {
    c.status(400);
    return c.json({ msg: "Something Went Wrong", error: e.message });
  }
});

blogRouter.get("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const id = c.req.param("id");
  try {
    const blog = await prisma.post.findFirst({
      where: {
        id,
        published: true,
      },
      select: {
        title: true,
        content: true,
        created_at: true,
        author: {
          select: {
            name: true,
            title: true,
            description: true,
          },
        },
      },
    });
    return c.json({ blog });
  } catch (e: any) {
    c.status(411);
    return c.json({ msg: e.message });
  }
});

export default blogRouter;
