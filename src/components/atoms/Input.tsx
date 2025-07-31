import { Input as HeadlessUiInput, Textarea as HeadlessUiTextarea } from "@headlessui/react";
import classNames from "classnames";

export type Props = {
  id: string;
  placeholder?: string;
} & (
  | { type: "text"; value: string; onChange?: (value: string) => void }
  | { type: "textarea"; value: string; onChange?: (value: string) => void }
  | { type: "number"; value: number; onChange?: (value: number) => void }
);

export const Input = (props: Props) => {
  if (props.type === "textarea") {
    return (
      <HeadlessUiTextarea
        id={props.id}
        name={props.id}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => {
          props.onChange?.(e.target.value);
        }}
        className={classNames(
          "block w-full rounded-sm border-2 border-gray-600 bg-gray-800 px-3.5 py-3 text-gray-300 transition duration-300",
          "focus:border-sky-500 focus:text-gray-100 focus:outline-none",
          "placeholder:text-gray-600",
        )}
        rows={8}
      />
    );
  }

  return (
    <HeadlessUiInput
      type={props.type}
      id={props.id}
      name={props.id}
      placeholder={props.placeholder}
      value={props.value}
      onChange={(e) => {
        if (props.type === "text") {
          props.onChange?.(e.target.value);
        } else if (props.type === "number") {
          const value = parseFloat(e.target.value);
          if (!isNaN(value)) {
            props.onChange?.(value);
          }
        }
      }}
      className={classNames(
        "block w-full rounded-sm border-2 border-gray-600 bg-gray-800 px-3.5 py-2.5 text-gray-300 transition duration-300",
        "focus:border-sky-500 focus:text-gray-100 focus:outline-none",
        "placeholder:text-gray-500",
      )}
    />
  );
};
