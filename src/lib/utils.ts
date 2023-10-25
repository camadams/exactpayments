import { type ClassValue, clsx } from "clsx"
import { addHours, addMinutes } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function addTimezoneOffset(date: Date | undefined) {
    if (!date) return undefined
    const timezoneOffset = -1 * date.getTimezoneOffset();
    const dateWithTimezoneAdded = addMinutes(date, timezoneOffset);
    return dateWithTimezoneAdded;
}