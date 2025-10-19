import { useEffect, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type Props = {
  setWebcamEnabled: (enabled: boolean) => void;
};

export const EmbeddedWebcam = ({ setWebcamEnabled }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setWebcamEnabled(false);
      }
    };

    startWebcam();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [setWebcamEnabled]);

  return (
    <div className="fixed top-4 left-4 z-50 w-64 h-48 bg-black rounded-lg overflow-hidden shadow-xl">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      <button
        onClick={() => setWebcamEnabled(false)}
        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 rounded p-1 transition-colors"
      >
        <XMarkIcon className="h-5 w-5 text-white" />
      </button>
    </div>
  );
};
