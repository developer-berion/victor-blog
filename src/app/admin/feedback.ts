export type AdminFeedbackSeverity = 'success' | 'error' | 'info' | 'warning';

export type AdminFeedbackState = {
  message: string;
  severity: AdminFeedbackSeverity;
};

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function getAdminFeedback(searchParams?: Record<string, string | string[] | undefined>) {
  const saved = readParam(searchParams?.saved);
  const deleted = readParam(searchParams?.deleted);
  const error = readParam(searchParams?.error);

  if (saved === '1') {
    return {
      message: 'Post guardado correctamente.',
      severity: 'success',
    } satisfies AdminFeedbackState;
  }

  if (deleted === '1') {
    return {
      message: 'Post borrado correctamente.',
      severity: 'success',
    } satisfies AdminFeedbackState;
  }

  switch (error) {
    case 'missing_fields':
      return {
        message: 'Completa los campos requeridos antes de guardar.',
        severity: 'error',
      } satisfies AdminFeedbackState;
    case 'save_failed':
      return {
        message: 'No se pudo guardar el post. Revisa los datos e intenta otra vez.',
        severity: 'error',
      } satisfies AdminFeedbackState;
    case 'delete_failed':
      return {
        message: 'No se pudo borrar el post. Intenta nuevamente.',
        severity: 'error',
      } satisfies AdminFeedbackState;
    case 'missing_id':
      return {
        message: 'Falta el identificador del post para completar la acción.',
        severity: 'error',
      } satisfies AdminFeedbackState;
    case 'no_author':
      return {
        message: 'No hay un autor configurado para publicar.',
        severity: 'warning',
      } satisfies AdminFeedbackState;
    default:
      return null;
  }
}
