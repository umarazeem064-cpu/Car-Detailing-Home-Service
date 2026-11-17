export type LanguageCode = 'en' | 'ur' | 'ar' | 'es';
export type CurrencyCode = 'PKR' | 'USD' | 'GBP' | 'EUR';
export type VehicleClass = 'sedan' | 'suv' | 'luxury';

export interface StudioAnchor {
  fallbackName: string;
  city: string;
  country: string;
  mapsShortUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  searchQuery: string;
  serviceAreas: string[];
}

// Anchored directly to the provided Google Maps listing: https://maps.app.goo.gl/pw7wPfwQbFHh52BTA
export const STUDIO_ANCHOR: StudioAnchor = {
  fallbackName: 'Car Detailing Home Service',
  city: 'Lahore',
  country: 'Pakistan',
  mapsShortUrl: 'https://maps.app.goo.gl/pw7wPfwQbFHh52BTA',
  coordinates: {
    lat: 31.4890124,
    lng: 74.4077414,
  },
  searchQuery: 'Car Detailing Home Service Lahore',
  serviceAreas: [
    'DHA Phases 1–8',
    'Gulberg',
    'Cantt & Cavalry Ground',
    'Model Town',
    'Johar Town',
    'Bahria Town',
  ],
};

// Strictly valid generated .jpg local assets copied into dist/src/assets/images/
export const STUDIO_IMAGES = {
  heroStudio: '/src/assets/images/hero_detailing_studio_1794937131093.jpg',
  paintBefore: '/src/assets/images/paint_before_swirls_1794937132391.jpg',
  paintAfter: '/src/assets/images/paint_after_mirror_1794937133192.jpg',
  interiorBefore: '/src/assets/images/interior_before_worn_1794937134168.jpg',
  interiorAfter: '/src/assets/images/interior_after_restored_1794937135479.jpg',
  ceramicStudio: '/src/assets/images/ceramic_application_studio_1794937136090.jpg',
} as const;

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  // Base prices are stored in USD and converted cleanly in real time
  rateFromUsd: number;
  decimals: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  PKR: {
    code: 'PKR',
    symbol: '₨',
    label: 'PKR ₨',
    rateFromUsd: 278.5,
    decimals: 0,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    label: 'USD $',
    rateFromUsd: 1,
    decimals: 0,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    label: 'GBP £',
    rateFromUsd: 0.79,
    decimals: 0,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    label: 'EUR €',
    rateFromUsd: 0.92,
    decimals: 0,
  },
};

export const VEHICLE_MULTIPLIERS: Record<
  VehicleClass,
  { multiplier: number; example: string }
> = {
  sedan: { multiplier: 1, example: 'Civic, Corolla, Audi A6' },
  suv: { multiplier: 1.25, example: 'Prado, Fortuner, BMW X5' },
  luxury: { multiplier: 1.45, example: 'Porsche, S-Class, Range Rover' },
};

export function formatPackagePrice(
  baseUsd: number,
  currency: CurrencyCode,
  vehicleClass: VehicleClass
): string {
  const cfg = CURRENCIES[currency];
  const raw = baseUsd * VEHICLE_MULTIPLIERS[vehicleClass].multiplier * cfg.rateFromUsd;
  const rounded =
    currency === 'PKR' ? Math.round(raw / 500) * 500 : Math.round(raw);
  return `${cfg.symbol}${rounded.toLocaleString('en-US')}`;
}

