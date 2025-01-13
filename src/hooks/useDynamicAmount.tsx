import { useEffect, useMemo, useState } from 'react';

interface UseDynamicAmountParams {
  startTime: number; // segundos (p.ej., Math.floor(Date.now() / 1000))
  endTime: number; // segundos
  offset: number; // valor inicial
  toAdd: number; // total a sumar desde startTime hasta endTime
  updateIntervalMs?: number; // periodo de actualización en milisegundos
}

export const useDynamicAmount = ({
  startTime,
  endTime,
  offset,
  toAdd,
  updateIntervalMs = 10,
}: UseDynamicAmountParams) => {
  const [amount, setAmount] = useState(offset);
  useEffect(() => {
    const updateAmount = () => {
      const now = Math.floor(Date.now() / 1000);
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
