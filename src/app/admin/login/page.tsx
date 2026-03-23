import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Alert, Box, Button, Chip, Container, Paper, Stack, TextField, Typography } from '@mui/material';
import { getAdminSession } from '@/lib/admin';

export const metadata: Metadata = {
  title: 'Admin Login',
  description: 'Acceso al panel administrativo del blog.',
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  if (await getAdminSession()) {
    redirect('/admin/posts');
  }

  const hasError = searchParams?.error === '1';

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 4, md: 8 },
      }}
    >
      <Paper variant="outlined" sx={{ width: '100%', p: { xs: 3, md: 4 } }}>
        <Stack spacing={2.5}>
          <Chip label="Admin" color="primary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
          <Box>
            <Typography variant="h4" component="h1">
              Acceder al panel
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Usa la contraseña administrativa para publicar y editar artículos.
            </Typography>
          </Box>

          {hasError ? <Alert severity="error">La contraseña no coincide.</Alert> : null}

          <Box component="form" action="/api/admin/login" method="post">
            <Stack spacing={2}>
              <TextField
                id="password"
                name="password"
                type="password"
                label="Contraseña"
                required
                autoFocus
              />
              <Button type="submit" variant="contained">
                Entrar
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Si estás en local, usa la contraseña definida en <code>.env.local</code>.
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}
