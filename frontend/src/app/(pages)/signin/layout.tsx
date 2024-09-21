const Signin = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-screen h-screen flex bg-gray-100-200">
      <div className="flex-1"></div>
      <div className="h-screen w-[620px] mt-[200px] pr-32">{children}</div>
    </div>
  );
}

export default Signin