import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex items-start gap-3 my-2">
        <div className={`p-2.5 rounded-xl shrink-0 ${isDestructive ? 'bg-rose-950/80 text-rose-400 border border-rose-800' : 'bg-amber-950/80 text-amber-400 border border-amber-800'}`}>
          <AlertTriangle className="w-5 h-5" />
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{message}</p>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide text-white transition-all shadow-md ${
            isDestructive
              ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/30'
              : 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/30'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};
