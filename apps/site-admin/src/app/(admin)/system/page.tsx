import { RobotsEditor } from "@/components/system/robots-editor";
import { SitemapEditor } from "@/components/system/sitemap-editor";

export default function SystemPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-8">
      <div className="mb-6">
        <h1 className="text-[length:var(--text-20)] font-semibold text-foreground">
          Системные
        </h1>
        <p className="mt-1 text-[length:var(--text-13)] text-muted-foreground">
          Файлы, отдаваемые в корне сайта для поисковых роботов.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <RobotsEditor />
        <SitemapEditor />
      </div>
    </div>
  );
}
