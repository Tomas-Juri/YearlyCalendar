import { YearPicker } from "../molecules/YearPicker";

export const AppHeader = () => {
  return (
    <header className="flex justify-between border-b border-gray-900">
      <div className="px-5 py-4">
        <h1 className="font-medium tracking-wide whitespace-nowrap text-gray-100">Yearly calendar</h1>
      </div>
      <YearPicker />
    </header>
  );
};
