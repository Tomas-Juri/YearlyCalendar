import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useEffect, useState } from "react";
import { closeAddEventModal, confirmAddEventModal } from "../redux/eventsSlice";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { Nullable } from "primereact/ts-helpers";

export const NewEventModal = () => {
  const addEventModal = useAppSelector((state) => state.addEventModal);
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dates, setDates] = useState<Nullable<(Date | null)[]>>();

  useEffect(() => {
    setTitle("");
    setDescription("");
    setDates(null);
  }, [addEventModal.opened]);

  return (
    <Dialog
      header="Add new Event"
      visible={addEventModal.opened}
      draggable={false}
      resizable={false}
      closeOnEscape
      dismissableMask
      className="w-[28rem]"
      onHide={() => {
        dispatch(closeAddEventModal());
      }}
      headerClassName="bg-gray-50"
      contentClassName="bg-gray-50"
    >
      <form
        action=""
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();

          if (dates && dates[0] && dates[1])
            dispatch(
              confirmAddEventModal({
                title,
                description,
                from: dates[0],
                to: dates[1],
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
        <div className="flex flex-col gap-1">
          <label htmlFor="dates" className="text-sm">
            Dates
          </label>
          <Calendar
            value={dates}
            onChange={(e) => setDates(e.value)}
            className="p-inputtext-sm bg-white"
            selectionMode="range"
            readOnlyInput
            hideOnRangeSelection
          />
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
            rows={4}
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
          <Button type="submit" label="Confirm" icon="pi pi-check" />
        </div>
      </form>
    </Dialog>
  );
};
