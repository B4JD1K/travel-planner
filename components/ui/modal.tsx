import {Dialog} from "radix-ui";
import {XIcon} from "lucide-react";
import {ReactNode} from "react";

export default function Modal({open, onOpenChange, children}:
                              {
                                open: boolean,
                                onOpenChange?: (open: boolean) => void,
                                children: ReactNode,
                              }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog.Root>
  )
}

function Content({title, children}:
                 {
                   title?: string,
                   children: ReactNode
                 }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50
              data-[state=open]:animate-[dialog-overlay-show_300ms] data-[state=closed]:animate-[dialog-overlay-hide_300ms]">
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-1/2 max-w-md w-full rounded-md bg-white p-8 text-gray-900 shadow
              data-[state=open]:animate-[dialog-content-show_300ms] data-[state=closed]:animate-[dialog-content-hide_300ms]">
          <div className="flex justify-between items-center mb-6 text-gray-700">
            <Dialog.Title className="text-xl font-semibold">{title}</Dialog.Title>
            <Dialog.Close className="text-gray-400 hover:text-gray-600 hover:cursor-pointer"><XIcon/></Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Portal>
  )
}

Modal.Content = Content;
Modal.Trigger = Dialog.Trigger;
Modal.Close = Dialog.Close;