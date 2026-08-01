import { useEffect, useRef } from 'react';
import markupHtml from './site/markup.html?raw';

// Original inline <script> blocks, extracted in their exact original order.
// They're imported as raw text (not executed by React) and injected as real
// <script> elements on mount, which is the only way browser-native code like
// this (GSAP timelines, IntersectionObservers, canvas drawing, DOM-id based
// pagination controller, etc.) keeps working unmodified inside React.
import ageCalc from './site/scripts/age-calc.js?raw';
import globalStateHelpers from './site/scripts/global-state-helpers.js?raw';
import galleryReasonsQuiz from './site/scripts/gallery-reasons-quiz.js?raw';
import scratchCard from './site/scripts/scratch-card.js?raw';
import paginationPart1 from './site/scripts/pagination-part1.js?raw';
import paginationPart2 from './site/scripts/pagination-part2.js?raw';

import './styles.css';

// IMPORTANT: this must stay in the same order as the original <script> tags
// appeared in index.html, because later blocks reference top-level
// const/let bindings and DOM elements created by earlier ones.
const SITE_SCRIPTS = [
  ageCalc,
  globalStateHelpers,
  galleryReasonsQuiz,
  scratchCard,
  paginationPart1,
  paginationPart2,
];

export default function App() {
  const hasRun = useRef(false);
  const injectedScriptEls = useRef([]);

  useEffect(() => {
    // Guard against React 18 StrictMode's double-invoke of effects in dev,
    // which would otherwise register every event listener twice.
    if (hasRun.current) return;
    hasRun.current = true;

    SITE_SCRIPTS.forEach((code) => {
      const el = document.createElement('script');
      el.text = code;
      document.body.appendChild(el);
      injectedScriptEls.current.push(el);
    });

    return () => {
      injectedScriptEls.current.forEach((el) => el.remove());
      injectedScriptEls.current = [];
    };
  }, []);

  // eslint-disable-next-line react/no-danger
  return <div dangerouslySetInnerHTML={{ __html: markupHtml }} />;
}
