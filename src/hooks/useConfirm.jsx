import { createContext, useContext, useState, useCallback } from 'react'
import ConfirmDialog from '../components/feedback/ConfirmDialog'

// ─── Context ───
const ConfirmContext = createContext(null)

// ─── Provider ───
export function ConfirmProvider({ children }) {
  const [state, setState] = useState({
    open: false,
    title: '',
    message: '',
    description: '',
    confirmText: 'تأیید',
    cancelText: 'انصراف',
    variant: 'danger',
    onConfirm: null,
    resolve: null,
  })

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setState({
        open: true,
        title: options.title || '',
        message: options.message || '',
        description: options.description || '',
        confirmText: options.confirmText || 'تأیید',
        cancelText: options.cancelText || 'انصراف',
        variant: options.variant || 'danger',
        onConfirm: options.onConfirm || null,
        resolve,
      })
    })
  }, [])

  function handleConfirm() {
    state.resolve?.(true)
    state.onConfirm?.()
    setState((s) => ({ ...s, open: false }))
  }

  function handleCancel() {
    state.resolve?.(false)
    setState((s) => ({ ...s, open: false }))
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmDialog
        open={state.open}
        title={state.title}
        message={state.message}
        description={state.description}
        confirmText={state.confirmText}
        cancelText={state.cancelText}
        variant={state.variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  )
}

// ─── Hook ───
export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) {
    throw new Error('useConfirm باید داخل ConfirmProvider استفاده شود')
  }
  return ctx
}