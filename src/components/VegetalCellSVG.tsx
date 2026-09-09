import React from 'react';

interface Props {
  onPartClick?: (partId: number) => void;
  activePart?: number | null;
  className?: string;
}

export function VegetalCellSVG({ onPartClick, activePart, className = '' }: Props) {
  const handleClick = (partId: number) => {
    if (onPartClick) onPartClick(partId);
  };

  return (
    <svg viewBox="0 0 400 300" className={`w-full h-full ${className}`} role="img" aria-label="Ilustração da célula vegetal com suas partes">
      {/* Parede Celular - retângulo externo */}
      <rect x="20" y="20" width="360" height="260" rx="20" ry="20" 
        fill="none" stroke="#65a30d" strokeWidth="6"
        onClick={() => handleClick(1)} style={{ cursor: 'pointer' }} opacity={activePart === 1 ? 1 : 0.7} />
      
      {/* Membrana Celular */}
      <rect x="30" y="30" width="340" height="240" rx="15" ry="15" 
        fill="#fef9c3" stroke="#f59e0b" strokeWidth="3"
        onClick={() => handleClick(2)} style={{ cursor: 'pointer' }} opacity={activePart === 2 ? 1 : 0.5} />
      
      {/* Citoplasma */}
      <rect x="35" y="35" width="330" height="230" rx="12" ry="12" 
        fill="#e0f2fe" opacity="0.4"
        onClick={() => handleClick(7)} style={{ cursor: 'pointer' }} />
      
      {/* Vacúolo Central - grande */}
      <ellipse cx="200" cy="155" rx="100" ry="75" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="3"
        onClick={() => handleClick(4)} style={{ cursor: 'pointer' }} opacity={activePart === 4 ? 1 : 0.6} />
      
      {/* Cloroplastos */}
      <ellipse cx="80" cy="100" rx="22" ry="14" fill="#86efac" stroke="#22c55e" strokeWidth="2"
        onClick={() => handleClick(3)} style={{ cursor: 'pointer' }} opacity={activePart === 3 ? 1 : 0.7} />
      <ellipse cx="100" cy="200" rx="20" ry="12" fill="#86efac" stroke="#22c55e" strokeWidth="2"
        onClick={() => handleClick(3)} style={{ cursor: 'pointer' }} opacity={activePart === 3 ? 1 : 0.7} />
      <ellipse cx="320" cy="90" rx="18" ry="12" fill="#86efac" stroke="#22c55e" strokeWidth="2"
        onClick={() => handleClick(3)} style={{ cursor: 'pointer' }} opacity={activePart === 3 ? 1 : 0.7} />
      <ellipse cx="310" cy="220" rx="20" ry="13" fill="#86efac" stroke="#22c55e" strokeWidth="2"
        onClick={() => handleClick(3)} style={{ cursor: 'pointer' }} opacity={activePart === 3 ? 1 : 0.7} />
      
      {/* Núcleo */}
      <circle cx="140" cy="100" r="35" fill="#c4b5fd" stroke="#8b5cf6" strokeWidth="3"
        onClick={() => handleClick(5)} style={{ cursor: 'pointer' }} opacity={activePart === 5 ? 1 : 0.8} />
      <circle cx="140" cy="100" r="12" fill="#7c3aed" opacity="0.6" />
      
      {/* Mitocôndrias */}
      <ellipse cx="300" cy="130" rx="22" ry="13" fill="#fca5a5" stroke="#ef4444" strokeWidth="2"
        onClick={() => handleClick(6)} style={{ cursor: 'pointer' }} opacity={activePart === 6 ? 1 : 0.7} />
      <ellipse cx="280" cy="240" rx="18" ry="11" fill="#fca5a5" stroke="#ef4444" strokeWidth="2"
        onClick={() => handleClick(6)} style={{ cursor: 'pointer' }} opacity={activePart === 6 ? 1 : 0.7} />
      
      {/* Ribossomos */}
      <circle cx="120" cy="210" r="5" fill="#6ee7b7" stroke="#10b981" strokeWidth="1.5"
        onClick={() => handleClick(8)} style={{ cursor: 'pointer' }} opacity={activePart === 8 ? 1 : 0.7} />
      <circle cx="140" cy="225" r="4" fill="#6ee7b7" stroke="#10b981" strokeWidth="1.5"
        onClick={() => handleClick(8)} style={{ cursor: 'pointer' }} opacity={activePart === 8 ? 1 : 0.7} />
      <circle cx="100" cy="230" r="4" fill="#6ee7b7" stroke="#10b981" strokeWidth="1.5"
        onClick={() => handleClick(8)} style={{ cursor: 'pointer' }} opacity={activePart === 8 ? 1 : 0.7} />
      <circle cx="340" cy="170" r="5" fill="#6ee7b7" stroke="#10b981" strokeWidth="1.5"
        onClick={() => handleClick(8)} style={{ cursor: 'pointer' }} opacity={activePart === 8 ? 1 : 0.7} />
    </svg>
  );
}
