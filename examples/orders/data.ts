export type OrderStatus = 'completed' | 'processing' | 'pending' | 'cancelled'
export interface Order {
  id: string
  customer: string
  email: string
  initials: string
  amount: number
  status: OrderStatus
  date: string
  items: number
  payment: 'paid' | 'unpaid' | 'refunded'
  shipping: 'express' | 'standard' | 'pickup'
  city: { en: string; fa: string }
  priority: boolean
  tags: string[]
  description: { en: string; fa: string }
}

export const extraColumns = ['items', 'payment', 'shipping', 'city', 'priority', 'tags', 'description'] as const
export type ExtraColumn = (typeof extraColumns)[number]
const descriptions = [
  {
    en: 'Gift order. Please remove the price tag and include a handwritten note.',
    fa: 'سفارش هدیه است؛ لطفاً برچسب قیمت برداشته شود و یک یادداشت همراه بسته قرار بگیرد.',
  },
  {
    en: 'Deliver to the reception desk between 10:00 and 16:00. The customer has requested recyclable packaging and separate wrapping for each item. If the main entrance is closed, call before attempting delivery. This longer note is included to check wrapping and reading on a narrow screen without losing any of the instructions.',
    fa: 'بسته بین ساعت ۱۰ تا ۱۶ به پذیرش ساختمان تحویل داده شود. مشتری بسته‌بندی قابل بازیافت و بسته‌بندی جداگانه برای هر کالا درخواست کرده است. اگر ورودی اصلی بسته بود، پیش از تحویل تماس بگیرید. این توضیح طولانی برای بررسی شکستن خطوط و خواندن تمام جزئیات در صفحه کوچک اضافه شده تا هیچ بخشی از دستور تحویل پنهان نماند.',
  },
  { en: '', fa: '' },
  {
    en: 'Delivery instructions:\n1. Call before arrival.\n2. Leave with reception; do not leave outside.',
    fa: 'راهنمای تحویل:\n۱. پیش از رسیدن تماس بگیرید.\n۲. بسته به پذیرش تحویل داده شود؛ بیرون ساختمان قرار نگیرد.',
  },
  {
    en: 'Cancelled by customer. Payment refund is being reviewed.',
    fa: 'سفارش به درخواست مشتری لغو شده است. وضعیت بازپرداخت در حال بررسی است.',
  },
  {
    en: 'Reference: REF-20261021-WAREHOUSE-NORTH-EXPRESS-DELIVERY-CUSTOMER-REQUEST-0000001043',
    fa: 'شناسه پیگیری: REF-20261021-WAREHOUSE-NORTH-EXPRESS-DELIVERY-CUSTOMER-REQUEST-0000001043',
  },
  {
    en: 'Fragile items. Keep upright during transit.',
    fa: 'کالاها شکستنی هستند؛ بسته هنگام حمل به‌صورت عمودی نگهداری شود.',
  },
  {
    en: 'Customer will collect from the store after receiving confirmation.',
    fa: 'مشتری پس از دریافت پیام تأیید، سفارش را حضوری از فروشگاه دریافت می‌کند.',
  },
]
const cities = [
  { en: 'Tehran', fa: 'تهران' },
  { en: 'Shiraz', fa: 'شیراز' },
  { en: 'Isfahan', fa: 'اصفهان' },
  { en: 'Mashhad', fa: 'مشهد' },
]

const customers = [
  ['Olivia Rhye', 'olivia@acme.design', 'OR'],
  ['Phoenix Baker', 'phoenix@layers.studio', 'PB'],
  ['Lana Steiner', 'lana@sisyphus.com', 'LS'],
  ['Demi Wilkinson', 'demi@catalog.studio', 'DW'],
  ['Drew Cano', 'drew@circooles.com', 'DC'],
  ['Natali Craig', 'natali@hourglass.app', 'NC'],
  ['Orlando Diggs', 'orlando@command.design', 'OD'],
  ['Andi Lane', 'andi@quotient.co', 'AL'],
]
const statuses: OrderStatus[] = [
  'completed',
  'processing',
  'completed',
  'pending',
  'cancelled',
  'processing',
  'completed',
  'pending',
]
function createOrders(count: number): Order[] {
  return Array.from({ length: count }, (_, index) => {
    const [customer, email, initials] = customers[index % customers.length]
    return {
      id: `ORD-${1048 - index}`,
      customer,
      email,
      initials,
      amount: [240, 1250, 89, 560, 320, 145, 890, 75][index % 8] + Math.floor(index / 8) * 20,
      status: statuses[index % 8],
      date: new Date(Date.UTC(2026, 9, 21 - Math.floor(index / 2))).toISOString().slice(0, 10),
      items: (index % 4) + 1,
      payment: statuses[index % 8] === 'cancelled' ? 'refunded' : index % 3 === 0 ? 'unpaid' : 'paid',
      shipping: index % 8 === 7 ? 'pickup' : index % 2 === 0 ? 'express' : 'standard',
      city: cities[index % cities.length],
      priority: index % 3 === 0,
      tags: index % 4 === 2 ? [] : index % 2 === 0 ? ['gift', 'fragile'] : ['returningCustomer'],
      description: descriptions[index % descriptions.length],
    }
  })
}
export const orders = createOrders(24)
export const largeOrders = createOrders(800)

