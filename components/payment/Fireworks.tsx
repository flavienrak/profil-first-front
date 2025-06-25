import React, { useEffect, useState } from 'react';

interface FireworkParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  delay: number;
  size: number;
  direction: number;
}

const Fireworks: React.FC = () => {
  const [particles, setParticles] = useState<FireworkParticle[]>([]);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // Arrêter l'animation après 30 secondes
    const timer = setTimeout(() => {
      setIsActive(false);
      setParticles([]);
    }, 30000);

    // Générer des particules de feu d'artifice
    const generateFireworks = () => {
      if (!isActive) return;

      const colors = [
        '#FFD700',
        '#FF6B6B',
        '#4ECDC4',
        '#45B7D1',
        '#96CEB4',
        '#FECA57',
        '#FF9FF3',
        '#54A0FF',
        '#FF3838',
        '#00D2D3',
      ];
      const newParticles: FireworkParticle[] = [];

      // Créer plusieurs explosions simultanées
      for (let explosion = 0; explosion < 4; explosion++) {
        const centerX = Math.random() * 70 + 15; // 15-85% de la largeur
        const centerY = Math.random() * 50 + 25; // 25-75% de la hauteur

        // Créer des particules pour chaque explosion
        for (let i = 0; i < 16; i++) {
          const angle = (i * 360) / 16;
          newParticles.push({
            id: Date.now() + explosion * 1000 + i,
            x: centerX,
            y: centerY,
            color: colors[Math.floor(Math.random() * colors.length)],
            delay: explosion * 0.2,
            size: Math.random() * 8 + 6,
            direction: angle,
          });
        }
      }

      setParticles((prev) => [...prev, ...newParticles]);

      // Nettoyer les anciennes particules
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => Date.now() - p.id < 3000));
      }, 3000);
    };

    // Démarrer immédiatement
    generateFireworks();

    // Continuer à générer des feux d'artifice
    const interval = setInterval(generateFireworks, 800);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isActive]);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {particles.map((particle, index) => (
        <div
          key={`particle-${particle.id}-${index}`}
          className="absolute animate-firework-burst z-10"
          style={
            {
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              backgroundColor: particle.color,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              borderRadius: '50%',
              boxShadow: `0 0 ${particle.size * 3}px ${particle.color}, 0 0 ${
                particle.size * 6
              }px ${particle.color}`,
              animationDelay: `${particle.delay}s`,
              animationDuration: '2.5s',
              '--direction': `${particle.direction}deg`,
              '--distance': `${80 + Math.random() * 40}px`,
            } as React.CSSProperties & {
              '--direction': string;
              '--distance': string;
            }
          }
        />
      ))}

      {/* Particules d'étincelles supplémentaires */}
      {isActive &&
        [...Array(30)].map((_, i) => (
          <div
            key={`spark-${i}`}
            className="absolute animate-spark z-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: '#FFD700',
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              boxShadow: '0 0 10px #FFD700',
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
    </div>
  );
};

export default Fireworks;
