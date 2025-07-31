import classNames from "classnames";

type Size = "regular" | "small";

type Props = {
  variant: "danger" | "gray" | "primary";
  text: string;
  icon?: React.ForwardRefExoticComponent<
    React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
      title?: string;
      titleId?: string;
    } & React.RefAttributes<SVGSVGElement>
  >;
  type?: "button" | "submit";
  size?: Size;
  onClick?: () => void;
  confirmation?: string;
  disabled?: boolean;
  fullWidth?: boolean;
};

export const Button = ({
  variant,
  text,
  type = "button",
  size = "regular",
  fullWidth,
  onClick,
  icon,
  disabled,
}: Props) => {
  const Icon = icon;

  return (
    <button
      type={type}
      onClick={() => {
        onClick?.();
      }}
      className={classNames(
        "flex cursor-pointer items-center gap-2.5 rounded-sm font-medium transition duration-300 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60",
        fullWidth && "w-full justify-center text-center",
        variant === "primary" && "bg-sky-700 text-white hover:bg-sky-800 focus:ring-sky-600",
        variant === "danger" && "bg-red-600 text-red-50 hover:bg-red-700 hover:text-red-100",
        variant === "gray" && "text-gray-300 hover:bg-gray-600 hover:text-gray-100",
        size === "small" && "px-4 py-2.5 text-sm",
        size === "regular" && "px-6 py-3 text-base",
      )}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {Icon && (
        <span>
          <Icon
            className={classNames("-ml-2 inline-block", size === "small" && "size-4", size === "regular" && "size-5")}
          />
        </span>
      )}
      <span>{text}</span>
    </button>
  );
};
