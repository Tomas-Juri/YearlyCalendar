import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { closeDeleteEventModal, confirmDeleteEvent } from "../redux/eventsSlice";

export const DeleteEventModal = () => {
  const modal = useAppSelector((state) => state.deleteEventModal);
  const dispatch = useAppDispatch();

  return (
    <Dialog
      header="Delete Event"
      visible={modal.opened}
      draggable={false}
      resizable={false}
      closeOnEscape
      dismissableMask
      className="w-[24rem]"
      onHide={() => dispatch(closeDeleteEventModal())}
      headerClassName="bg-slate-50"
      contentClassName="bg-slate-50"
      footer={
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            severity="secondary"
            label="Cancel"
            text
            onClick={() => dispatch(closeDeleteEventModal())}
          />
          <Button
            type="button"
            label="Delete"
            icon="pi pi-trash"
            severity="danger"
            onClick={() => {
              if (modal.opened && "event" in modal && modal.event) {
                dispatch(confirmDeleteEvent(modal.event));
              }
            }}
          />
        </div>
      }
    >
      <div className="flex items-center gap-3 mb-4">
        <i className="pi pi-exclamation-triangle text-2xl text-red-500" />
        <span>Are you sure you want to delete this event?</span>
      </div>
      {modal.opened && "event" in modal && modal.event && (
        <div className="bg-slate-100 rounded p-3 mb-2">
          <div className="font-semibold text-slate-800 mb-1">{modal.event.title}</div>
          <div className="text-slate-600 text-sm mb-1">
            {modal.event.from.toLocaleDateString("cs")} - {modal.event.to?.toLocaleDateString("cs")}
          </div>
          {modal.event.description && (
            <div className="text-slate-700 text-xs whitespace-pre-line">
              {modal.event.description}
            </div>
          )}
        </div>
      )}
    </Dialog>
  );
}; 