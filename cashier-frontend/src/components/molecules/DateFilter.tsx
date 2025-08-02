'use client'

type DateFilterProps = {
    value: string;
    onChange: (value: string) => void;
  };
  
  export const DateFilter = ({ value, onChange }: DateFilterProps) => {
    return (
      <div className="flex flex-col gap-2 max-w-xs">
        <label htmlFor="date" className="text-sm text-gray-600">
          Filter by Date
        </label>
        <input
          type="date"
          id="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-white border border-gray-300 text-gray-900 rounded-md px-4 py-2 focus:border-blue-500 focus:outline-none"
        />
      </div>
    );
  };
  
