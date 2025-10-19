import { useTranslation } from "react-i18next";
import { BasicPage, FormRow } from "./common";
import { updateConfig } from "@/utils/config";

export function GeminiSettingsPage({
  geminiModel,
  setGeminiModel,
  setSettingsUpdated,
}: {
  geminiModel: string;
  setGeminiModel: (value: string) => void;
  setSettingsUpdated: (v: boolean) => void;
}) {
  const { t } = useTranslation();

  return (
    <BasicPage
      title={t("Gemini")}
      description={
        <>
          <p className="text-sm">
            {t("Google Gemini’yi yapılandır. Sunucu tarafı için .env.local içine GEMINI_API_KEY ekle ve geliştirme sunucusunu yeniden başlat.")}
          </p>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FormRow label={t("Model")}>
          <input
            className="mt-2 block w-full rounded-md border border-gray-300 p-1.5 text-gray-900 sm:text-sm"
            value={geminiModel}
            onChange={(e) => {
              const v = e.target.value;
              setGeminiModel(v);
              updateConfig("gemini_model", v);
              setSettingsUpdated(true);
            }}
            placeholder="gemini-2.5-flash"
          />
        </FormRow>
      </div>
    </BasicPage>
  );
}