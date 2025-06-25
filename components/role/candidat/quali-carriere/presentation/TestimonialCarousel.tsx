import React, { useState, useEffect } from 'react';
import { TestimonialCard } from './TestimonialCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    name: "Sofiane",
    role: "Business Developer",
    content: "L'IA m'a sorti un paragraphe parfait sur mon stage de 2018. Je l'ai repris tel quel dans mon pitch. Gain de temps énorme.",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  },
  {
    name: "Julien",
    role: "Directeur Commercial",
    content: "J'ai enfin une narration claire sur mes 15 ans d'expérience. L'IA a structuré mes résultats, mon rôle de manager, et mes impacts terrain en quelques minutes.",
    avatar: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  },
  {
    name: "Sébastien",
    role: "Consultant en marketing digital",
    content: "C'est ultra précis. Chaque mission est transformée en argument de vente. Parfait pour candidater ou pitcher face à un client.",
    avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  },
  {
    name: "Élodie",
    role: "UX Designer senior",
    content: "J'ai toujours eu du mal à formuler mes apports dans les projets. Là, on capte tout de suite ce que j'ai amélioré dans l'expérience utilisateur.",
    avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  },
  {
    name: "Manon",
    role: "Juriste en droit social",
    content: "J'ai été surprise par la justesse de la synthèse. C'est rigoureux, sobre, et ça met en valeur la complexité de mes dossiers sans jargon inutile.",
    avatar: "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  },
  {
    name: "Pascal",
    role: "Responsable de production",
    content: "La synthèse m'a permis de mieux présenter mes responsabilités, mes résultats concrets, et surtout mes compétences en gestion d'équipe et résolution de crise.",
    avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  },
  {
    name: "Armand",
    role: "Consultant en transformation digitale",
    content: "C'est plus qu'un outil : c'est une prise de recul sur tout ce que j'ai fait. Idéal pour repenser son positionnement et ajuster son pitch de transition.",
    avatar: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  },
  {
    name: "Lina",
    role: "Étudiante en Master RH",
    content: "Je me sentais illégitime avec mes petites expériences. Là, tout est valorisé. Et j'ai découvert des skills que je n'aurais jamais pensé nommer.",
    avatar: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  },
  {
    name: "Moussa",
    role: "Contrôleur de gestion",
    content: "L'outil m'a aidé à structurer mes analyses financières et mes recommandations stratégiques. Mes compétences en pilotage budgétaire sont maintenant clairement mises en avant.",
    avatar: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
  }
];

export const TestimonialCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const itemsPerView = 3;
  const maxIndex = Math.ceil(testimonials.length / itemsPerView) - 1;

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 10000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const getCurrentTestimonials = () => {
    const start = currentIndex * itemsPerView;
    return testimonials.slice(start, start + itemsPerView);
  };

  return (
    <div className="relative">
      {/* Navigation buttons */}
      <div className="flex justify-center mb-6 gap-4">
        <button
          onClick={goToPrevious}
          className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={goToNext}
          className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Testimonials grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[280px]">
        {getCurrentTestimonials().map((testimonial, index) => (
          <div key={`${currentIndex}-${index}`} className="animate-fade-in">
            <TestimonialCard {...testimonial} />
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="flex justify-center mt-8 gap-2">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAutoPlaying(false);
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-blue-500 w-6' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};