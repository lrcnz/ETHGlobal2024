import AccountAvatar from "@/components/account-avatar";
import { useTopCreators } from "@/hooks/use-top-creators";

const TopCreators = async () => {
  const topCreators = useTopCreators();

  return (
    <div className="py-[30px]">
      <h1 className="mb-6 text-[40px] leading-[40px] font-bold text-black">Top Creators</h1>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm leading-6 text-black">Explore trending Creators</p>
        <button className="btn btn-outline">View All</button>
      </div>
      <div className="flex items-center justify-between">
        {
          topCreators.map((creator) => (
            <div key={creator.address} className="min-w-[245px] p-5 rounded-[20px] border border-[rgba(243,243,243,1)] shadow-md bg-white">
              <div className="mb-4 w-[60px] h-[60px] rounded-full flex items-center justify-center bg-black/5">
                <AccountAvatar address={creator.address} size={38} />
              </div>
              <p className="mb-2 text-xl leading-7 text-black font-normal">{creator.name}</p>
              <ul className="mb-2 text-sm leading-6 text-black/50">
                <li className="flex items-center justify-between">
                  <span>Subscribers</span>
                  <span className="font-bold text-right">{creator.subscribers}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>FLOWs</span>
                  <span className="font-bold text-right">{creator.flows}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Total Volume</span>
                  <span className="font-bold text-right">{creator.totalVolume}</span>
                </li>
              </ul>
              <button className="btn btn-outline btn-info w-full rounded-full text-sm leading-5">
                { creator.isFollowing ? "Followed" : "Follow" }
              </button>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default TopCreators;