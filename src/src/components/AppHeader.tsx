import { YearPicker } from "./YearPicker";

export const AppHeader = () => {
  return (
    <header className="bg-slate-50 border-b border-slate-300 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold tracking-wide">Yearly calendar</div>
        <div className="flex items-center gap-4">
          <YearPicker />
        </div>
      </div>
    </header>
  );
};
