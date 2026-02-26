// Toast notification composable
import { ref } from 'vue'
import type { ToastMessage } from '~/types'

const toasts = ref<ToastMessage[]>([])

export function useToast() {
  function addToast(message: string, type: ToastMessage['type'] = 'info', duration = 3000): void {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
    toasts.value.push({ id, message, type, duration })
    setTimeout(() => dismiss(id), duration)
  }

  function dismiss(id: string): void {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  const success = (msg: string) => addToast(msg, 'success')
  const error   = (msg: string) => addToast(msg, 'error')
  const info    = (msg: string) => addToast(msg, 'info')

  return { toasts, success, error, info, dismiss }
}