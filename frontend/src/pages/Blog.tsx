import { Navigate, useParams } from "react-router-dom";
import useGetBlog from "../hooks/getblog";
import FullBlog from "../component/FullBlog";
import AppBar from "../component/AppBar";
import { Oval } from "react-loader-spinner";

const BlogPage = () => {
  const { id } = useParams();

  const { loading, blog } = useGetBlog({ id: id || "" });

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

  if (!blog) {
    return <Navigate to="/blogs" />;
  }

  return (
    <div className="min-h-screen min-w-screen">
      <AppBar />
      <FullBlog info={blog} />
    </div>
  );
};

export default BlogPage;
