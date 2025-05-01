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

export { handleVideo };
