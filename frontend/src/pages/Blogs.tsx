import { useNavigate } from "react-router-dom";
import AppBar from "../component/AppBar";
import BlogCard from "../component/BlogCard";
import useBlogs from "../hooks/bulkPosts";
import { Oval } from "react-loader-spinner";

const BlogsPage = () => {
  const { loading, blogs } = useBlogs();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Oval
          visible={true}
          height="60"
          width="60"
          color="#4fa94d"
          ariaLabel="oval-loading"
          strokeWidth="5"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }

  const onClickBlog = (id: string) => {
    const path = `/blog/${id}`;
    navigate(path);
  };

  return (
    <div className="min-h-screen min-w-screen">
      <AppBar />
      <div className="flex flex-col justify-center items-center">
        <div className=" max-w-screen-md lg:max-w-screen-lg w-full">
          {blogs.map((each) => (
            <BlogCard
              id={each.id}
              key={each.id}
              authorName={each.author.name}
              title={each.title}
              content={each.content}
              publishedDate={convertTimeToString(each.created_at)}
              onClickBlog={onClickBlog}
              savedPost={each.savedPost}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const convertTimeToString = (time: string) => {
  const date = new Date(time);
  const modified = date.toDateString();
  const getM = modified.split(" ")[1];
  const getD = modified.split(" ")[2];
  const getY = modified.split(" ")[3];
  return `${getM} ${getD},${getY}`;
};

export default BlogsPage;
