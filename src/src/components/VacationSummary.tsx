import { VacationAllowanceEditor } from "./VacationAllowanceEditor";
import { useVacationValidation } from "../hooks/useVacationValidation";

export const VacationSummary = () => {
  const { 
    currentVacationDays: vacationDays,
    remainingDays,
    isOverLimit,
    isNearLimit
  } = useVacationValidation();

  return (
    <div className="px-12 pb-24">
      <div className="">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Vacation</h3>
        <table className="bg-white border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-300 text-center text-gray-700 font-medium min-w-[140px]">
                Available
              </th>
              <th className="px-4 py-2 border border-gray-300 text-center text-gray-700 font-medium min-w-[80px]">
                Used
              </th>
              <th className="px-4 py-2 border border-gray-300 text-center text-gray-700 font-medium min-w-[100px]">
                Remaining
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-1 py-2 border border-gray-300 text-center text-gray-700 font-medium">
                <VacationAllowanceEditor />
              </td>
              <td className={`px-4 py-2 border border-gray-300 text-center font-semibold text-lg ${
                isOverLimit ? 'text-red-700 bg-red-50' : 'text-gray-700'
              }`}>
                {vacationDays}
              </td>
              <td className={`px-4 py-2 border border-gray-300 text-center font-semibold text-lg ${
                isOverLimit ? 'text-red-700 bg-red-50' : 
                isNearLimit ? 'text-amber-700 bg-amber-50' : 'text-gray-700'
              }`}>
                {remainingDays}
                {isOverLimit && <span className="ml-1 text-red-500">⚠️</span>}
                {isNearLimit && <span className="ml-1 text-amber-500">⚠️</span>}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
