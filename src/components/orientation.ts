import van from "vanjs-core";
import * as vanX from "vanjs-ext";

const { p, button, div } = van.tags;

export const Orientation = () => {
  const ori = vanX.reactive<{
    alpha: number | null;
    gamma: number | null;
    beta: number | null;
  }>({
    alpha: null,
    gamma: null,
    beta: null,
  });

  const getOrientation = () => {
    window.addEventListener("deviceorientation", (event) => {
      ori.alpha = event.alpha;
      ori.gamma = event.gamma;
      ori.beta = event.beta;
    });
  };

  return div(
    () => p("Alpha: " + ori.alpha),
    () => p("Gamma: " + ori.gamma),
    () => p("Beta: " + ori.beta),
    button({ onclick: getOrientation }, "Get Orientation")
  );
};
