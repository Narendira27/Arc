import axios from "axios";
import url from "../Url";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface savedPostType {
  id: string;
  postId: string;
}

interface eachType {
  id: string;
  created_at: string;
  title: string;
  content: string;
  published: string;
  author: {
    name: string;
    email: string;
  };
  savedPost: savedPostType[];
}

export default function useBlogs() {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<eachType[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const getToken = Cookies.get("authToken");
      const token = `Bearer ${getToken}`;
      if (!getToken) {
        navigate("/signin");
      }
      axios
        .get(url + "blog/bulk", { headers: { Authorization: token } })
        .then((res) => {
          setBlogs(res.data.blog);
          setLoading(false);
          // setErr(() => ({ status: false, name: "none" }));
        });
    } catch (e) {
      // console.log(e);
    }
  }, [navigate]);


  return {
    loading,
    blogs,
  };
}
