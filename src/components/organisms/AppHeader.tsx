import { YearPicker } from "../YearPicker";

export const AppHeader = () => {
  return (
    <header className="flex justify-between border-b border-gray-900">
      <div className="px-5 py-4">
        <h1 className="whitespace-nowrap font-medium tracking-wide text-gray-100">Yearly calendar</h1>
      </div>
      <YearPicker />
    </header>
  );
};
