import React, { useState } from 'react';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

interface CopyProps {
  text: string; // Texto que se copiará al portapapeles
  duration?: number; // Duración en milisegundos para mostrar el ícono de check (default: 2000ms)
}

const Copy = ({ text, duration = 2000 }: CopyProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      // Volver al ícono original después de la duración especificada
      setTimeout(() => setIsCopied(false), duration);
    } catch (error) {
      console.error('Failed to copy text to clipboard:', error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center p-2 bg-gray-200 hover:bg-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      title={isCopied ? 'Copied!' : 'Copy to clipboard'}
    >
      {isCopied ? (
        <CheckIcon
          className="h-6 w-6"
          style={{
            stroke: 'var(--success-color)',
          }}
        />
      ) : (
        <ClipboardIcon className="h-6 w-6" />
      )}
    </button>
  );
};

export default Copy;
