import { useTranslation } from 'react-i18next';

type Props = {
  open: boolean;
  close: () => void;
};

export const ArbiusIntroduction = ({ open, close }: Props) => {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Welcome to Arbius</h2>
        <div className="text-gray-600 space-y-4 mb-6">
          <p>
            This is an AI-powered virtual assistant built with advanced language models.
          </p>
          <p>
            You can interact with the assistant through text or voice commands.
          </p>
        </div>
        <button
          onClick={close}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          {t('GetStarted') || 'Get Started'}
        </button>
      </div>
    </div>
  );
};
