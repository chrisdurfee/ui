
/**
 * @constant {string} sizeClass
 * Common size & spacing classes for inputs.
 */
export const sizeClass = "flex h-10 w-full px-3 py-2 text-sm";

/**
 * @constant {string} borderClass
 * Common border & background classes for inputs.
 */
export const borderClass = "rounded-md border border-border bg-input";

/**
 * @constant {string} focusClass
 * Common focus and ring classes for inputs.
 */
export const focusClass = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background";

/**
 * @constant {string} disabledClass
 * Common classes for disabled state.
 */
export const disabledClass = "disabled:cursor-not-allowed disabled:opacity-50 [&:user-invalid]:border-destructive";

/**
 * @constant {string} placeholderClass
 * Common classes for placeholder text.
 */
export const placeholderClass = "placeholder:text-muted-foreground";

/**
 * @constant {string} commonInputClasses
 * Composed classes for text-like inputs (text, email, tel, etc.).
 */
export const commonInputClasses = `${sizeClass} ${borderClass} ${focusClass} ${placeholderClass} ${disabledClass}`;