export interface ServicePackage {
  id: string;
  number: string;
  featured?: boolean;
  baseUsd: number;
  duration: Record<LanguageCode, string>;
  image: string;
  imageAlt: string;
  name: Record<LanguageCode, string>;
  subtitle: Record<LanguageCode, string>;
  features: Record<LanguageCode, string[]>;
}

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'express-wash-vacuum',
    number: '01',
    baseUsd: 45,
    duration: {
      en: '90 Minutes',
      ur: '90 منٹ',
      ar: '90 دقيقة',
      es: '90 Minutos',
    },
    image: STUDIO_IMAGES.interiorAfter,
    imageAlt: 'Spotless restored sedan cabin after express vacuum and interior detailing',
    name: {
      en: 'Express Exterior Wash & Interior Vacuum',
      ur: 'ایکسپریس ایکسٹیریئر واش اور انٹیریئر ویکیوم',
      ar: 'غسيل خارجي سريع وتنظيف داخلي بالمكنسة',
      es: 'Lavado Exterior Express y Aspirado Interior',
    },
    subtitle: {
      en: 'Safe scratch-free maintenance wash and crisp cabin refresh at your doorstep or studio bay.',
      ur: 'آپ کے دروازے پر یا اسٹوڈیو بے میں محفوظ اسکریچ فری واش اور انٹیریئر ریفریش۔',
      ar: 'غسيل آمن خالٍ من الخدوش وتنظيف منعش للمقصورة في منزلك أو داخل الاستوديو.',
      es: 'Lavado seguro libre de micro-rayas y renovación de cabina a domicilio o en estudio.',
    },
    features: {
      en: [
        'Pre-wash snow foam soak & two-bucket pH-neutral hand wash',
        'Wheel barrels, lug nuts & brake caliper safe decontamination',
        'Scratch-free plush microfiber & filtered air blow-dry',
        'Complete cabin & trunk HEPA vacuuming including seat rails',
        'Satin UV-protectant dashboard & door trim dressing',
        'Streak-free interior & exterior automotive glass polish',
      ],
      ur: [
        'پری واش اسنو فوم اور ٹو بکیٹ pH نیوٹرل ہینڈ واش',
        'وہیل بیرل، لگ نٹس اور بریک کیلیپر کی محفوظ صفائی',
        'مائیکرو فائبر اور فلٹرڈ ایئر بلو ڈرائی (بغیر خراش)',
        'مکمل کیبن، سیٹ ریلز اور ڈگی کی HEPA ویکیومنگ',
        'ڈیش بورڈ اور ڈور ٹرم کے لیے سیٹن UV پروٹیکشن ڈریسنگ',
        'اندرونی اور بیرونی شیشوں کی اسٹرک فری پالش',
      ],
      ar: [
        'نقع برغوة الثلج وغسيل يدوي متعادل الحموضة بنظام الدلوين',
        'تنظيف آمن للجنوط ومسامير العجلات وملاقط المكابح',
        'تجفيف آمن بمناشف مايكروفايبر فاخرة وهواء مفلتر',
        'تنظيف شامل للمقصورة والصندوق بمكنسة HEPA عالية الكفاءة',
        'حماية وتلميع ساتان للوحة القيادة والأبواب ضد الأشعة فوق البنفسجية',
        'تلميع الزجاج الداخلي والخارجي بدون أي آثار',
      ],
      es: [
        'Pre-lavado con espuma activa y lavado manual pH neutro de dos cubos',
        'Descontaminación segura de llantas, pernos y pinzas de freno',
        'Secado sin contacto con aire filtrado y microfibra de felpa',
        'Aspirado HEPA completo de cabina, rieles y maletero',
        'Acondicionado satinado con filtro UV para tablero y paneles',
        'Pulido cristalino de vidrios interiores y exteriores',
      ],
    },
  },
  {
    id: 'paint-correction-gloss',
    number: '02',
    baseUsd: 165,
    duration: {
      en: '6–8 Hours',
      ur: '6 تا 8 گھنٹے',
      ar: '6 إلى 8 ساعات',
      es: '6–8 Horas',
    },
    image: STUDIO_IMAGES.paintAfter,
    imageAlt: 'Deep navy automotive hood with flawless mirror reflection after multi-stage paint correction',
    name: {
      en: 'Multi-Stage Paint Correction & Gloss Enhancement',
      ur: 'ملٹی اسٹیج پینٹ کریکشن اور گلاس انہانسمنٹ',
      ar: 'تصحيح الطلاء متعدد المراحل وتعزيز اللمعان',
      es: 'Corrección de Pintura Multietapa y Realce de Brillo',
    },
    subtitle: {
      en: 'Eliminates swirl marks, oxidation, and wash haze to restore factory-surpassing liquid clarity.',
      ur: 'سوئرل مارکس، آکسیڈیشن اور دھندلے پن کو ختم کر کے شیشے جیسی چمک بحال کریں۔',
      ar: 'يزيل الدوامات والأكسدة وضبابية الغسيل لاستعادة لمعان عميق يفوق المصنع.',
      es: 'Elimina marcas de remolino, oxidación y opacidad para devolver un acabado espejo.',
    },
    features: {
      en: [
        'Full chemical iron fallout removal & fine-grade clay bar treatment',
        'Digital ultrasonic paint depth gauge inspection across all panels',
        '2-stage dual-action compounding & fine jeweling polish (85–90% defect removal)',
        'Piano-black B-pillar trim & headlight optical clarity polishing',
        'IPA panel wipe down followed by 12-month SiO2 hydrophobic sealant',
        'Deep tire satin conditioning & exterior matte plastic revival',
      ],
      ur: [
        'مکمل آئرن فال آؤٹ ریموول اور فائن گریڈ کلے بار ٹریٹمنٹ',
        'ہر پینل کی ڈیجیٹل پینٹ ڈیپتھ گیج انسپیکشن',
        'ٹو اسٹیج مشین کمپاؤنڈنگ اور فائن پالش (85 تا 90 فیصد اسکریچ ریموول)',
        'پیانو بلیک پلرز اور ہیڈ لائٹس کی آپٹیکل کلیئرٹی پالش',
        'IPA پینل کلینزنگ اور 12 ماہ کا SiO2 ہائیڈروفوبک سیلنٹ',
        'ٹائر سیٹن کنڈیشننگ اور بیرونی پلاسٹک ٹرم کی بحالی',
      ],
      ar: [
        'إزالة كيميائية كاملة لبرادة الحديد ومعالجة بالطين الطبي الناعم',
        'فحص رقمي لسمك الطلاء بالموجات فوق الصوتية لجميع الألواح',
        'تلميع آلي على مرحلتين لإزالة 85–90% من الخدوش والدوامات',
        'تلميع أعمدة البيانو السوداء والمصابيح الأمامية لوضوح تام',
        'تنظيف بمحلول IPA متبوعاً بطبقة حماية SiO2 طاردة للماء لمدة 12 شهراً',
        'ترطيب ساتان للإطارات وتجديد الأجزاء البلاستيكية الخارجية',
      ],
      es: [
        'Descontaminación férrica química completa y barra de arcilla fina',
        'Medición ultrasónica de espesor de pintura en cada panel',
        'Pulido mecánico de 2 etapas con eliminación del 85–90% de defectos',
        'Restauración óptica de pilares negro piano y ópticas delanteras',
        'Limpieza IPA y sellador hidrofóbico SiO2 de 12 meses',
        'Acondicionado satinado de neumáticos y plásticos exteriores',
      ],
    },
  },
  {
    id: 'ultimate-9h-ceramic',
    number: '03',
    featured: true,
    baseUsd: 340,
    duration: {
      en: '1–2 Days (Curing)',
      ur: '1 تا 2 دن (کیورنگ)',
      ar: '1 إلى 2 يوم (تصلب)',
      es: '1–2 Días (Curado)',
    },
    image: STUDIO_IMAGES.ceramicStudio,
    imageAlt: 'Technician applying certified 9H liquid ceramic coating to luxury sedan fender under LED lights',
    name: {
      en: 'Ultimate 9H Ceramic Coating & Full Interior Restoration',
      ur: 'الٹیمیٹ 9H سیرامک کوٹنگ اور مکمل انٹیریئر بحالی',
      ar: 'طلاء سيراميك 9H الفائق وترميم داخلي كامل',
      es: 'Recubrimiento Cerámico 9H Definitivo y Restauración Interior',
    },
    subtitle: {
      en: 'Our flagship dual-layer 9H nano-ceramic armor paired with medical-grade cabin steam restoration.',
      ur: 'ہمارا فلیگ شپ ڈبل لیئر 9H نینو سیرامک پروٹیکشن اور مکمل کیبن اسٹیم ریسٹوریشن۔',
      ar: 'باقتنا الرائدة بطبقتين من النانو سيراميك 9H مع تعقيم وترميم شامل للمقصورة بالبخار.',
      es: 'Nuestra protección insignia de doble capa cerámica 9H con restauración interior a vapor.',
    },
    features: {
      en: [
        'Complete multi-stage paint correction for surgical mirror gloss',
        'Dual-layer certified 9H SiO2 nano-ceramic coating (3–5 year UV & acid shield)',
        'Dedicated high-temp ceramic coating for alloy wheels & all glass surfaces',
        '150°C dry-vapor steam sanitization & hot-water carpet extraction',
        'pH-balanced Nappa leather deep pore cleansing & matte conditioning',
        'Detailed engine bay degreasing, dressing & post-cure inspection warranty',
      ],
      ur: [
        'شیشے جیسی چمک کے لیے مکمل ملٹی اسٹیج پینٹ کریکشن',
        'سرٹیفائیڈ 9H نینو سیرامک کوٹنگ کی ڈبل لیئر (3 تا 5 سال UV پروٹیکشن)',
        'الائے رمز اور تمام شیشوں کے لیے خصوصی سیرامک کوٹنگ',
        '150°C ڈرائی اسٹیم سینیٹائزیشن اور قالین کی ڈیپ ایکسٹریکشن',
        'نیپا لیدر سیٹوں کی گہری صفائی اور میٹ کنڈیشننگ',
        'انجن بے ڈیٹیلنگ، ڈریسنگ اور آفٹر کیئر وارنٹی انسپیکشن',
      ],
      ar: [
        'تصحيح كامل متعدد المراحل للطلاء لتحقيق لمعان مرآتي فائق',
        'طبقتان من طلاء النانو سيراميك 9H المعتمد (حماية 3 إلى 5 سنوات)',
        'طلاء سيراميك مقاوم للحرارة للجنوط وجميع الأسطح الزجاجية',
        'تعقيم بالبخار الجاف بدرجة 150 مئوية وتنظيف عميق للسجاد',
        'تنظيف عميق لمسام جلد النابا وترطيبه بملمس غير لامع',
        'تنظيف وتفصيل حجرة المحرك مع ضمان الفحص الدوري',
      ],
      es: [
        'Corrección de pintura multietapa completa para brillo espejo',
        'Doble capa de recubrimiento cerámico 9H certificado (3–5 años de escudo UV)',
        'Cerámico de alta temperatura en llantas y recubrimiento hidrofóbico en vidrios',
        'Sanitización a vapor seco 150°C y extracción profunda de alfombras',
        'Limpieza de poros y nutrición mate pH balanceada para cuero Nappa',
        'Detallado completo de vano motor y garantía de inspección post-curado',
      ],
    },
  },
];

