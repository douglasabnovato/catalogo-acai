/*
 * Dialog.tsx · modal acessível: role="dialog", título ligado, Esc fecha, foco entra no diálogo,
 * Tab fica preso nele e volta ao elemento que abriu (WCAG 2.1.2 e 2.4.3).
 */
import { useEffect, useRef, type ReactNode } from 'react';

interface DialogProps {
  titleId: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

const FOCUSABLE = 'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])';

/* Renderiza o fundo escuro e o painel do diálogo. */
export function Dialog({ titleId, onClose, children, className = '' }: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    /* Esc fecha; Tab circula entre os elementos do diálogo. */
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab' || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => !el.hasAttribute('disabled'));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      previous?.focus();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`bg-zinc-900 border border-zinc-800 w-full rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
/* fim de Dialog.tsx */
