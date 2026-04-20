import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './design-tokens/primitives.css';        /* --ref-* palette (internal)           */
import './design-tokens/system.css';            /* --sys-* semantic colours             */
import './design-tokens/typography.css';        /* --type-* / --font-* tokens           */
import './design-tokens/component/button.css';  /* button sizing/shape tokens           */
import './design-tokens/component/chip.css';    /* chip sizing/shape tokens             */
import './design-tokens/component/input.css';   /* input/select sizing/colour tokens    */
import './design-tokens/breakpoints.css';        /* responsive viewport defaults         */
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
