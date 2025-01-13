import { useEffect, useState } from 'react';

interface UseDynamicAmountParams {
  startTime: number;
  endTime: number;
  offset: number;
  toAdd: number;
  updateIntervalMs?: number;
}

export const useDynamicAmount = ({
  startTime, // ms
  endTime, // ms
  offset,
  toAdd,
  updateIntervalMs = 100,
}: UseDynamicAmountParams) => {
  const [amount, setAmount] = useState(offset);
  useEffect(() => {
    const updateAmount = () => {
      const now = Date.now();
      if (now >= endTime) {
        setAmount(offset + toAdd);
        return;
      }
      if (now <= startTime) {
        setAmount(offset);
        return;
      }
      const totalDuration = endTime - startTime;
      const elapsed = now - startTime;
      const progress = elapsed / totalDuration;
      const newAmount = offset + toAdd * progress;

      setAmount(newAmount);
    };

    updateAmount();

    const intervalId = setInterval(updateAmount, updateIntervalMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [startTime, endTime, offset, toAdd, updateIntervalMs]);

  return amount;
};
