import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import {
  Box,
  Button,
  Chip,
  Container,
  Fade,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
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
              maxWidth: 420,
              mx: 'auto',
              p: { xs: 3.25, sm: 4 },
              borderRadius: 4,
              borderColor: 'divider',
              boxShadow: '0 18px 60px rgba(15, 23, 42, 0.10)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <Stack spacing={3.25}>
              <Stack spacing={1.5} alignItems="center" textAlign="center">
                <Chip label="Admin" color="primary" variant="outlined" sx={{ fontWeight: 600 }} />

                <Box>
                  <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.12em' }}>
                    Victor Garcia CMS
                  </Typography>
                  <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                      mt: 0.75,
                      fontSize: { xs: '1.6rem', sm: '1.8rem' },
                      lineHeight: 1.15,
                    }}
                  >
                    Acceder al panel
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, maxWidth: 320, mx: 'auto', lineHeight: 1.7 }}
                  >
                    Usa la contrasena administrativa para publicar y editar articulos con calma y sin ruido.
                  </Typography>
                </Box>
              </Stack>

              <Box
                component="form"
                action="/api/admin/login"
                method="post"
                sx={{ display: 'grid', gap: 2.25 }}
              >
                <FormControl
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  error={hasError}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      minHeight: 56,
                    },
                  }}
                >
                  <InputLabel htmlFor="password">Contrasena</InputLabel>
                  <OutlinedInput
                    id="password"
                    name="password"
                    type="password"
                    label="Contrasena"
                    autoFocus
                    autoComplete="current-password"
                    required
                  />
                  <FormHelperText>{helperText}</FormHelperText>
                </FormControl>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disableElevation
                  style={{
                    backgroundColor: '#1f2937',
                    color: '#ffffff',
                  }}
                  sx={{
                    py: 1.35,
                    mt: 0.5,
                    transition: 'transform 160ms ease, background-color 160ms ease, box-shadow 160ms ease',
                    '&:hover': {
                      backgroundColor: '#111827',
                      boxShadow: '0 10px 24px rgba(15, 23, 42, 0.14)',
                      transform: 'translateY(-1px)',
                    },
                  }}
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
