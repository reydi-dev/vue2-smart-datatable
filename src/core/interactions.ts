/** Read native form state without assuming DOM globals exist during module loading. */
export function inputChecked(event: Event): boolean {
  return Boolean(event.target && 'checked' in event.target && event.target.checked)
}

/** Interactive content in a cell/slot owns its click; it must not also activate the row. */
export function isInteractiveTarget(event: Event): boolean {
  const target = event.target
  return Boolean(
    target &&
    'closest' in target &&
    typeof target.closest === 'function' &&
    target.closest(
      'button, a, input, select, textarea, summary, [role="button"], [role="link"], [contenteditable]:not([contenteditable="false"])',
    ),
  )
}
