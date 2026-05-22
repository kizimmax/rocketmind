"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@rocketmind/ui";
import { Loader2, QrCode, Copy } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";

const TEACHER_BASE_URL = process.env.NEXT_PUBLIC_TEACHER_URL || "http://localhost:3005";

function buildJoinUrl(code: string): string {
  return `${TEACHER_BASE_URL.replace(/\/$/, "")}/join?code=${encodeURIComponent(code)}`;
}

interface QrBlockProps {
  programId: string;
  initialQrCode: string | null;
  onQrChange: (code: string | null) => void;
}

export function QrBlock({ programId, initialQrCode, onQrChange }: QrBlockProps) {
  const [code, setCode] = useState<string | null>(initialQrCode);
  const [rotating, setRotating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const joinUrl = code ? buildJoinUrl(code) : null;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !joinUrl) return;
    QRCode.toCanvas(canvas, joinUrl, {
      width: 320,
      margin: 1,
      color: { dark: "#000000", light: "#ffffff" },
    }).catch(() => toast.error("Не удалось отрисовать QR"));
  }, [joinUrl]);

  async function rotate() {
    setRotating(true);
    try {
      const res = await apiFetch(`/api/programs/${programId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updateQRCode: true }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setCode(data.qrCode ?? null);
      onQrChange(data.qrCode ?? null);
      toast.success(code ? "QR обновлён" : "QR сгенерирован");
    } catch (err) {
      console.error(err);
      toast.error("Ошибка");
    } finally {
      setRotating(false);
    }
  }

  async function copyJpeg() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const composited = document.createElement("canvas");
      composited.width = canvas.width;
      composited.height = canvas.height;
      const ctx = composited.getContext("2d");
      if (!ctx) throw new Error("no_ctx");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, composited.width, composited.height);
      ctx.drawImage(canvas, 0, 0);
      await new Promise<void>((resolve, reject) => {
        composited.toBlob(
          async (blob) => {
            if (!blob) return reject(new Error("no_blob"));
            try {
              await navigator.clipboard.write([new ClipboardItem({ "image/jpeg": blob })]);
              resolve();
            } catch (e) {
              reject(e);
            }
          },
          "image/jpeg",
          0.92,
        );
      });
      toast.success("JPEG скопирован в буфер обмена");
    } catch (err) {
      console.error(err);
      toast.error("Не удалось скопировать. Откройте по HTTPS или другой браузер.");
    }
  }

  return (
    <div className="rounded border border-border bg-rm-gray-1/30 p-5">
      <h2 className="mb-4 text-[length:var(--text-14)] font-medium uppercase tracking-wide text-muted-foreground">
        QR для входа учеников
      </h2>

      <div className="flex items-start gap-4">
        <Button size="sm" onClick={rotate} disabled={rotating} className="shrink-0">
          {rotating ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <QrCode className="mr-1 h-4 w-4" />}
          {code ? "Обновить QR" : "Сгенерировать QR"}
        </Button>
        {code && (
          <p className="max-w-md text-[length:var(--text-12)] leading-[1.4] text-muted-foreground">
            При обновлении QR по предыдущему больше нельзя будет войти.
          </p>
        )}
      </div>

      {code && (
        <div className="mt-5 flex flex-col items-start gap-3">
          <canvas
            ref={canvasRef}
            className="rounded border border-border bg-white"
            width={320}
            height={320}
          />
          <div className="flex flex-col gap-2">
            <Button size="xs" variant="outline" onClick={copyJpeg}>
              <Copy className="mr-1 h-3 w-3" />
              Скопировать JPEG
            </Button>
            {joinUrl && (
              <code className="break-all text-[length:var(--text-10)] text-muted-foreground">{joinUrl}</code>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
