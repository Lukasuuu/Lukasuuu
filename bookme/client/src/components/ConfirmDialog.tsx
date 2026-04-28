import { AlertCircle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDangerous = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-sm">
        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              isDangerous ? 'bg-red-500/20' : 'bg-blue-500/20'
            }`}
          >
            <AlertCircle
              size={24}
              className={isDangerous ? 'text-red-400' : 'text-blue-400'}
            />
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-bold text-white mb-2">{title}</h2>
            <p className="text-foreground/70 mb-6">{message}</p>

            <div className="flex gap-3">
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-background/50 transition-colors disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 px-4 py-2 rounded-lg text-white font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                  isDangerous
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Processando...
                  </>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>

          <button
            onClick={onCancel}
            disabled={isLoading}
            className="text-foreground/50 hover:text-foreground transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
