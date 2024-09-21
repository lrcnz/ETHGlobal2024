import { BoxCard } from "./box-card";
import { useUserBoxList } from "@/hooks/use-user-box-list";

const UserBoxList = () => {
  const data = useUserBoxList();

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

UserBoxList.displayName = 'UserBoxs';

export default UserBoxList;