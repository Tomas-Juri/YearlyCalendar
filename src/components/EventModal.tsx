import { CheckIcon } from "@heroicons/react/24/solid";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Nullable } from "primereact/ts-helpers";
import { useEffect, useState } from "react";
import { DayType, Event } from "../redux/eventsSlice";
import { Button } from "./atoms";
import { ConfirmationButton } from "./molecules";

type EventModalProps =
  | {
      mode: "add";
      visible: boolean;
      onClose: () => void;
      onConfirm: (data: EventFormData) => void;
      prefillDate?: Date;
      existingEvent?: never;
    }
  | {
      mode: "edit";
      visible: boolean;
      onClose: () => void;
      onConfirm: (data: EventFormData) => void;
      onDelete: () => void;
      existingEvent: Event;
      prefillDate?: never;
    };

export interface EventFormData {
  title: string;
  description: string;
  from: Date;
  to: Date;
  fromType: DayType;
  toType: DayType;
}

export const EventModal = (props: EventModalProps) => {
  const { mode, visible, onClose, onConfirm } = props;

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [from, setFrom] = useState<Nullable<Date>>(null);
  const [fromType, setFromType] = useState<DayType>("Full day");
  const [to, setTo] = useState<Nullable<Date>>(null);
  const [toType, setToType] = useState<DayType>("Full day");

  const items = [
    { name: "Full day", value: "Full day" },
    { name: "1st Half", value: "1st Half" },
    { name: "2nd Half", value: "2nd Half" },
  ];

  useEffect(() => {
    if (mode === "add") {
      setTitle("");
      setDescription("");
      setFrom(props.prefillDate ?? null);
      setFromType("Full day");
      setTo(null);
      setToType("Full day");
    } else {
      setTitle(props.existingEvent.title);
      setDescription(props.existingEvent.description);
      setFrom(props.existingEvent.from);
      setFromType(props.existingEvent.fromType);
      setTo(props.existingEvent.to);
      setToType(props.existingEvent.toType);
    }
  }, [mode, visible, props]);

  useEffect(() => {
    if (from && to === null) {
      setTo(from);
    }
  }, [from, to]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (from && to) {
      onConfirm({
        title,
        description,
        from,
        fromType,
        to,
        toType,
      });
    }
  };

  const headerText = mode === "add" ? "Add new Event" : "Edit Event";

  return (
    <Dialog
      header={headerText}
      visible={visible}
      draggable={false}
      resizable={false}
      closeOnEscape
      dismissableMask
      className={mode === "add" ? "w-[28rem]" : "w-[32rem]"}
      onHide={onClose}
      headerClassName="bg-gray-900 text-gray-100"
      contentClassName="bg-gray-900"
    >
      <form action="" className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="text-sm text-gray-300">
            Title{" "}
            <span className="text-red-600" title="Required">
              *
            </span>
          </label>
          <InputText
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id="title"
            className="p-inputtext-sm bg-white"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="dates" className="text-sm text-gray-300">
              From{" "}
              <span className="text-red-600" title="Required">
                *
              </span>
            </label>
            <Calendar value={from} onChange={(e) => setFrom(e.value)} className="p-inputtext-sm bg-white" required />
            <Dropdown
              value={fromType}
              onChange={(e) => setFromType(e.value)}
              options={items}
              optionLabel="name"
              className="p-inputtext-sm bg-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="dates" className="text-sm text-gray-300">
              To{" "}
              <span className="text-red-600" title="Required">
                *
              </span>
            </label>
            <Calendar value={to} onChange={(e) => setTo(e.value)} className="p-inputtext-sm" required />
            {from && to && from.toDateString() !== to.toDateString() && (
              <Dropdown
                value={toType}
                onChange={(e) => setToType(e.value)}
                options={items}
                optionLabel="name"
                className="p-inputtext-sm"
              />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm text-gray-300">
            Description
          </label>
          <InputTextarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id="description"
            className="p-inputtext-sm bg-white"
            rows={8}
          />
        </div>

        <div className={`flex gap-3 pt-4 ${mode === "edit" ? "justify-between" : "justify-end"}`}>
          {props.mode === "edit" && (
            <ConfirmationButton
              text="Delete"
              onConfirm={() => props.onDelete()}
              message="Are you sure you want to delete this event?"
            />
          )}
          <div className="flex gap-3">
            <Button variant="gray" size="regular" text="Cancel" onClick={onClose} />
            <Button
              type="submit"
              variant="primary"
              size="regular"
              text="Confirm"
              icon={CheckIcon}
              disabled={!title.trim() || !from || !to}
            />
          </div>
        </div>
      </form>
    </Dialog>
  );
};
