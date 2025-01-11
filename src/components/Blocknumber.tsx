import { useBlockNumber } from 'wagmi';

export const Blocknumber = () => {
  const blockNumber = useBlockNumber({ cacheTime: 5000 });
  return (
    <div className="flex gap-1">
      <div>Blocknumber</div>
      <div>{blockNumber.data?.toString()}</div>
    </div>
  );
};
