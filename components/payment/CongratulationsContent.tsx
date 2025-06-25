import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const CongratulationsContent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation d'apparition progressive
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen p-8 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Logo en haut de la page */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-30">
        <Image
          src="/logo.png"
          alt="Logo Profil First"
          className="object-contain logo-enhanced"
          height={80}
          width={600}
        />
      </div>

      {/* Titre principal avec effet de glow */}
      <div className="text-center mb-8">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 animate-pulse-glow">
          Félicitations !
        </h1>
        <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full animate-shimmer"></div>
      </div>

      {/* Message secondaire */}
      <p className="text-xl md:text-2xl text-purple-100 text-center mb-12 font-bold tracking-wide animate-fade-in-up">
        Votre achat a bien été effectué
      </p>

      {/* Bouton de retour avec animation */}
      <Link
        href={'/mon-plan'}
        className="group relative px-16 py-6 text-xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl border-2 border-white transform transition-all duration-300 hover:scale-110 hover:shadow-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95 animate-button-pulse z-50"
      >
        <span className="relative z-50">Revenir sur Profil First</span>
      </Link>

      {/* Particules flottantes pour l'ambiance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={`firework-${i}`}
            className="absolute animate-float z-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            <div
              className="w-2 h-2 bg-white rounded-full opacity-30 z-10"
              style={{
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CongratulationsContent;