export const copy = {
  en: {
    lab: 'Design exploration',
    prototype: 'Interactive prototype',
    eyebrow: 'WORKSPACE / COMMERCE',
    title: 'A clearer view of every order.',
    intro: 'Two visual directions. One familiar workflow. Explore the details that make a table feel effortless.',
    directionA: '01 · Clarity',
    directionB: '02 · Precision',
    descriptionA: 'Calm surfaces, generous spacing, a softer rhythm.',
    descriptionB: 'Defined structure, tighter rows, a focused workspace.',
    compare: 'Visual direction',
    language: 'Language',
    orders: 'Orders',
    subtitle: 'Track, filter, and manage customer orders.',
    records: 'orders',
    all: 'All orders',
    completed: 'Completed',
    processing: 'Processing',
    pending: 'Pending',
    cancelled: 'Cancelled',
    search: 'Search by customer or order ID…',
    searchLabel: 'Search orders',
    filters: 'Filters',
    columns: 'Columns',
    export: 'Export CSV',
    exportScope: 'Export scope',
    results: 'Filtered results',
    selectedScope: 'Selected rows',
    customer: 'Customer',
    amount: 'Amount',
    status: 'Status',
    date: 'Order date',
    id: 'Order',
    selected: 'selected across pages',
    clearSelection: 'Clear selection',
    clearFilters: 'Clear filters',
    min: 'Minimum amount (USD)',
    any: 'Any status',
    clear: 'Clear',
    selectPage: 'Select this page',
    selectRow: 'Select order',
    details: 'View order',
    previous: 'Previous page',
    next: 'Next page',
    perPage: 'Rows per page',
    of: 'of',
    state: 'Preview state',
    ready: 'Ready',
    loading: 'Loading',
    error: 'Error',
    empty: 'No data',
    loadingTitle: 'Loading your orders',
    loadingText: 'Your workspace will be ready in a moment.',
    errorTitle: 'Orders couldn’t be loaded',
    errorText: 'Please try again. Your filters and selection are still here.',
    retry: 'Try again',
    emptyTitle: 'Your orders will appear here',
    emptyText: 'When your store receives its first order, you’ll find it here.',
    noResults: 'No matching orders',
    noResultsText: 'Try another search or remove a filter to see more orders.',
    note: 'Sample data · Local interactions · No backend connected',
    close: 'Close order details',
    items: 'Items',
    notice: 'Live feedback',
    downloadReady: 'CSV downloaded',
    page: 'Page',
    goToPage: 'Go to page',
    go: 'Go',
    pageRange: 'Enter a whole page number from',
    to: 'to',
    dataset: 'Sample dataset',
    standardDataset: '24 orders',
    largeDataset: '800 orders · 100 pages at 8 rows',
    payment: 'Payment',
    shipping: 'Delivery',
    city: 'City',
    priority: 'Priority',
    tags: 'Tags',
    description: 'Description',
    paid: 'Paid',
    unpaid: 'Unpaid',
    refunded: 'Refunded',
    express: 'Express',
    standard: 'Standard',
    pickup: 'Store pickup',
    yes: 'Yes',
    no: 'No',
    gift: 'Gift',
    fragile: 'Fragile',
    returningCustomer: 'Returning customer',
    notProvided: 'Not provided',
    email: 'Email',
    moreDetails: 'More details',
    previewWidth: 'Preview width',
    desktop: 'Desktop',
    mobile: 'Mobile · 390px',
  },
  fa: {
    lab: 'کاوش طراحی',
    prototype: 'نمونه تعاملی',
    eyebrow: 'فضای کاری / فروش',
    title: 'تصویری روشن از تمام سفارش‌ها.',
    intro: 'دو مسیر بصری، یک جریان کاری. جزئیاتی را بررسی کنید که کار با جدول را روان‌تر می‌کنند.',
    directionA: '۰۱ · وضوح',
    directionB: '۰۲ · دقت',
    descriptionA: 'سطوح آرام، فاصله‌های باز و ریتمی ملایم‌تر.',
    descriptionB: 'ساختار مشخص، ردیف‌های فشرده و فضای کاری متمرکز.',
    compare: 'مسیر بصری',
    language: 'زبان',
    orders: 'سفارش‌ها',
    subtitle: 'سفارش مشتریان را پیدا، بررسی و مدیریت کنید.',
    records: 'سفارش',
    all: 'همه سفارش‌ها',
    completed: 'تکمیل‌شده',
    processing: 'در حال پردازش',
    pending: 'در انتظار',
    cancelled: 'لغوشده',
    search: 'جست‌وجوی مشتری یا شماره سفارش…',
    searchLabel: 'جست‌وجوی سفارش‌ها',
    filters: 'فیلترها',
    columns: 'ستون‌ها',
    export: 'خروجی CSV',
    exportScope: 'محدوده خروجی',
    results: 'نتایج فیلترشده',
    selectedScope: 'ردیف‌های انتخاب‌شده',
    customer: 'مشتری',
    amount: 'مبلغ',
    status: 'وضعیت',
    date: 'تاریخ سفارش',
    id: 'سفارش',
    selected: 'انتخاب‌شده در تمام صفحه‌ها',
    clearSelection: 'لغو انتخاب‌ها',
    clearFilters: 'پاک‌کردن فیلترها',
    min: 'حداقل مبلغ (دلار)',
    any: 'همه وضعیت‌ها',
    clear: 'پاک‌کردن',
    selectPage: 'انتخاب ردیف‌های این صفحه',
    selectRow: 'انتخاب سفارش',
    details: 'مشاهده سفارش',
    previous: 'صفحه قبل',
    next: 'صفحه بعد',
    perPage: 'ردیف در هر صفحه',
    of: 'از',
    state: 'پیش‌نمایش حالت',
    ready: 'آماده',
    loading: 'بارگذاری',
    error: 'خطا',
    empty: 'بدون داده',
    loadingTitle: 'در حال دریافت سفارش‌ها',
    loadingText: 'اطلاعات سفارش‌ها به‌زودی نمایش داده می‌شود.',
    errorTitle: 'دریافت سفارش‌ها انجام نشد',
    errorText: 'دوباره تلاش کنید؛ فیلترها و انتخاب‌های شما حفظ شده‌اند.',
    retry: 'تلاش مجدد',
    emptyTitle: 'سفارش‌ها اینجا نمایش داده می‌شوند',
    emptyText: 'با دریافت اولین سفارش فروشگاه، آن را اینجا خواهید دید.',
    noResults: 'سفارشی با این شرایط پیدا نشد',
    noResultsText: 'عبارت دیگری جست‌وجو کنید یا یکی از فیلترها را بردارید.',
    note: 'داده نمونه · تعامل‌های محلی · بدون اتصال به سرور',
    close: 'بستن جزئیات سفارش',
    items: 'تعداد کالا',
    notice: 'بازخورد زنده',
    downloadReady: 'فایل CSV دریافت شد',
    page: 'صفحه',
    goToPage: 'رفتن به صفحه',
    go: 'برو',
    pageRange: 'یک شماره صفحه صحیح وارد کنید؛ از',
    to: 'تا',
    dataset: 'داده نمونه',
    standardDataset: '۲۴ سفارش',
    largeDataset: '۸۰۰ سفارش · ۱۰۰ صفحه با ۸ ردیف',
    payment: 'پرداخت',
    shipping: 'روش ارسال',
    city: 'شهر',
    priority: 'اولویت بالا',
    tags: 'برچسب‌ها',
    description: 'توضیحات',
    paid: 'پرداخت‌شده',
    unpaid: 'پرداخت‌نشده',
    refunded: 'بازپرداخت‌شده',
    express: 'سریع',
    standard: 'عادی',
    pickup: 'تحویل حضوری',
    yes: 'بله',
    no: 'خیر',
    gift: 'هدیه',
    fragile: 'شکستنی',
    returningCustomer: 'مشتری قدیمی',
    notProvided: 'ثبت نشده',
    email: 'ایمیل',
    moreDetails: 'جزئیات بیشتر',
    previewWidth: 'عرض پیش‌نمایش',
    desktop: 'دسکتاپ',
    mobile: 'موبایل · ۳۹۰ پیکسل',
  },
}

export function formatExtra(row: Order, column: ExtraColumn, locale: 'en' | 'fa'): string {
  const t = copy[locale]
  switch (column) {
    case 'items':
      return new Intl.NumberFormat(locale).format(row.items)
    case 'payment':
      return t[row.payment]
    case 'shipping':
      return t[row.shipping]
    case 'city':
      return row.city[locale]
    case 'priority':
      return row.priority ? t.yes : t.no
    case 'tags':
      return row.tags.map((tag) => t[tag as 'gift' | 'fragile' | 'returningCustomer']).join(' · ') || t.notProvided
    case 'description':
      return row.description[locale] || t.notProvided
  }
}
