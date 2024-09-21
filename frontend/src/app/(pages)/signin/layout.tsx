const Signin = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full flex items-center justify-center bg-gray-100-200">
      <div className="w-[620px] mt-[200px] pr-32">{children}</div>
    </div>
  );
}

export default Signin