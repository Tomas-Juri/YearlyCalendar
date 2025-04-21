import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useEffect, useState } from "react";
import {
  closeEditEventModal,
  confirmEditEventModal,
  DayType,
} from "../redux/eventsSlice";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { Nullable } from "primereact/ts-helpers";
import { Dropdown } from "primereact/dropdown";

export const EditEventModal = () => {
  const modal = useAppSelector((state) => state.editEventModal);
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
    setTitle(modal.opened ? modal.event.title : "");
    setDescription(modal.opened ? modal.event.description : "");
    setFrom(modal.opened ? modal.event.from : null);
    setFromType(modal.opened ? modal.event.fromType : "Full day");
    setTo(modal.opened ? modal.event.to : null);
    setToType(modal.opened ? modal.event.toType : "Full day");
  }, [modal]);

  return (
    <Dialog
      header="Edit Event"
      visible={modal.opened}
      draggable={false}
      resizable={false}
      closeOnEscape
      dismissableMask
      className="w-[32rem]"
      onHide={() => {
        dispatch(closeEditEventModal());
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
              confirmEditEventModal({
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
            Title
          </label>
          <InputText
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id="title"
            className="p-inputtext-sm bg-white"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="dates" className="text-sm">
              From
            </label>
            <Calendar
              value={from}
              onChange={(e) => setFrom(e.value)}
              className="p-inputtext-sm bg-white"
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
              To
            </label>
            <Calendar
              value={to}
              onChange={(e) => setTo(e.value)}
              className="p-inputtext-sm bg-white"
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
            onClick={() => dispatch(closeEditEventModal())}
          />
          <Button type="submit" label="Confirm" icon="pi pi-check" />
        </div>
      </form>
    </Dialog>
  );
};
