import { useEffect, useRef } from 'react';

function useDelayedExecution(
  callback: () => Promise<void>,
  dependencies: any[],
  delay: number,
) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Limpiar el timeout existente para reiniciar el contador si cambia alguna dependencia
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Crear un nuevo timeout
    timeoutRef.current = setTimeout(() => {
      callback();
    }, delay);

    // Limpiar el timeout si el componente se desmonta o si cambian las dependencias
    return () => clearTimeout(timeoutRef.current);
  }, dependencies);
}

export default useDelayedExecution;
