import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  return (
    <Transition show={isOpen} as={Fragment} appear>
      <Dialog as="div" className="relative z-10" open={isOpen} onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm" aria-hidden="true" />
        </TransitionChild>

        <div className="fixed inset-0 flex flex-col justify-center items-center p-4 sm:p-6">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="flex flex-col w-full max-w-md relative bg-stone-900/50 backdrop-blur-sm border border-stone-700/30 rounded-xl shadow-xl transform transition-all">
              <div className="flex-1 p-4 sm:p-6">
                <button
                  aria-label="Close editor"
                  className="absolute right-3 top-3 sm:right-4 sm:top-4 text-gray-500 hover:text-gray-400 focus:outline-none p-1 focus:ring-2 focus:ring-green-500/30 rounded-lg"
                  onClick={onClose}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
                <DialogTitle as="h3" className="text-xl font-medium text-gray-200 text-center mb-6 pr-8">
                  {title}
                </DialogTitle>
                {children}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}; 