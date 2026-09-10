import type { ToastType } from './ToastProvider';

type ToastHandler = (type: ToastType, message: string) => void;

let handler: ToastHandler | null = null;

/** Called by ToastProvider so API layer can emit toasts without React context. */
export function bindToastHandler(next: ToastHandler | null) {
  handler = next;
}

export function emitToast(type: ToastType, message: string) {
  handler?.(type, message);
}
