import { useRef, useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Icon3DProps {
  icon: LucideIcon;
  className?: string;
  size?: number;
  color?: string;
  animate?: boolean;
}

export const Icon3D = ({ 
  icon: Icon, 
  className, 
  size = 24, 
  color = "currentColor",
  animate = true 
}: Icon3DProps) => {
  const iconRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!animate || !iconRef.current) return;
    
    const rect = iconRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * 15;
    const rotateY = ((x - centerX) / centerX) * 15;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    if (!animate) return;
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      ref={iconRef}
      className={cn("inline-flex items-center justify-center transform-3d", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: animate
          ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
          : undefined,
        transition: 'transform 0.2s ease-out',
      }}
    >
      <Icon 
        size={size} 
        color={color}
        className="drop-shadow-lg"
      />
    </div>
  );
};
