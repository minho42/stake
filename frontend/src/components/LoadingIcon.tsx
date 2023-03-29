import { XCircleIcon, TruckIcon } from "@heroicons/react/outline";

export const LoadingIcon = () => {
  return (
    <div className="flex items-center justify-center text-gray-400 animate-pulse p-1 ">
      <TruckIcon className="h-6 w-6" />
    </div>
  );
};
