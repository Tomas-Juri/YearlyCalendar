import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { closeEditEventModal, confirmEditEventModal } from "../../redux/eventsSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { DayType, DayTypes } from "../../types";
import { compareDates } from "../../utilities/date";
import { Button, DatePicker } from "../atoms";
import { Select } from "../atoms/Select";
import { ConfirmationButton, Field } from "../molecules";

export interface EventFormData {
  title: string;
  description: string;
  from: Date;
  to: Date;
  fromType: DayType;
  toType: DayType;
}

export const EditEventModal = () => {
  const dispatch = useAppDispatch();
  const { opened, event } = useAppSelector((state) => state.events.editEventModal);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [from, setFrom] = useState<Date | null>(null);
  const [fromType, setFromType] = useState<DayType>("Full day");
  const [to, setTo] = useState<Date | null>(null);
  const [toType, setToType] = useState<DayType>("Full day");

  useEffect(() => {
    if (!event) {
      return;
    }

    setTitle(event.title);
    setDescription(event.description);
    setFrom(event.from);
    setFromType(event.fromType);
    setTo(event.to);
    setToType(event.toType);
  }, [opened, event]);

  useEffect(() => {
    if (from && to === null) {
      setTo(from);
    }
  }, [from, to]);

  const onClose = () => {
    dispatch(closeEditEventModal());
  };

  const onConfirm = (data: EventFormData) => {
    dispatch(confirmEditEventModal(data));
  };

  const onDelete = () => {
    if (event) {
      dispatch(confirmEditEventModal(event));
    }
  };

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
  const fromDayTypes = compareDates(from, to) ? DayTypes : DayTypes.filter((type) => type !== "2nd Half");
  const toDayTypes = compareDates(from, to) ? [] : DayTypes.filter((type) => type !== "1st Half");

  return (
    <Dialog open={opened} onClose={onClose} className="">
      <DialogBackdrop className="fixed inset-0 z-5000 bg-black/60" />
      <div className="fixed inset-0 z-5001 flex w-screen items-center justify-center">
        <DialogPanel className="max-w-lg min-w-[28rem] space-y-6 rounded-sm border-2 border-white/5 bg-gray-950 px-8 pt-8 pb-6">
          <DialogTitle className="text-xl font-semibold text-gray-100">Edit event</DialogTitle>
          <form action="" className="space-y-4" onSubmit={handleSubmit}>
            <Field
              id="title"
              label="Title"
              input={{ placeholder: "A wonderful event", type: "text", value: title, onChange: setTitle }}
            />
            <div className="space-y-1.5">
              <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                  <label htmlFor="dates" className="text-sm text-gray-300">
                    From{" "}
                    <span className="text-red-600" title="Required">
                      *
                    </span>
                  </label>
                  <DatePicker value={from} onChange={setFrom}></DatePicker>
                </div>
                <div className="flex-1 space-y-1">
                  <label htmlFor="dates" className="text-sm text-gray-300">
                    To{" "}
                    <span className="text-red-600" title="Required">
                      *
                    </span>
                  </label>
                  <DatePicker value={to} onChange={setTo}></DatePicker>
                </div>
              </div>
              <div className="flex gap-4">
                <Select<DayType>
                  id="fromType"
                  value={fromType}
                  onChange={setFromType}
                  items={fromDayTypes.map((type) => ({
                    id: type.toLocaleLowerCase().replace(" ", "-"),
                    label: type.toString(),
                    value: type,
                  }))}
                />
                {toDayTypes.length > 0 && (
                  <Select<DayType>
                    id="toType"
                    value={toType}
                    onChange={setToType}
                    items={toDayTypes.map((type) => ({
                      id: type.toLocaleLowerCase().replace(" ", "-"),
                      label: type.toString(),
                      value: type,
                    }))}
                  />
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-1 flex-col gap-1"></div>

              <div className="flex flex-1 flex-col gap-1"></div>
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
              <ConfirmationButton
                text="Delete"
                onConfirm={() => onDelete()}
                message="Are you sure you want to delete this event?"
              />
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
        </DialogPanel>
      </div>
    </Dialog>
  );
};