export interface TransformationCase {
  id: string;
  beforeImage: string;
  afterImage: string;
  title: Record<LanguageCode, string>;
  vehicle: string;
  summary: Record<LanguageCode, string>;
  metrics: {
    label: Record<LanguageCode, string>;
    value: string;
  }[];
}

export const TRANSFORMATION_CASES: TransformationCase[] = [
  {
    id: 'paint-correction',
    beforeImage: STUDIO_IMAGES.paintBefore,
    afterImage: STUDIO_IMAGES.paintAfter,
    vehicle: 'Obsidian Metallic Sedan · 2-Stage Correction + 9H Ceramic',
    title: {
      en: 'Swirl Removal & 9H Ceramic Mirror Finish',
      ur: 'سوئرل ریموول اور 9H سیرامک مرر فنش',
      ar: 'إزالة الدوامات ولمعان السيراميك 9H',
      es: 'Eliminación de Swirls y Acabado Espejo 9H',
    },
    summary: {
      en: 'Heavy automatic-wash spiderwebbing and water etching leveled safely under dual LED inspection, sealed with two coats of 9H nano-ceramic.',
      ur: 'شدید سوئرل مارکس اور پانی کے دھبوں کو محفوظ طریقے سے ختم کر کے دو تہوں والی 9H سیرامک کوٹنگ لگائی گئی۔',
      ar: 'تمت إزالة الخدوش الدائرية وبقع المياه بدقة تحت إضاءة فحص LED وتثبيتها بطبقتين من السيراميك 9H.',
      es: 'Remolinos severos y marcas de agua corregidos con precisión bajo inspección LED y sellados con doble capa 9H.',
    },
    metrics: [
      {
        label: { en: 'Defect Reduction', ur: 'اسکریچ میں کمی', ar: 'إزالة العيوب', es: 'Reducción de Defectos' },
        value: '92%',
      },
      {
        label: { en: 'Contact Angle', ur: 'ہائیڈروفوبک اینگل', ar: 'زاوية طرد الماء', es: 'Ángulo Hidrofóbico' },
        value: '115°',
      },
      {
        label: { en: 'Surface Hardness', ur: 'سرفیس ہارڈنس', ar: 'صلابة السطح', es: 'Dureza Certificada' },
        value: '9H SiO2',
      },
    ],
  },
  {
    id: 'interior-restoration',
    beforeImage: STUDIO_IMAGES.interiorBefore,
    afterImage: STUDIO_IMAGES.interiorAfter,
    vehicle: 'Executive Luxury Cabin · Dry Steam & Leather Conditioning',
    title: {
      en: 'Deep Cabin Steam & Nappa Leather Revival',
      ur: 'کیبن اسٹیم اور نیپا لیدر ریسٹوریشن',
      ar: 'تعقيم بالبخار وتجديد جلد النابا',
      es: 'Vapor Profundo y Renovación de Cuero Nappa',
    },
    summary: {
      en: 'Embedded grime, shiny body oils, and dusty consoles stripped cleanly with 150°C vapor extraction and restored to a factory satin-matte feel.',
      ur: 'گہری گرد، چکناہٹ اور دھول کو 150°C بھاپ سے صاف کر کے لیدر کو فیکٹری جیسی میٹ فنش میں بحال کیا گیا۔',
      ar: 'إزالة الأوساخ والزيوت والغبار بالبخار الجاف 150°C لاستعادة الملمس الساتاني الأصلي للمصنع.',
      es: 'Suciedad incrustada y brillo graso eliminados con vapor a 150°C, devolviendo el acabado mate de fábrica.',
    },
    metrics: [
      {
        label: { en: 'Sanitization Temp', ur: 'اسٹیم درجہ حرارت', ar: 'حرارة التعقيم', es: 'Temperatura Vapor' },
        value: '150°C',
      },
      {
        label: { en: 'Leather Finish', ur: 'لیدر فنش', ar: 'ملمس الجلد', es: 'Acabado Cuero' },
        value: 'OEM Matte',
      },
      {
        label: { en: 'Chemistry', ur: 'کیمیکل سیفٹی', ar: 'المواد المستخدمة', es: 'Química' },
        value: 'pH 7.0',
      },
    ],
  },
];

