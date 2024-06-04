import axios from "axios";
import url from "../Url";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface detailsType {
  name: string;
  title: string;
  description: string;
}

export default function useGetProfileDetails() {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<detailsType>();

  const getToken = Cookies.get("authToken");

  const token = `Bearer ${getToken}`;

  const navigate = useNavigate();

  useEffect(() => {
    if (!getToken) {
      navigate("/signin");
    }
    try {
      setLoading(true);
      axios
        .get(`${url}blog/profile`, {
          headers: { Authorization: token },
        })
        .then((res) => {
          setDetails(res.data.details);
          setLoading(false);
        });
    } catch (e) {
      // console.log(e);
    }
  }, []);

  return {
    loading,
    details,
  };
}
