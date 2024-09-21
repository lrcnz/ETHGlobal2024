// mock data
export function useTopCreators () {
  return [
    {
      // address is a string that starts with '0x' followed by a 32-character hex string
      address: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
      name: 'Alice',
      subscribers: 100,
      flows: 100,
      totalVolume: 100,
      isFollowing: false
    },
    {
      address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
      name: 'Bob',
      subscribers: 200,
      flows: 200,
      totalVolume: 200,
      isFollowing: false
    },
    {
      address: '0x1234567890abcdef1234567890abcdef12345678',
      name: 'Charlie',
      subscribers: 300,
      flows: 300,
      totalVolume: 300,
      isFollowing: true
    },
    {
      address: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
      name: 'David',
      subscribers: 400,
      flows: 400,
      totalVolume: 400,
      isFollowing: false
    }
  ] as const;
}