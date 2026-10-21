/** Parse an explicitly submitted one-based page, including Persian and Arabic-Indic digits. */
export function parsePageInput(value: string, pageCount: number): number | null {
  const normalized = value
    .trim()
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
  if (!/^\d+$/.test(normalized)) return null
  const page = Number(normalized)
  return Number.isSafeInteger(page) && page >= 1 && page <= pageCount ? page : null
}
