const Quote = () => {
  return (
    <div className="bg-slate-200 min-h-screen flex justify-center flex-col ">
      <div className="flex justify-center">
        <div className=" max-w-md pl-4 pr-3  lg:max-w-lg xl:max-w-xl ">
          <h1 className=" xl:text-3xl lg:text-2xl text-xl  text-black font-bold">
            "The customer service I received was exceptional. The Support team went above and beyond to address my
            concerns."
          </h1>
          <p className="xl:text-xl lg:text-lg text-md mt-2 lg:mt-4 xl:mt-6  text-black font-medium">Jules Winnfield</p>
          <p className="xl:text-xl lg:text-lg text-md text-slate-400 font-normal">CEO, Acme Inc</p>
        </div>
      </div>
    </div>
  );
};

export default Quote;
