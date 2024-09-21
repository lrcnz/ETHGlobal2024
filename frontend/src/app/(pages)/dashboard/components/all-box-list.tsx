"use client";

import { BoxCard } from "../../profile/components/box-card";
import { useAllBoxList } from "@/hooks/use-all-box-list";

const AllBoxList = () => {
  const data = useAllBoxList();

  if (data.isLoading || !data.data) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <div>
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.data.map((data: any) => {
          return <BoxCard {...data} key={data.id} />
        })
      }
    </div>
  );
}

AllBoxList.displayName = 'UserBoxs';

export default AllBoxList;