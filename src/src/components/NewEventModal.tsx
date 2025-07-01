import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useEffect, useState } from "react";
import {
  closeAddEventModal,
  confirmAddEventModal,
  DayType,
} from "../redux/eventsSlice";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { Nullable } from "primereact/ts-helpers";
import { Dropdown } from "primereact/dropdown";

export const NewEventModal = () => {
  const modal = useAppSelector((state) => state.addEventModal);
  const dispatch = useAppDispatch();
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
    setTitle("");
    setDescription("");
    setFrom(modal.prefillDate ?? null);
    setFromType("Full day");
    setTo(null);
    setToType("Full day");
  }, [modal.opened]);

  useEffect(() => {
    if (from && to === null) {
      setTo(from);
    }
  }, [from, to]);

  return (
    <Dialog
      header="Add new Event"
      visible={modal.opened}
      draggable={false}
      resizable={false}
      closeOnEscape
      dismissableMask
      className="w-[28rem]"
      onHide={() => {
        dispatch(closeAddEventModal());
      }}
      headerClassName="bg-slate-50"
      contentClassName="bg-slate-50"
    >
      <form
        action=""
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();

          if (from && to)
            dispatch(
              confirmAddEventModal({
                title,
                description,
                from,
                fromType,
                to,
                toType,
              })
            );
        }}
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="text-sm">
            Title <span className="text-red-600" title="Required">*</span>
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
            <label htmlFor="dates" className="text-sm">
              From <span className="text-red-600" title="Required">*</span>
            </label>
            <Calendar
              value={from}
              onChange={(e) => setFrom(e.value)}
              className="p-inputtext-sm bg-white"
              required
            />
            <Dropdown
              value={fromType}
              onChange={(e) => setFromType(e.value)}
              options={items}
              optionLabel="name"
              className="p-inputtext-sm bg-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="dates" className="text-sm">
              To <span className="text-red-600" title="Required">*</span>
            </label>
            <Calendar
              value={to}
              onChange={(e) => setTo(e.value)}
              className="p-inputtext-sm bg-white"
              required
            />
            <Dropdown
              value={toType}
              onChange={(e) => setToType(e.value)}
              options={items}
              optionLabel="name"
              className="p-inputtext-sm bg-white"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm">
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
        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            severity="secondary"
            label="Cancel"
            text
            onClick={() => dispatch(closeAddEventModal())}
          />
          <Button
            type="submit"
            label="Confirm"
            icon="pi pi-check"
            disabled={
              !title.trim() || !from || !to
            }
          />
        </div>
      </form>
    </Dialog>
  );
};
