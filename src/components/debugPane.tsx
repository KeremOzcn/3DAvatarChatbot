import { XMarkIcon } from "@heroicons/react/24/outline";

type Props = {
  onClickClose: () => void;
};

export const DebugPane = ({ onClickClose }: Props) => {
  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 text-white rounded-lg p-4 max-w-md backdrop-blur-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Debug Information</h3>
        <button
          onClick={onClickClose}
          className="hover:bg-white/10 rounded p-1 transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      <div className="space-y-2 text-sm font-mono">
        <div>Status: Running</div>
        <div>FPS: 60</div>
        <div>Memory: OK</div>
      </div>
    </div>
  );
};
