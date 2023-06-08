module.exports = {
  notifWaiting(toast) {
    var toastWaait = toast('Waiting for verification', {
      position: 'bottom-right',
      timeout: false,
      closeOnClick: true,
      showCloseButtonOnHover: false,
      hideProgressBar: false,
      closeButton: 'button',
      icon: true,  // Optional
    }) 
    return toastWaait
  },
  notifError(toast, error) {
    var toastError = toast.error('Error! ' + error, {
      position: 'bottom-right',
      timeout: 5000,
      closeOnClick: true,
      showCloseButtonOnHover: false,
      hideProgressBar: false,
      closeButton: 'button',
      icon: true,  // Optional
    }) 
    return toastError
  },  
  notifSuccess(toast) {
    var toastSuccess = toast.success('Tx send!', {
      position: 'bottom-right',
      timeout: 5000,
      closeOnClick: true,
      showCloseButtonOnHover: false,
      hideProgressBar: false,
      closeButton: 'button',
      icon: true,  // Optional
    }) 
    return toastSuccess
  },
  notifAccountAdded(toast, text) {
    var toastSuccess = toast.success(text, {
      position: 'bottom-right',
      timeout: 2000,
      closeOnClick: true,
      showCloseButtonOnHover: false,
      hideProgressBar: false,
      closeButton: 'button',
      icon: true,  // Optional
    }) 
    return toastSuccess
  },  
  notifAccountDeleted(toast, text) {
    var toastAccountDel = toast.info(text, {
      position: 'bottom-right',
      timeout: 2000,
      closeOnClick: true,
      showCloseButtonOnHover: false,
      hideProgressBar: false,
      closeButton: 'button',
      icon: true,  // Optional
    }) 
    return toastAccountDel
  },   
} 
