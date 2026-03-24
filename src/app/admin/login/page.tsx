import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import {
  Box,
  Button,
  Chip,
  Container,
  Fade,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { getAdminPostsPath } from '@/lib/admin-path';
import { getAdminSession } from '@/lib/admin';

export const metadata: Metadata = {
  title: 'Acceso privado',
  description: 'Acceso discreto al panel privado del blog.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-snippet': -1,
      'max-image-preview': 'none',
      'max-video-preview': -1,
    },
  },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  if (await getAdminSession()) {
    redirect(getAdminPostsPath());
  }

  const hasError = searchParams?.error === '1';
  const helperText = hasError
    ? 'La contrasena no coincide. Vuelve a intentar.'
    : 'Clave de acceso del panel administrativo.';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        py: { xs: 4, md: 6 },
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#f6f5f2',
        backgroundImage:
          'radial-gradient(circle at top, rgba(37, 99, 235, 0.10), transparent 30%), radial-gradient(circle at center, rgba(15, 23, 42, 0.05), transparent 58%)',
      }}
    >
      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in timeout={420}>
          <Paper
            variant="outlined"
            sx={{
              width: '100%',
              maxWidth: 400,
              mx: 'auto',
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              borderColor: 'divider',
              boxShadow: '0 18px 60px rgba(15, 23, 42, 0.10)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <Stack spacing={3} alignItems="stretch">
              <Stack spacing={1.25} alignItems="center" textAlign="center">
                <Chip label="Privado" color="primary" variant="outlined" sx={{ fontWeight: 600 }} />

                <Box>
                  <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.12em' }}>
                    Victor Garcia Studio
                  </Typography>
                  <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                      mt: 0.75,
                      fontSize: { xs: '1.75rem', sm: '2rem' },
                      lineHeight: 1.12,
                      maxWidth: 280,
                      mx: 'auto',
                    }}
                  >
                    Acceso al CMS
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, maxWidth: 300, mx: 'auto', lineHeight: 1.7 }}
                  >
                    Usa la contrasena privada para publicar y editar articulos con calma y sin ruido.
                  </Typography>
                </Box>
              </Stack>

              <Box component="form" action="/api/admin/login" method="post" sx={{ display: 'grid', gap: 2 }}>
                <TextField
                  id="password"
                  name="password"
                  label="Contrasena"
                  type="password"
                  autoFocus
                  autoComplete="current-password"
                  required
                  error={hasError}
                  helperText={helperText}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                >
                  Entrar
                </Button>
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6, textAlign: 'center' }}>
                Si estas en local, usa la contrasena definida en <code>.env.local</code>. Si estas en Vercel, revisa las variables de entorno del proyecto.
              </Typography>
            </Stack>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}