export interface TranslationBundle {
  dir: 'ltr' | 'rtl';
  langName: string;
  nav: {
    home: string;
    services: string;
    pricing: string;
    gallery: string;
    reviews: string;
    contact: string;
    bookNow: string;
    whatsapp: string;
  };
  hero: {
    locationLine: string;
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
    whatsappCta: string;
    statCarsLabel: string;
    statYearsLabel: string;
    statRatingLabel: string;
    statProtectionLabel: string;
  };
  gallery: {
    kicker: string;
    title: string;
    subtitle: string;
    beforeLabel: string;
    afterLabel: string;
    dragHint: string;
    sliderMode: string;
    sideBySideMode: string;
  };
  packages: {
    kicker: string;
    title: string;
    subtitle: string;
    vehicleSizeLabel: string;
    vehicleClasses: Record<VehicleClass, string>;
    featuredLabel: string;
    selectPackage: string;
    selectedPackage: string;
    estimatedTime: string;
  };
  credentials: {
    kicker: string;
    title: string;
    subtitle: string;
    items: { title: string; body: string }[];
  };
  reviews: {
    kicker: string;
    title: string;
    subtitle: string;
    verifiedSource: string;
    basedOn: string;
    viewAllOnMaps: string;
    loadingText: string;
    noReviewsText: string;
    retryLabel: string;
  };
  booking: {
    kicker: string;
    title: string;
    subtitle: string;
    fullName: string;
    fullNamePlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    whatsapp: string;
    sameAsPhone: string;
    vehicle: string;
    vehiclePlaceholder: string;
    packageLabel: string;
    serviceModeLabel: string;
    homeService: string;
    studioDropoff: string;
    preferredDate: string;
    preferredTime: string;
    notes: string;
    notesPlaceholder: string;
    submitCta: string;
    modalTitle: string;
    modalSubtitle: string;
    referenceId: string;
    downloadCalendar: string;
    confirmWhatsapp: string;
    closeModal: string;
  };
  location: {
    kicker: string;
    title: string;
    subtitle: string;
    addressLabel: string;
    phoneLabel: string;
    hoursLabel: string;
    openInMaps: string;
    callStudio: string;
    chatWhatsapp: string;
    serviceAreasTitle: string;
    loadingListing: string;
    rightsReserved: string;
    developerCredit: string;
  };
}

