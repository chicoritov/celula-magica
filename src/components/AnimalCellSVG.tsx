import React from 'react';

interface Props {
  onPartClick?: (partId: number) => void;
  activePart?: number | null;
  className?: string;
}

export function AnimalCellSVG({ onPartClick, activePart, className = '' }: Props) {
  const handleClick = (partId: number) => {
    if (onPartClick) onPartClick(partId);
  };

  return (
    <svg viewBox="0 0 400 300" className={`w-full h-full ${className}`} role="img" aria-label="Ilustração da célula animal com suas partes">
      {/* Membrana celular - borda */}
      <ellipse cx="200" cy="150" rx="180" ry="130" fill="#fef3c7" stroke="#f59e0b" strokeWidth="4"
        onClick={() => handleClick(1)} style={{ cursor: 'pointer' }} opacity={activePart === 1 ? 1 : 0.7} />
      
      {/* Citoplasma */}
      <ellipse cx="200" cy="150" rx="170" ry="120" fill="#e0f2fe" opacity="0.6"
        onClick={() => handleClick(4)} style={{ cursor: 'pointer' }} />
      
      {/* Retículo Endoplasmático */}
      <path d="M80,100 Q100,80 120,100 Q140,120 120,140 Q100,160 80,140 Q60,120 80,100" 
        fill="none" stroke="#f97316" strokeWidth="3" opacity={activePart === 6 ? 1 : 0.6}
        onClick={() => handleClick(6)} style={{ cursor: 'pointer' }} />
      <path d="M90,110 Q110,90 130,110 Q150,130 130,150" 
        fill="none" stroke="#f97316" strokeWidth="2" opacity={activePart === 6 ? 1 : 0.5} />
      
      {/* Núcleo */}
      <circle cx="180" cy="130" r="45" fill="#c4b5fd" stroke="#8b5cf6" strokeWidth="3"
        onClick={() => handleClick(2)} style={{ cursor: 'pointer' }} opacity={activePart === 2 ? 1 : 0.8} />
      <circle cx="180" cy="130" r="15" fill="#7c3aed" opacity="0.6" />
      
      {/* Mitocôndrias */}
      <ellipse cx="290" cy="110" rx="25" ry="15" fill="#fca5a5" stroke="#ef4444" strokeWidth="2"
        onClick={() => handleClick(3)} style={{ cursor: 'pointer' }} opacity={activePart === 3 ? 1 : 0.7} />
      <path d="M275,110 Q280,100 285,110 Q290,120 295,110 Q300,100 305,110" 
        fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.5" />
      
      <ellipse cx="310" cy="160" rx="20" ry="12" fill="#fca5a5" stroke="#ef4444" strokeWidth="2"
        onClick={() => handleClick(3)} style={{ cursor: 'pointer' }} opacity={activePart === 3 ? 1 : 0.7} />
      
      {/* Ribossomos */}
      <circle cx="260" cy="180" r="5" fill="#6ee7b7" stroke="#10b981" strokeWidth="1.5"
        onClick={() => handleClick(5)} style={{ cursor: 'pointer' }} opacity={activePart === 5 ? 1 : 0.7} />
      <circle cx="275" cy="195" r="4" fill="#6ee7b7" stroke="#10b981" strokeWidth="1.5"
        onClick={() => handleClick(5)} style={{ cursor: 'pointer' }} opacity={activePart === 5 ? 1 : 0.7} />
      <circle cx="250" cy="200" r="4" fill="#6ee7b7" stroke="#10b981" strokeWidth="1.5"
        onClick={() => handleClick(5)} style={{ cursor: 'pointer' }} opacity={activePart === 5 ? 1 : 0.7} />
      
      {/* Complexo de Golgi */}
      <path d="M230,210 Q250,200 270,210" fill="none" stroke="#ec4899" strokeWidth="3"
        onClick={() => handleClick(7)} style={{ cursor: 'pointer' }} opacity={activePart === 7 ? 1 : 0.7} />
      <path d="M235,220 Q255,210 275,220" fill="none" stroke="#ec4899" strokeWidth="3"
        onClick={() => handleClick(7)} style={{ cursor: 'pointer' }} opacity={activePart === 7 ? 1 : 0.7} />
      <path d="M240,230 Q260,220 280,230" fill="none" stroke="#ec4899" strokeWidth="3"
        onClick={() => handleClick(7)} style={{ cursor: 'pointer' }} opacity={activePart === 7 ? 1 : 0.7} />
      
      {/* Lisossomos */}
      <circle cx="320" cy="170" r="12" fill="#bef264" stroke="#84cc16" strokeWidth="2"
        onClick={() => handleClick(8)} style={{ cursor: 'pointer' }} opacity={activePart === 8 ? 1 : 0.7} />
      <circle cx="340" cy="190" r="8" fill="#bef264" stroke="#84cc16" strokeWidth="2"
        onClick={() => handleClick(8)} style={{ cursor: 'pointer' }} opacity={activePart === 8 ? 1 : 0.7} />
    </svg>
  );
}
