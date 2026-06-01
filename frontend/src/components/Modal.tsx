import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

type ModalProps = {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};

export const Modal = ({ title, open, onOpenChange, children }: ModalProps) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/45" />
      <Dialog.Content className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-white p-4 md:left-1/2 md:top-1/2 md:w-[600px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl">
        <Dialog.Title className="font-heading text-xl">{title}</Dialog.Title>
        <div className="mt-4">{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
