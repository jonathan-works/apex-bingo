import { Notify, Screen } from 'quasar';

export default function useNotify() {
  const notifySuccess = (message: string) => {
    Notify.create({
      type: 'positive',
      message: message || 'Sucesso !',
      position: Screen.lt.sm ? 'bottom' : 'top-right',
      timeout: 1000,
    });
  };
  const notifyWarning = (message: string) => {
    Notify.create({
      type: 'warning',
      message: message || 'Atenção !',
      position: Screen.lt.sm ? 'bottom' : 'top-right',
      timeout: 1000,
    });
  };

  const notifyError = (message: string) => {
    Notify.create({
      type: 'negative',
      message: message || 'Erro !',
      position: Screen.lt.sm ? 'bottom' : 'top-right',
    });
  };

  const notifyErrorResponseAPI = (error: any) => {
    let msg = 'Ocorreu um erro inesperado. tente novamente mais tarde';

    const notify = {
      type: 'negative',
      message: msg,
      position: Screen.lt.sm ? 'bottom' : 'top-right',
    } as any;

    if (error && Array.isArray(error)) {
      msg = '';
      error.forEach((x: any) => {
        msg += `${x.mensagem} <br>`;
      });

      notify.message = msg;
      notify.html = true;
    } else if (error && error?.msg) {
      notify.message = error.msg;
    }

    Notify.create(notify);
  };

  return {
    notifyErrorResponseAPI,
    notifySuccess,
    notifyWarning,
    notifyError,
  };
}
