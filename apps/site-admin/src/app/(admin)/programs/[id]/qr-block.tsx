"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@rocketmind/ui";
import { Loader2, QrCode, Copy } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";

const TEACHER_BASE_URL =
  process.env.NEXT_PUBLIC_TEACHER_URL || "http://localhost:3004";

function buildJoinUrl(programId: string, token: string): string {
  return `${TEACHER_BASE_URL.replace(/\/$/, "")}/join?p=${programId}&t=${token}`;
}

interface QrBlockProps {
  programId: string;
  initialToken: string | null;
  onTokenChange: (token: string | null) => void;
}

export function QrBlock({ programId, initialToken, onTokenChange }: QrBlockProps) {
  const [token, setToken] = useState<string | null>(initialToken);
  const [rotating, setRotating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const joinUrl = token ? buildJoinUrl(programId, token) : null;

  // render QR onto canvas whenever token changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !joinUrl) return;
    QRCode.toCanvas(canvas, joinUrl, {
      width: 320,
      margin: 1,
      color: { dark: "#000000", light: "#ffffff" },
    }).catch(() => {
      toast.error("Не удалось отрисовать QR");
    });
  }, [joinUrl]);

  async function rotate() {
    setRotating(true);
    try {
      const res = await apiFetch(`/api/programs/${programId}/regenerate-qr`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setToken(data.joinToken);
      onTokenChange(data.joinToken);
      toast.success(token ? "QR обновлён" : "QR сгенерирован");
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
      // Composite onto white background to ensure JPEG (no alpha) looks right
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
            if (!blob) {
              reject(new Error("no_blob"));
              return;
            }
            try {
              await navigator.clipboard.write([
                new ClipboardItem({ "image/jpeg": blob }),
              ]);
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
      toast.error("Не удалось скопировать. Откройте сайт по HTTPS или используйте другой браузер.");
    }
  }

  return (
    <div className="rounded border border-border bg-rm-gray-1/30 p-5">
      <h2 className="mb-4 text-[length:var(--text-14)] font-medium uppercase tracking-wide text-muted-foreground">
        QR для входа учеников
      </h2>

      <div className="flex items-start gap-4">
        <Button
          size="sm"
          onClick={rotate}
          disabled={rotating}
          className="shrink-0"
        >
          {rotating ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <QrCode className="mr-1 h-4 w-4" />
          )}
          {token ? "Обновить QR" : "Сгенерировать QR"}
        </Button>

        {token && (
          <p className="max-w-md text-[length:var(--text-12)] leading-[1.4] text-muted-foreground">
            При обновлении QR по предыдущему больше невозможно
            <br />
            будет войти в обучающий сервис с AI-экспертами.
          </p>
        )}
      </div>

      {token && (
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
              <code className="break-all text-[length:var(--text-10)] text-muted-foreground">
                {joinUrl}
              </code>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
