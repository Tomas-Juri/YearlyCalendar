import { AppHeader, Calendar, EventModal, SideBar } from "./components/organisms";
import {
  closeAddEventModal,
  closeEditEventModal,
  confirmAddEventModal,
  confirmDeleteEvent,
  confirmEditEventModal,
} from "./redux/eventsSlice";
import { useAppDispatch, useAppSelector } from "./redux/hooks";

function App() {
  const dispatch = useAppDispatch();
  const addModal = useAppSelector((state) => state.events.addEventModal);
  const editModal = useAppSelector((state) => state.events.editEventModal);

  return (
    <div className="flex h-screen flex-col bg-gray-950 text-slate-900">
      <AppHeader />
      <div className="flex flex-1">
        <SideBar />
        <Calendar />
      </div>

      <EventModal
        mode="add"
        visible={addModal.opened}
        onClose={() => dispatch(closeAddEventModal())}
        onConfirm={(data) => dispatch(confirmAddEventModal(data))}
        prefillDate={addModal.prefillDate}
      />
      {editModal.opened && editModal.event && (
        <EventModal
          mode="edit"
          visible={editModal.opened}
          onClose={() => dispatch(closeEditEventModal())}
          onConfirm={(data) => dispatch(confirmEditEventModal(data))}
          onDelete={() => {
            dispatch(confirmDeleteEvent(editModal.event));
          }}
          existingEvent={editModal.event}
        />
      )}
    </div>
  );
}

export default App;
