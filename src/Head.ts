import van from "vanjs-core";

const Head = () => {
  const { script } = van.tags;

  return [
    script({
      src: `https://maps.googleapis.com/maps/api/js?callback=initMap&v=weekly&key=${
        import.meta.env.VITE_API_KEY
      }&language=en`,
      defer: true,
    }),
  ];
};

van.add(document.head, Head());
