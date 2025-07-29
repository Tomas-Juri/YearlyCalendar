import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Button } from "../atoms";

type Props = {
  text: string;
  message: string;
  onConfirm: () => void;
};

export const ConfirmationButton = ({ message, onConfirm }: Props) => {
  return (
    <Popover className="relative">
      <PopoverButton className="cursor-pointer rounded-md px-6 py-3 font-medium text-red-500 transition duration-300 hover:bg-red-700 hover:text-red-50 focus:bg-red-700 focus:text-red-50 focus:outline-none">
        Delete
      </PopoverButton>
      <PopoverPanel
        anchor="top"
        transition
        className="data-closed:translate-y-1/2 data-closed:scale-0 data-closed:opacity-0 z-[10000] mt-2 flex flex-col space-y-3.5 rounded-lg border-2 border-gray-600 bg-gray-700 px-4 pb-4 pt-5 shadow transition duration-200 ease-out"
      >
        {({ close }) => (
          <>
            <p className="flex gap-2 text-sm text-gray-100">
              <ExclamationTriangleIcon className="size-5" />
              <span>{message}</span>
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="gray"
                text="Cancel"
                size="small"
                onClick={() => {
                  close();
                }}
              />
              <Button
                variant="danger"
                text="Confirm"
                size="small"
                onClick={() => {
                  close();
                  onConfirm();
                }}
              />
            </div>
          </>
        )}
      </PopoverPanel>
    </Popover>
  );
};
