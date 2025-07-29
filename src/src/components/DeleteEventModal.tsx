import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { closeDeleteEventModal, confirmDeleteEvent } from "../redux/eventsSlice";

export const DeleteEventModal = () => {
  const modal = useAppSelector((state) => state.events.deleteEventModal) || { opened: false, event: null };
  const dispatch = useAppDispatch();

  return (
    <Dialog
      header="Delete Event"
      visible={modal.opened}
      draggable={false}
      resizable={false}
      closeOnEscape
      dismissableMask
      className="w-[22rem]"
      onHide={() => dispatch(closeDeleteEventModal())}
      headerClassName="bg-slate-50"
      contentClassName="bg-slate-50"
    >
      <div className="space-y-6 py-2">
        <div className="flex items-center gap-3">
          <i className="pi pi-exclamation-triangle text-2xl" style={{ color: '#dc2626' }} />
          <span className="text-base text-slate-800">Are you sure you want to delete this event?</span>
        </div>
        {modal.opened && "event" in modal && modal.event && (
          <div className="p-0">
            <div className="font-semibold text-slate-800 mb-1 text-lg">{modal.event.title}</div>
            <div className="text-slate-600 text-sm mb-2">
              {modal.event.from.toLocaleDateString("cs")} - {modal.event.to?.toLocaleDateString("cs")}
            </div>
            {modal.event.description && (
              <div className="text-slate-700 text-sm whitespace-pre-line">
                {modal.event.description}
              </div>
            )}
          </div>
        )}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            severity="secondary"
            label="Cancel"
            text
            className="!text-slate-700 !bg-transparent hover:!bg-slate-100"
            onClick={() => dispatch(closeDeleteEventModal())}
          />
          <Button
            type="button"
            label="Delete"
            icon="pi pi-trash"
            severity="danger"
            className="!bg-red-600 !border-red-700 !text-white hover:!bg-red-700 hover:!border-red-800"
            onClick={() => {
              if (modal.opened && "event" in modal && modal.event) {
                dispatch(confirmDeleteEvent(modal.event));
              }
            }}
          />
        </div>
      </div>
    </Dialog>
  );
}; 