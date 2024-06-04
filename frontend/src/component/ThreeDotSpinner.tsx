import { ThreeDots } from "react-loader-spinner";

const ThreeDotSpinner = () => {
  return (
    <ThreeDots
      visible={true}
      height="10"
      width="30"
      color="#0000000"
      radius="9"
      ariaLabel="three-dots-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
};

export default ThreeDotSpinner

