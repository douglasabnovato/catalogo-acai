/*
 * setup.ts · matchers do jest-dom para o Vitest e limpeza do DOM entre testes.
 */
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  localStorage.clear();
});
/* fim de setup.ts */
