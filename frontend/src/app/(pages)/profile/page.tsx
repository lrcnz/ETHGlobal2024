"use client";

import { useConnections, usePublicClient } from "wagmi";
import UserInfo from "./components/user-info";
import UserBoxList from "./components/user-box-list";

export default function Page () {
  return (
    <div>
      <UserInfo />
      <UserBoxList />
    </div>
  );
}