const handleVideo = (link: string) => {
  let newLink = link;
  const findLink = link.split(' ');
  for (let i = 0; i < findLink.length; i++) {
    if (
      findLink[i].includes('https://www.yout') ||
      findLink[i].includes('https://yout')
    ) {
      const embed = findLink[i].replace('watch?v=', 'embed/');
      newLink = embed.split('&')[0];
    }
  }
  return newLink;
};

const isArraysEqual = (a: string[], b: string[]) => {
  return (
    a.length === b.length &&
    a
      .slice()
      .sort()
      .every((val, index) => val === b.slice().sort()[index])
  );
};

const formatDateFr = (dateInput: Date): string => {
  const date = new Date(dateInput);

  const optionsDate: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };

  const rawDate = date.toLocaleDateString('fr-FR', optionsDate);
  const parts = rawDate.split(' '); // ["01", "mai", "2025"]

  if (parts.length !== 3) return rawDate; // fallback de sécurité

  const [day, month, year] = parts;
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day} ${capitalizedMonth} ${year} à ${hours}h${minutes}`;
};

const formatTextWithStrong = (value: string): string => {
  return value.replace(/([^:\n]+):\s*(.+)/g, (_, bold, rest) => {
    return `<p>${bold.trim()} : ${rest.trim()}</p>`;
  });
};

export { handleVideo, isArraysEqual, formatDateFr, formatTextWithStrong };