export const TRANSLATIONS: Record<LanguageCode, TranslationBundle> = {
  en: {
    dir: 'ltr',
    langName: 'English',
    nav: {
      home: 'Home',
      services: 'Services',
      pricing: 'Packages',
      gallery: 'Gallery',
      reviews: 'Reviews',
      contact: 'Contact',
      bookNow: 'Book Now',
      whatsapp: 'WhatsApp',
    },
    hero: {
      locationLine: 'Lahore, Pakistan · Doorstep & Studio Detailing',
      headline: 'Unleash Ultimate Gloss & 9H Ceramic Protection',
      subheadline:
        'Precision paint correction, certified 9H nano-ceramic armor, and deep cabin restoration across Lahore — delivered directly to your driveway or inside our climate-controlled studio.',
      primaryCta: 'Book Detailing Slot',
      secondaryCta: 'Explore Packages',
      whatsappCta: 'Chat on WhatsApp',
      statCarsLabel: 'Vehicles Restored',
      statYearsLabel: 'Years Craftsmanship',
      statRatingLabel: 'Google Maps Rating',
      statProtectionLabel: 'Ceramic Hardness',
    },
    gallery: {
      kicker: 'Proven Surface Transformations',
      title: 'Before & After Detailing Gallery',
      subtitle:
        'Drag the comparison handle to inspect swirl-mark removal, paint depth clarity, and full cabin leather revival under studio LED inspection lighting.',
      beforeLabel: 'Before',
      afterLabel: 'After',
      dragHint: 'Drag slider to compare',
      sliderMode: 'Interactive Slider',
      sideBySideMode: 'Side-by-Side',
    },
    packages: {
      kicker: 'Transparent Detailing Tiers',
      title: 'Services & Multi-Currency Packages',
      subtitle:
        'Choose your vehicle class and preferred currency for instant pricing. Selecting a package pre-fills your appointment slot automatically.',
      vehicleSizeLabel: 'Vehicle Class',
      vehicleClasses: {
        sedan: 'Sedan / Hatchback',
        suv: 'SUV / 4×4',
        luxury: 'Luxury / Sports',
      },
      featuredLabel: 'Signature Choice',
      selectPackage: 'Select Package',
      selectedPackage: 'Selected for Booking',
      estimatedTime: 'Estimated Duration',
    },
    credentials: {
      kicker: 'Studio Standards & Craftsmanship',
      title: 'Engineered for Automotive Purists',
      subtitle:
        'Every vehicle undergoes micrometer paint-thickness mapping, deionized pH-neutral washing, and dust-controlled ceramic curing.',
      items: [
        {
          title: '01. Certified 9H SiO2 Ceramic Systems',
          body: 'Authentic hydrophobic ceramic coatings engineered to resist Lahore UV heat, hard-water minerals, and bird-dropping etching for years.',
        },
        {
          title: '02. Strictly pH-Neutral Deionized Chemistry',
          body: 'Zero caustic degreasers or silicone fillers. Every shampoo, iron remover, and leather balm preserves factory clearcoat and delicate trim.',
        },
        {
          title: '03. Doorstep Self-Contained Mobile Units',
          body: 'Prefer convenience at home or office? Our mobile detailing rigs arrive across DHA, Gulberg, Cantt, and Bahria Town fully equipped.',
        },
        {
          title: '04. Micrometer-Verified Paint Safety',
          body: 'Before any polisher touches your clearcoat, we record digital micron readings on every panel to maximize gloss safely without thinning.',
        },
      ],
    },
    reviews: {
      kicker: 'Verified Client Feedback',
      title: 'Live Google Maps Reviews',
      subtitle:
        'Authentic customer ratings and reviews loaded directly from our official Google Maps business profile.',
      verifiedSource: 'Verified on Google Maps',
      basedOn: 'Google reviews',
      viewAllOnMaps: 'View Listing on Google Maps',
      loadingText: 'Loading verified Google Maps reviews...',
      noReviewsText:
        'Live customer reviews are viewable directly on our verified Google Maps profile.',
      retryLabel: 'Refresh Live Listing',
    },
    booking: {
      kicker: 'Reserve Your Detailing Slot',
      title: 'Schedule Studio or Home Detailing',
      subtitle:
        'Lock in your preferred date and service package. Receive instant booking confirmation with optional WhatsApp dispatch.',
      fullName: 'Full Name',
      fullNamePlaceholder: 'e.g., Usman Tariq',
      phone: 'Phone Number',
      phonePlaceholder: '+92 300 1234567',
      whatsapp: 'WhatsApp Number',
      sameAsPhone: 'Same as phone number',
      vehicle: 'Vehicle Make, Model & Year',
      vehiclePlaceholder: 'e.g., Audi A6, 2025',
      packageLabel: 'Service Package',
      serviceModeLabel: 'Service Location',
      homeService: 'Home / Doorstep Service',
      studioDropoff: 'Studio Drop-Off',
      preferredDate: 'Preferred Date',
      preferredTime: 'Preferred Time Slot',
      notes: 'Paint Color & Special Requests (Optional)',
      notesPlaceholder: 'e.g., Jet Black paint with minor hood swirls, located in DHA Phase 6',
      submitCta: 'Confirm Detailing Appointment',
      modalTitle: 'Appointment Request Confirmed',
      modalSubtitle:
        'Your detailing slot has been reserved. Our lead detailer will reach out shortly to confirm arrival.',
      referenceId: 'Booking Reference',
      downloadCalendar: 'Add to Calendar (.ics)',
      confirmWhatsapp: 'Send Details on WhatsApp',
      closeModal: 'Done',
    },
    location: {
      kicker: 'Location & Operating Hours',
      title: 'Visit Us or Book Doorstep Service in Lahore',
      subtitle:
        'Explore our exact verified Google Maps pin, operating hours, and direct contact channels.',
      addressLabel: 'Verified Address',
      phoneLabel: 'Direct Phone & WhatsApp',
      hoursLabel: 'Opening & Closing Hours',
      openInMaps: 'Open in Google Maps',
      callStudio: 'Call Now',
      chatWhatsapp: 'WhatsApp Concierge',
      serviceAreasTitle: 'Mobile Detailing Coverage',
      loadingListing: 'Syncing live details from Google Maps...',
      rightsReserved: 'All rights reserved.',
      developerCredit: 'Crafted for precision automotive care.',
    },
  },
  ur: {
    dir: 'rtl',
    langName: 'اردو',
    nav: {
      home: 'ہوم',
      services: 'خدمات',
      pricing: 'پیکجز',
      gallery: 'گیلری',
      reviews: 'تبصرے',
      contact: 'رابطہ',
      bookNow: 'بکنگ کریں',
      whatsapp: 'واٹس ایپ',
    },
    hero: {
      locationLine: 'لاہور، پاکستان · ہوم سروس اور اسٹوڈیو ڈیٹیلنگ',
      headline: 'بے مثال چمک اور 9H سیرامک پروٹیکشن حاصل کریں',
      subheadline:
        'لاہور بھر میں ماہرانہ پینٹ کریکشن، سرٹیفائیڈ 9H نینو سیرامک کوٹنگ اور مکمل انٹیریئر ڈیٹیلنگ — براہ راست آپ کے گھر یا ہمارے جدید اسٹوڈیو میں۔',
      primaryCta: 'ڈیٹیلنگ سلاٹ بک کریں',
      secondaryCta: 'پیکجز دیکھیں',
      whatsappCta: 'واٹس ایپ پر رابطہ کریں',
      statCarsLabel: 'گاڑیاں ڈیٹیل ہو چکی ہیں',
      statYearsLabel: 'سال کا تجربہ',
      statRatingLabel: 'گوگل میپس ریٹنگ',
      statProtectionLabel: 'سیرامک پروٹیکشن',
    },
    gallery: {
      kicker: 'حقیقی نتائج',
      title: 'پہلے اور بعد کی تبدیلی گیلری',
      subtitle:
        'سوئرل مارکس کے خاتمے، پینٹ کی گہری چمک اور لیدر سیٹوں کی بحالی کا موازنہ کرنے کے لیے سلائیڈر کو حرکت دیں۔',
      beforeLabel: 'پہلے',
      afterLabel: 'بعد میں',
      dragHint: 'موازنہ کے لیے سلائیڈر کھینچیں',
      sliderMode: 'انٹرایکٹو سلائیڈر',
      sideBySideMode: 'آمنے سامنے',
    },
    packages: {
      kicker: 'شفاف قیمتیں',
      title: 'سروسز اور ملٹی کرنسی پیکجز',
      subtitle:
        'فوری قیمت دیکھنے کے لیے گاڑی کی قسم اور کرنسی منتخب کریں۔ کسی بھی پیکج کا انتخاب بکنگ فارم خودکار بھر دے گا۔',
      vehicleSizeLabel: 'گاڑی کی قسم',
      vehicleClasses: {
        sedan: 'سیڈان / ہیچ بیک',
        suv: 'ایس یو وی / 4×4',
        luxury: 'لگژری / اسپورٹس',
      },
      featuredLabel: 'مقبول انتخاب',
      selectPackage: 'پیکج منتخب کریں',
      selectedPackage: 'بکنگ کے لیے منتخب',
      estimatedTime: 'متوقع وقت',
    },
    credentials: {
      kicker: 'اسٹوڈیو معیار',
      title: 'لگژری گاڑیوں کے لیے ماہرانہ نگہداشت',
      subtitle:
        'ہر گاڑی کی ڈیجیٹل پینٹ پیمائش، محفوظ pH نیوٹرل واش اور جدید سیرامک کیورنگ کے ساتھ دیکھ بھال کی جاتی ہے۔',
      items: [
        {
          title: '01. سرٹیفائیڈ 9H نینو سیرامک کوٹنگ',
          body: 'لاہور کی شدید دھوپ، سخت پانی اور ماحولیاتی اثرات سے گاڑی کے پینٹ کو برسوں محفوظ رکھے۔',
        },
        {
          title: '02. محفوظ pH نیوٹرل پروڈکٹس',
          body: 'سخت کیمیکلز کے بغیر عالمی معیار کے شیمپو اور لیدر کنڈیشنر جو فیکٹری فنش محفوظ رکھیں۔',
        },
        {
          title: '03. آپ کے دروازے پر موبائل یونٹ',
          body: 'ڈی ایچ اے، گلبرگ، کینٹ، جوہر ٹاؤن اور بحریہ ٹاؤن میں مکمل سازوسامان کے ساتھ ہوم سروس۔',
        },
        {
          title: '04. ڈیجیٹل پینٹ سیفٹی انسپیکشن',
          body: 'پالش سے قبل ہر پینل کی موٹائی چیک کی جاتی ہے تاکہ کلیئر کوٹ مکمل محفوظ رہے۔',
        },
      ],
    },
    reviews: {
      kicker: 'صارفین کی آراء',
      title: 'لائیو گوگل میپس ریویوز',
      subtitle:
        'ہمارے آفیشل گوگل میپس پروفائل سے براہ راست حاصل کردہ مصدقہ صارفین کے تبصرے۔',
      verifiedSource: 'گوگل میپس سے تصدیق شدہ',
      basedOn: 'گوگل ریویوز',
      viewAllOnMaps: 'گوگل میپس پر دیکھیں',
      loadingText: 'گوگل میپس ریویوز لوڈ ہو رہے ہیں...',
      noReviewsText: 'تازہ ترین ریویوز ہمارے گوگل میپس پروفائل پر دستیاب ہیں۔',
      retryLabel: 'دوبارہ لوڈ کریں',
    },
    booking: {
      kicker: 'اپائنٹمنٹ بکنگ',
      title: 'ہوم یا اسٹوڈیو ڈیٹیلنگ بک کریں',
      subtitle:
        'اپنی پسندیدہ تاریخ اور پیکج منتخب کریں اور فوری تصدیق حاصل کریں۔',
      fullName: 'مکمل نام',
      fullNamePlaceholder: 'مثلاً عثمان طارق',
      phone: 'فون نمبر',
      phonePlaceholder: '+92 300 1234567',
      whatsapp: 'واٹس ایپ نمبر',
      sameAsPhone: 'فون نمبر جیسا ہی ہے',
      vehicle: 'گاڑی کا نام، ماڈل اور سال',
      vehiclePlaceholder: 'مثلاً Audi A6, 2025',
      packageLabel: 'سروس پیکج منتخب کریں',
      serviceModeLabel: 'سروس کی جگہ',
      homeService: 'ہوم / ڈور اسٹیپ سروس',
      studioDropoff: 'اسٹوڈیو ڈراپ آف',
      preferredDate: 'پسندیدہ تاریخ',
      preferredTime: 'پسندیدہ وقت',
      notes: 'مزید ہدایات (اختیاری)',
      notesPlaceholder: 'گاڑی کا رنگ یا علاقہ لکھیں، مثلاً DHA Phase 6',
      submitCta: 'بکنگ کی تصدیق کریں',
      modalTitle: 'آپ کی بکنگ کنفرم ہو گئی ہے',
      modalSubtitle: 'ہمارا نمائندہ جلد آپ سے رابطہ کر کے وقت کی تصدیق کرے گا۔',
      referenceId: 'بکنگ ریفرنس',
      downloadCalendar: 'کیلنڈر میں محفوظ کریں',
      confirmWhatsapp: 'واٹس ایپ پر تفصیل بھیجیں',
      closeModal: 'بند کریں',
    },
    location: {
      kicker: 'مقام اور اوقات کار',
      title: 'لاہور میں اسٹوڈیو لوکیشن اور ہوم سروس',
      subtitle:
        'ہمارا مصدقہ گوگل میپس پتہ، اوقات کار اور فوری رابطے کی تفصیلات دیکھیں۔',
      addressLabel: 'مصدقہ پتہ',
      phoneLabel: 'فون اور واٹس ایپ',
      hoursLabel: 'کھلنے اور بند ہونے کے اوقات',
      openInMaps: 'گوگل میپس میں کھولیں',
      callStudio: 'کال کریں',
      chatWhatsapp: 'واٹس ایپ چیٹ',
      serviceAreasTitle: 'لاہور میں ہوم سروس کے علاقے',
      loadingListing: 'گوگل میپس سے تازہ تفصیلات حاصل کی جا رہی ہیں...',
      rightsReserved: 'جملہ حقوق محفوظ ہیں۔',
      developerCredit: 'اعلیٰ معیار کی آٹوموٹو ڈیٹیلنگ۔',
    },
  },
  ar: {
    dir: 'rtl',
    langName: 'العربية',
    nav: {
      home: 'الرئيسية',
      services: 'الخدمات',
      pricing: 'الباقات',
      gallery: 'المعرض',
      reviews: 'التقييمات',
      contact: 'اتصل بنا',
      bookNow: 'احجز الآن',
      whatsapp: 'واتساب',
    },
    hero: {
      locationLine: 'لاهور، باكستان · خدمة منزلية واستوديو عناية فائقة',
      headline: 'أطلق اللمعان الفائق وحماية النانو سيراميك 9H',
      subheadline:
        'تصحيح دقيق للطلاء، طلاء نانو سيراميك 9H معتمد، وترميم عميق للمقصورة في جميع أنحاء لاهور — في منزلك مباشرة أو داخل استوديو العناية المجهز.',
      primaryCta: 'احجز موعد العناية',
      secondaryCta: 'استكشف الباقات',
      whatsappCta: 'تواصل عبر واتساب',
      statCarsLabel: 'سيارة تمت العناية بها',
      statYearsLabel: 'سنوات من الخبرة',
      statRatingLabel: 'تقييم خرائط جوجل',
      statProtectionLabel: 'صلابة السيراميك',
    },
    gallery: {
      kicker: 'نتائج ملموسة',
      title: 'معرض التحول قبل وبعد العناية',
      subtitle:
        'اسحب مؤشر المقارنة لمشاهدة إزالة الخدوش الدائرية وعمق اللمعان وتجديد الجلد الفاخر تحت إضاءة فحص LED.',
      beforeLabel: 'قبل',
      afterLabel: 'بعد',
      dragHint: 'اسحب للمقارنة',
      sliderMode: 'مقارنة تفاعلية',
      sideBySideMode: 'جنباً إلى جنب',
    },
    packages: {
      kicker: 'باقات شفافة',
      title: 'الخدمات والباقات متعددة العملات',
      subtitle:
        'اختر فئة سيارتك والعملة المفضلة لمعرفة السعر الفوري. اختيار أي باقة يملأ نموذج الحجز تلقائياً.',
      vehicleSizeLabel: 'فئة السيارة',
      vehicleClasses: {
        sedan: 'سيدان / هاتشباك',
        suv: 'دفع رباعي / SUV',
        luxury: 'فاخرة / رياضية',
      },
      featuredLabel: 'الاختيار الأبرز',
      selectPackage: 'اختر الباقة',
      selectedPackage: 'تم الاختيار للحجز',
      estimatedTime: 'المدة المقدرة',
    },
    credentials: {
      kicker: 'معايير الاستوديو',
      title: 'مصمم لعشاق السيارات الفاخرة',
      subtitle:
        'تخضع كل سيارة لفحص رقمي لسمك الطلاء وغسيل متعادل الحموضة وتصلب سيراميك دقيق.',
      items: [
        {
          title: '01. أنظمة نانو سيراميك 9H معتمدة',
          body: 'حماية فائقة ضد حرارة الشمس والأشعة فوق البنفسجية والأملاح لسنوات طويلة.',
        },
        {
          title: '02. مواد آمنة متعادلة الحموضة',
          body: 'خالٍ تماماً من المواد الكاوية؛ منظفات وبلسم جلد تحافظ على جودة المصنع الأصلية.',
        },
        {
          title: '03. وحدات خدمة منزلية متكاملة',
          body: 'نصلك أينما كنت في لاهور (DHA، غولبرغ، كانت، بحرية تاون) بكامل المعدات الاحترافية.',
        },
        {
          title: '04. أمان الطلاء بقياس الميكرون',
          body: 'نقيس سماكة الطلاء رقمياً على كل جزء قبل التلميع لضمان أقصى لمعان بأمان تام.',
        },
      ],
    },
    reviews: {
      kicker: 'آراء العملاء الموثقة',
      title: 'تقييمات خرائط جوجل المباشرة',
      subtitle:
        'تقييمات ومراجعات حقيقية محملة مباشرة من ملفنا الرسمي على خرائط جوجل.',
      verifiedSource: 'موثق عبر خرائط جوجل',
      basedOn: 'مراجعة جوجل',
      viewAllOnMaps: 'عرض الملف على خرائط جوجل',
      loadingText: 'جارٍ تحميل تقييمات خرائط جوجل...',
      noReviewsText: 'يمكنك الاطلاع على كافة المراجعات مباشرة على خرائط جوجل.',
      retryLabel: 'تحديث البيانات',
    },
    booking: {
      kicker: 'احجز موعدك',
      title: 'حجز عناية منزلية أو في الاستوديو',
      subtitle:
        'اختر التاريخ والوقت والباقة المناسبة للحصول على تأكيد فوري.',
      fullName: 'الاسم الكامل',
      fullNamePlaceholder: 'مثال: عمر طارق',
      phone: 'رقم الهاتف',
      phonePlaceholder: '+92 300 1234567',
      whatsapp: 'رقم واتساب',
      sameAsPhone: 'نفس رقم الهاتف',
      vehicle: 'نوع السيارة والموديل والسنة',
      vehiclePlaceholder: 'مثال: Audi A6, 2025',
      packageLabel: 'باقة الخدمة',
      serviceModeLabel: 'موقع الخدمة',
      homeService: 'خدمة منزلية أمام الباب',
      studioDropoff: 'زيارة الاستوديو',
      preferredDate: 'التاريخ المفضل',
      preferredTime: 'الوقت المفضل',
      notes: 'ملاحظات إضافية (اختياري)',
      notesPlaceholder: 'لون السيارة أو تفاصيل إضافية',
      submitCta: 'تأكيد موعد العناية',
      modalTitle: 'تم تأكيد طلب الحجز بنجاح',
      modalSubtitle: 'تم تسجيل موعدك وسيتواصل معك فريقنا قريباً لتأكيد التفاصيل.',
      referenceId: 'رقم المرجع',
      downloadCalendar: 'إضافة إلى التقويم',
      confirmWhatsapp: 'إرسال التفاصيل عبر واتساب',
      closeModal: 'إغلاق',
    },
    location: {
      kicker: 'الموقع وساعات العمل',
      title: 'موقعنا وتغطية الخدمة في لاهور',
      subtitle:
        'تصفح موقعنا المعتمد على خرائط جوجل، ساعات العمل اليومية، ووسائل الاتصال المباشر.',
      addressLabel: 'العنوان المعتمد',
      phoneLabel: 'الهاتف وواتساب المباشر',
      hoursLabel: 'ساعات العمل',
      openInMaps: 'فتح في خرائط جوجل',
      callStudio: 'اتصال مباشر',
      chatWhatsapp: 'محادثة واتساب',
      serviceAreasTitle: 'مناطق التغطية المنزلية',
      loadingListing: 'جارٍ مزامنة بيانات خرائط جوجل...',
      rightsReserved: 'جميع الحقوق محفوظة.',
      developerCredit: 'عناية فائقة بالسيارات بأعلى المعايير.',
    },
  },
  es: {
    dir: 'ltr',
    langName: 'Español',
    nav: {
      home: 'Inicio',
      services: 'Servicios',
      pricing: 'Paquetes',
      gallery: 'Galería',
      reviews: 'Reseñas',
      contact: 'Contacto',
      bookNow: 'Reservar',
      whatsapp: 'WhatsApp',
    },
    hero: {
      locationLine: 'Lahore, Pakistán · Estudio y Detallado a Domicilio',
      headline: 'Desata el Máximo Brillo y Protección Cerámica 9H',
      subheadline:
        'Corrección de pintura de precisión, recubrimiento cerámico 9H certificado y restauración profunda de cabina en Lahore — en tu domicilio o en nuestro estudio.',
      primaryCta: 'Reservar Cita',
      secondaryCta: 'Ver Paquetes',
      whatsappCta: 'Chatear en WhatsApp',
      statCarsLabel: 'Vehículos Restaurados',
      statYearsLabel: 'Años de Maestría',
      statRatingLabel: 'Calificación Google',
      statProtectionLabel: 'Dureza Cerámica',
    },
    gallery: {
      kicker: 'Resultados Verificables',
      title: 'Galería de Transformación Antes y Después',
      subtitle:
        'Desliza el comparador para inspeccionar la eliminación de remolinos, la claridad de pintura y la renovación de cuero bajo luz LED.',
      beforeLabel: 'Antes',
      afterLabel: 'Después',
      dragHint: 'Desliza para comparar',
      sliderMode: 'Deslizador Interactivo',
      sideBySideMode: 'Lado a Lado',
    },
    packages: {
      kicker: 'Tarifas Transparentes',
      title: 'Servicios y Paquetes Multidivisa',
      subtitle:
        'Selecciona el tipo de vehículo y tu moneda para ver precios en tiempo real. Al elegir un paquete se completa automáticamente tu reserva.',
      vehicleSizeLabel: 'Clase de Vehículo',
      vehicleClasses: {
        sedan: 'Sedán / Hatchback',
        suv: 'SUV / 4×4',
        luxury: 'Lujo / Deportivo',
      },
      featuredLabel: 'Elección Insignia',
      selectPackage: 'Seleccionar Paquete',
      selectedPackage: 'Seleccionado para Cita',
      estimatedTime: 'Duración Estimada',
    },
    credentials: {
      kicker: 'Estándares del Estudio',
      title: 'Diseñado para Puristas del Automóvil',
      subtitle:
        'Cada vehículo pasa por medición ultrasónica de espesor, lavado pH neutro desionizado y curado cerámico controlado.',
      items: [
        {
          title: '01. Sistemas Cerámicos 9H Certificados',
          body: 'Recubrimientos SiO2 hidrofóbicos que protegen contra rayos UV extremos, cal del agua y lluvia ácida por años.',
        },
        {
          title: '02. Química pH Neutro Desionizada',
          body: 'Sin desengrasantes agresivos ni siliconas. Cada champú y bálsamo protege el barniz original y el cuero delicado.',
        },
        {
          title: '03. Unidades Móviles Autónomas a Domicilio',
          body: 'Comodidad total en casa u oficina en DHA, Gulberg, Cantt, Johar Town y Bahria Town.',
        },
        {
          title: '04. Seguridad de Pintura por Micrómetro',
          body: 'Medimos cada panel antes de pulir para lograr máximo reflejo espejo sin comprometer el barniz.',
        },
      ],
    },
    reviews: {
      kicker: 'Opiniones Verificadas',
      title: 'Reseñas en Vivo de Google Maps',
      subtitle:
        'Calificaciones y comentarios auténticos cargados directamente desde nuestro perfil oficial en Google Maps.',
      verifiedSource: 'Verificado en Google Maps',
      basedOn: 'reseñas en Google',
      viewAllOnMaps: 'Ver Perfil en Google Maps',
      loadingText: 'Cargando reseñas verificadas de Google Maps...',
      noReviewsText:
        'Las reseñas de clientes están disponibles directamente en nuestro perfil oficial de Google Maps.',
      retryLabel: 'Actualizar Listado',
    },
    booking: {
      kicker: 'Reserva tu Turno',
      title: 'Agenda Detallado en Estudio o a Domicilio',
      subtitle:
        'Asegura tu fecha y paquete preferido con confirmación inmediata y opción de envío directo por WhatsApp.',
      fullName: 'Nombre Completo',
      fullNamePlaceholder: 'Ej. Carlos Mendoza',
      phone: 'Teléfono',
      phonePlaceholder: '+92 300 1234567',
      whatsapp: 'Número de WhatsApp',
      sameAsPhone: 'Igual que el teléfono',
      vehicle: 'Marca, Modelo y Año del Vehículo',
      vehiclePlaceholder: 'Ej. Audi A6, 2025',
      packageLabel: 'Paquete de Servicio',
      serviceModeLabel: 'Modalidad de Servicio',
      homeService: 'Servicio a Domicilio',
      studioDropoff: 'Entrega en Estudio',
      preferredDate: 'Fecha Preferida',
      preferredTime: 'Horario Preferido',
      notes: 'Color de Pintura y Notas (Opcional)',
      notesPlaceholder: 'Ej. Negro brillante con remolinos leves en el capó',
      submitCta: 'Confirmar Cita de Detallado',
      modalTitle: 'Solicitud de Cita Confirmada',
      modalSubtitle:
        'Tu espacio ha sido reservado. Nuestro especialista te contactará en breve para confirmar.',
      referenceId: 'Código de Reserva',
      downloadCalendar: 'Guardar en Calendario (.ics)',
      confirmWhatsapp: 'Enviar Resumen por WhatsApp',
      closeModal: 'Cerrar',
    },
    location: {
      kicker: 'Ubicación y Horarios',
      title: 'Visítanos o Reserva a Domicilio en Lahore',
      subtitle:
        'Consulta nuestro pin oficial en Google Maps, horarios diarios y canales de atención directa.',
      addressLabel: 'Dirección Verificada',
      phoneLabel: 'Teléfono y WhatsApp',
      hoursLabel: 'Horarios de Atención',
      openInMaps: 'Abrir en Google Maps',
      callStudio: 'Llamar Ahora',
      chatWhatsapp: 'WhatsApp Directo',
      serviceAreasTitle: 'Cobertura Móvil en Lahore',
      loadingListing: 'Sincronizando datos en vivo desde Google Maps...',
      rightsReserved: 'Todos los derechos reservados.',
      developerCredit: 'Diseñado para el cuidado automotriz de precisión.',
    },
  },
};
