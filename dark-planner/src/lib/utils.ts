import { clsx, type ClassValue } from 'clsx'
import type { Channel } from './types'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function channelUrl(channel: Channel): string {
  return channel.url?.trim() || `https://www.youtube.com/${channel.handle}`
}

export function formatCompactNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}

export function formatDate(value: string | Date, locale: string): string {
  const date = typeof value === 'string' ? new Date(value) : value
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short' }).format(date)
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}
