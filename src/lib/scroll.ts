import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let rafStarted = false;

export function getLenis(): Lenis | null {
  return lenis;
}

export function initSmoothScroll(): Lenis {
  if (lenis) return lenis;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  lenis = new Lenis({
    duration: 1.5,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: !reduced,
    wheelMultiplier: 1,
    touchMultiplier: 1.6
  });

  lenis.on("scroll", ScrollTrigger.update);
  if (!rafStarted) {
    rafStarted = true;
    gsap.ticker.add((time) => {
      lenis?.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  return lenis;
}

export function scrollToTop() {
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.4 });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

export function scrollToElement(target: string | HTMLElement, offset = -88) {
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.4 });
  } else if (typeof target === "string") {
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function navigateTo(href: string) {
  const [base, hash] = href.split("#");
  const currentPath = window.location.pathname.replace(/\/$/, "");
  if ((!base || base.replace(/\/$/, "") === currentPath) && hash) {
    const el = document.getElementById(hash);
    if (el) {
      window.history.pushState({}, "", href);
      scrollToElement(el);
      return;
    }
  }
  window.history.pushState({}, "", href);
  scrollToTop();
  window.dispatchEvent(new PopStateEvent("popstate"));
}