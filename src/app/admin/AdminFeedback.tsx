'use client';

import { useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import type { AdminFeedbackSeverity } from './feedback';

type AdminFeedbackProps = {
  message: string;
  severity: AdminFeedbackSeverity;
};

export default function AdminFeedback({ message, severity }: AdminFeedbackProps) {
  const [open, setOpen] = useState(true);

  return (
    <Snackbar
      open={open}
      onClose={() => setOpen(false)}
      autoHideDuration={4500}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={() => setOpen(false)} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
