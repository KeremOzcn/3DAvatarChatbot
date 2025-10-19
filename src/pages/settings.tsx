import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { Settings } from "@/components/settings";
import { AmicaLifeContext } from "@/features/amicaLife/amicaLifeContext";

export default function SettingsPage() {
  const router = useRouter();
  const { amicaLife } = useContext(AmicaLifeContext);

  // Ayarlar sayfasına girince otomatik davranışı durdur, çıkarken geri başlat
  useEffect(() => {
    amicaLife?.pause?.();
    return () => amicaLife?.resume?.();
  }, [amicaLife]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* disableOutsideClose: sayfada boş alana tıklayınca kapanmasın */}
      <Settings
        disableOutsideClose
        onClickClose={() => router.push("/")}
      />
    </div>
  );
}