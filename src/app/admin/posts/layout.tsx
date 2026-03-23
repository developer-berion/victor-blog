import type { ReactNode } from 'react';
import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';
import { requireAdmin } from '@/lib/admin';

export default async function AdminPostsLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  await requireAdmin();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography variant="overline" color="primary">
              Admin
            </Typography>
            <Typography variant="h4" component="h1" sx={{ mt: 0.5 }}>
              Panel de contenido
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 760, mt: 1 }}>
              Gestiona posts, categorías y estados de publicación desde Supabase.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button href="/admin/posts/new" variant="contained">
              Nuevo post
            </Button>
            <Box component="form" action="/api/admin/logout" method="post">
              <Button type="submit" variant="outlined" color="inherit">
                Cerrar sesión
              </Button>
            </Box>
          </Stack>
        </Stack>
      </Paper>

      {children}
    </Container>
  );
}
