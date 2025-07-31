import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import classNames from "classnames";

export type Props<T> = {
  id: string;
  items: { id: string; label: string; value: T }[];
  value: string;
  onChange: (value: T) => void;
};

export function Select<T>(props: Props<T>) {
  const selectedItem = props.items.find((item) => item.value === props.value) || props.items[0];
  const onChange = (item: { id: string; label: string; value: T }) => {
    props.onChange(item.value);
  };

  return (
    <Listbox value={selectedItem} onChange={onChange} name={props.id}>
      {({ open }) => (
        <>
          <ListboxButton
            className={classNames(
              "relative flex w-full items-center justify-between rounded-sm border-2 bg-gray-800 px-3.5 py-2.5 transition duration-300",
              "focus:border-sky-500 focus:text-gray-100 focus:outline-none",
              "placeholder:text-gray-500",
              open ? "border-sky-500 text-gray-100" : "border-gray-600 text-gray-300",
            )}
          >
            <span>{selectedItem.label}</span>
            <span>
              <ChevronDownIcon
                className={classNames("size-5 transition duration-300", open ? "rotate-180" : "")}
              ></ChevronDownIcon>
            </span>
          </ListboxButton>
          <ListboxOptions
            anchor="bottom"
            className={
              "z-5002 w-(--button-width) divide-y divide-white/5 overflow-y-auto rounded-sm border-2 border-gray-700 bg-gray-800 shadow-lg shadow-black/20 [--anchor-gap:--spacing(1)] focus:outline-none"
            }
          >
            {props.items.map((item) => (
              <ListboxOption
                key={item.id}
                value={item}
                className="cursor-pointer px-4 py-2 text-gray-300 transition duration-300 hover:bg-gray-700 hover:text-gray-100"
              >
                {item.label}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </>
      )}
    </Listbox>
  );
}
