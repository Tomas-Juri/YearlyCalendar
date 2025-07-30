import { CheckIcon } from "@heroicons/react/24/solid";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Nullable } from "primereact/ts-helpers";
import { useEffect, useState } from "react";
import { Event } from "../../redux/eventsSlice";
import { DayType, DayTypes } from "../../types";
import { Button } from "../atoms";
import { Select } from "../atoms/Select";
import { ConfirmationButton, Field } from "../molecules";

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
        <Field
          id="title"
          label="Title"
          input={{ placeholder: "A wonderful event", type: "text", value: title, onChange: setTitle }}
        />
        <div className="flex gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="dates" className="text-sm text-gray-300">
              From{" "}
              <span className="text-red-600" title="Required">
                *
              </span>
            </label>
            <Calendar value={from} onChange={(e) => setFrom(e.value)} className="p-inputtext-sm bg-white" required />
            <Select<DayType>
              id="fromType"
              value={fromType}
              onChange={setFromType}
              items={DayTypes.map((type) => ({
                id: type.toLocaleLowerCase().replace(" ", "-"),
                label: type.toString(),
                value: type,
              }))}
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
              <Select<DayType>
                id="toType"
                value={toType}
                onChange={setToType}
                items={DayTypes.map((type) => ({
                  id: type.toLocaleLowerCase().replace(" ", "-"),
                  label: type.toString(),
                  value: type,
                }))}
              />
            )}
          </div>
        </div>

        <Field
          id="description"
          label="Description"
          input={{
            placeholder: "A detailed description of the event",
            type: "textarea",
            value: description,
            onChange: setDescription,
          }}
        />

        <div className="flex gap-3 pt-4">
          {props.mode === "edit" && (
            <ConfirmationButton
              text="Delete"
              onConfirm={() => props.onDelete()}
              message="Are you sure you want to delete this event?"
            />
          )}
          <div className="ml-auto flex gap-3">
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
