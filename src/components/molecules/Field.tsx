import { DistributiveOmit } from "../../types";
import { Input, type Props as InputProps } from "../atoms/Input";

type Props = {
  id: string;
  label: string;
} & { input: DistributiveOmit<InputProps, "id"> };

export const Field = (props: Props) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm tracking-wide text-gray-300" htmlFor={props.id}>
        {props.label}
      </label>
      {"input" in props && <Input id={props.id} {...props.input} />}
    </div>
  );
};
