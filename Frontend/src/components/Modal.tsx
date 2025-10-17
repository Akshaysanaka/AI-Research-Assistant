import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  fullScreen?: boolean;
}

export default function Modal({ isOpen, onClose, children, title, fullScreen = false }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`fixed ${fullScreen ? 'inset-4' : 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl'} bg-white rounded-2xl shadow-2xl z-50 ${fullScreen ? 'h-[calc(100vh-2rem)]' : 'max-h-[95vh]'} overflow-hidden`}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              {title && <h2 className="text-2xl font-bold text-gray-800">{title}</h2>}
              <button
                onClick={onClose}
                className="ml-auto p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className={`${fullScreen ? 'h-full' : 'p-6'}`}>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
