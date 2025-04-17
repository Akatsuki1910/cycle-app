import van from "vanjs-core";

const { script, link } = van.tags;

const Head = () => {
  return [
    link({
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    }),
    link({
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "true",
    }),
    link({
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&display=swap",
    }),
    script({
      src: `https://maps.googleapis.com/maps/api/js?callback=initMap&v=weekly&key=${
        import.meta.env.VITE_API_KEY
      }&language=en`,
      defer: true,
    }),
  ];
};

van.add(document.head, Head());
