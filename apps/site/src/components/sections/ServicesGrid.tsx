import { ServicesGridClient, type ServiceSection } from "./ServicesGridClient";
import {
  CONSULTING_SERVICES,
  ACADEMY_COURSES,
  AI_PRODUCTS,
} from "@/content/site-nav";
import { getAllCatalogProducts, type ProductData } from "@/lib/products";
import { getHomePage, type HomeSectionItem } from "@/lib/unique";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function ServicesGrid() {
  const allProducts = getAllCatalogProducts();
  const productMap = new Map(
    allProducts.map((p) => [`${p.category}/${p.slug}`, p]),
  );

  const home = getHomePage();
  const overrides: HomeSectionItem[] = home.sections?.sections ?? [];
  const overrideByKey = new Map(overrides.map((s) => [s.filterKey, s]));

  function applyOverride(
    filterKey: string,
    defaults: Omit<ServiceSection, "cards">,
    cards: ServiceSection["cards"],
  ): ServiceSection {
    const ov = overrideByKey.get(filterKey);
    if (!ov) return { ...defaults, cards };
    const hidden = new Set(ov.hiddenCardSlugs);
    const filtered = cards.filter((c) => {
      const slug = c.href?.split("/").pop() ?? "";
      return !hidden.has(slug);
    });
    return {
      ...defaults,
      trackName: ov.trackName || defaults.trackName,
      headerHighlight: ov.headerHighlight || defaults.headerHighlight,
      mobileTitle: ov.mobileTitle || defaults.mobileTitle,
      description: ov.description || defaults.description,
      catalogLabel: ov.catalogLabel || defaults.catalogLabel,
      cards: filtered,
    };
  }

  function expertCards(): ServiceSection["cards"] {
    return allProducts
      .filter((p: ProductData) => p.expertProduct === true)
      .map((p: ProductData) => ({
        title: p.cardTitle,
        description: p.cardDescription,
        href: `/${p.category}/${p.slug}`,
        coverImage: p.heroImage ?? undefined,
        experts:
          p.experts
            ?.filter((e) => e.image)
            .map((e) => ({ name: e.name, image: e.image! })) ?? [],
        expertProduct: true,
      }));
  }

  const builtins: Record<string, { defaults: Omit<ServiceSection, "cards">; cards: ServiceSection["cards"] }> = {
    consulting: {
      defaults: {
        trackName: "Консалтинг и стратегии",
        headerHighlight: "Стратегия и бизнес-модели",
        mobileTitle: "Стратегия\nи бизнес-модели",
        description:
          "Помогаем командам искать, проверять и усиливать бизнес-модели, связывать стратегию с операционными действиями и переходить от продуктовой логики к платформенной и экосистемной архитектуре.",
        catalogHref: "/products?filter=consulting",
        catalogLabel: "Все продукты",
        showIcons: true,
      },
      cards: CONSULTING_SERVICES.map((s) => {
        const slug = s.href.split("/").pop()!;
        const product = productMap.get(`consulting/${slug}`);
        return {
          title: s.title,
          description: s.description,
          href: s.href,
          coverImage: product?.heroImage ?? undefined,
          experts:
            product?.experts
              ?.filter((e) => e.image)
              .map((e) => ({ name: e.name, image: e.image! })) ?? [],
          expertProduct: product?.expertProduct ?? false,
        };
      }),
    },
    academy: {
      defaults: {
        trackName: "Онлайн-школа",
        headerHighlight: "академия бизнес-дизайна",
        mobileTitle: "Академия\nбизнес-дизайна",
        description:
          "Среда, где управленцы и команды осваивают бизнес-дизайн, платформенное мышление и работу с гипотезами. Мы обучаем тому, что сами применяем в проектах: от системной стратегии до запуска цифровых инициатив.",
        catalogHref: "/products?filter=academy",
        catalogLabel: "Все курсы",
        showImages: true,
        partnerBlock: {
          title: "Программы с ведущими бизнес-школами",
          description:
            "Обучаем топ-менеджеров крупных компаний, помогаем трансформировать бизнес с помощью бизнес-дизайна",
          logos: [
            { src: `${BASE_PATH}/partners/partner-logo-1.1.svg`, width: 230, height: 46 },
            { src: `${BASE_PATH}/partners/partner-logo-2.2.png`, width: 182, height: 60 },
          ],
        },
      },
      cards: ACADEMY_COURSES.map((s) => {
        const slug = s.href.split("/").pop()!;
        const product = productMap.get(`academy/${slug}`);
        return {
          title: s.title,
          description: s.description,
          href: s.href,
          coverImage: product?.heroImage ?? undefined,
          factoids: product?.hero?.factoids?.slice(0, 3).map((f) => ({ number: f.number, text: f.text })),
        };
      }),
    },
    "ai-products": {
      defaults: {
        trackName: "AI-продукты",
        headerHighlight: "продукты с AI для бизнеса",
        mobileTitle: "Продукты\nс AI для бизнеса",
        description:
          "Встроенные помощники, которые усиливают мышление, а не заменяют экспертов. Они помогают командам быстрее проходить через сложные задачи: от исследования и анализа до формирования бизнес-моделей и стратегий.",
        catalogHref: "/products?filter=ai-products",
        catalogLabel: "Все продукты",
        showImages: true,
      },
      cards: AI_PRODUCTS.map((s) => {
        const slug = s.href.split("/").pop()!;
        const product = productMap.get(`ai-products/${slug}`);
        return {
          title: s.title,
          description: s.description,
          href: s.href,
          coverImage: product?.heroImage ?? undefined,
          factoids: product?.hero?.factoids?.slice(0, 3).map((f) => ({ number: f.number, text: f.text })),
        };
      }),
    },
    expert: {
      defaults: {
        trackName: "Экспертные продукты",
        headerHighlight: "Экспертные продукты",
        mobileTitle: "Экспертные\nпродукты",
        description: "Продукты, где с вами работает именной эксперт.",
        catalogHref: "/products?filter=expert",
        catalogLabel: "Все продукты",
        showImages: true,
      },
      cards: expertCards(),
    },
  };

  // If the admin has a homeSections override, use its order + filter list.
  // Otherwise fall back to the built-in trio (consulting / academy / ai-products).
  const orderedKeys = overrides.length > 0
    ? overrides.map((s) => s.filterKey).filter((k) => builtins[k])
    : ["consulting", "academy", "ai-products"];

  const sectionsData: ServiceSection[] = orderedKeys.map((key) => {
    const b = builtins[key];
    return applyOverride(key, b.defaults, b.cards);
  });

  return <ServicesGridClient sections={sectionsData} />;
}
