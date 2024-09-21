"use client";

import UserInfo from "./components/user-info";
import UserBoxList from "./components/user-box-list";
import { useRouter } from "next/navigation";

export default function Page () {
  const router = useRouter();

  const handleBuildNewFlow = () => {
    router.push("/box/create");
  }

  return (
    <div>
      <UserInfo />
      <div className="flex justify-end items-center w-full mb-4">
        <button className="btn btn-primary" onClick={handleBuildNewFlow}>Build New Box</button>
      </div>
      <UserBoxList />
    </div>
  );
}