// components/Spinner.tsx
export default function Spinner() {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
    </div>
  );
}
