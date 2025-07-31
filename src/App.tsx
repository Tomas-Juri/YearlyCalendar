import { AddEventModal, AppHeader, Calendar, EditEventModal, SideBar } from "./components/organisms";

function App() {
  return (
    <div className="flex h-screen flex-col bg-gray-950 text-gray-100">
      <AppHeader />
      <div className="flex flex-1">
        <SideBar />
        <Calendar />
      </div>
      <AddEventModal />
      <EditEventModal />
    </div>
  );
}

export default App;
