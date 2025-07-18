import { AppHeader } from "./components/AppHeader";
import { MainContent } from "./components/MainContent";
import { EventModal } from "./components/EventModal";
import { DeleteEventModal } from "./components/DeleteEventModal";
import { useAppSelector, useAppDispatch } from "./redux/hooks";
import { 
  closeAddEventModal, 
  closeEditEventModal, 
  confirmAddEventModal, 
  confirmEditEventModal,
  openDeleteEventModal
} from "./redux/eventsSlice";

function App() {
  const dispatch = useAppDispatch();
  const addModal = useAppSelector((state) => state.events.addEventModal);
  const editModal = useAppSelector((state) => state.events.editEventModal);

  return (
    <div className="h-screen bg-slate-100 text-slate-900 flex">
      <div className="flex flex-col w-full">
        <AppHeader />
        <MainContent />
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
            dispatch(openDeleteEventModal(editModal.event));
          }}
          existingEvent={editModal.event}
        />
      )}
      
      <DeleteEventModal />
    </div>
  );
}

export default App;
