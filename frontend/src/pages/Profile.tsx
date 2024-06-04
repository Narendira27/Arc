import { Navigate } from "react-router-dom";
import ProfileDetails from "../component/ProfileDetails";
import ProfilePublished from "../component/PublishedCard";
import useGetProfileDetails from "../hooks/getProfileDetails";
import { Oval } from "react-loader-spinner";
import AppBar from "../component/AppBar";

function ProfilePage() {
  const { loading, details } = useGetProfileDetails();

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

  if (!details) {
    return <Navigate to="/blogs" />;
  }

  return (
    <div className="lg:grid lg:grid-cols-4 lg:h-screen ">
      <div className="lg:col-span-4 ">
        <AppBar />
      </div>
      <div className=" lg:col-span-1 w-full p-5 lg:h-full">
        <ProfileDetails details={details} />
      </div>
      <div className=" md:col-span-3 lg:overflow-auto lg:h-full  ">
        <ProfilePublished />
      </div>
    </div>
  );
}

export default ProfilePage;
