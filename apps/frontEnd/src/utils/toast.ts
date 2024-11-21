import Toast from 'typescript-toastify'

export function showToast(message: string): void {
  const toast = new Toast({
    position: 'top-right',
    autoCloseTime: 2000,
    canClose: true,
    showProgress: true,
    pauseOnHover: true,
    pauseOnFocusLoss: true,
    type: 'default',
    theme: 'light',
  })
  toast.update({ toastMsg: message })
}
