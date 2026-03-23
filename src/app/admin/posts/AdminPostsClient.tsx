'use client';

import { useState } from 'react';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { Post } from '@/lib/supabase';
import AdminFeedback from '../AdminFeedback';
import type { AdminFeedbackState } from '../feedback';
import { deleteAdminPostAction } from './actions';

type AdminPostsClientProps = {
  posts: Post[];
  feedback?: AdminFeedbackState | null;
};

export default function AdminPostsClient({ posts, feedback }: AdminPostsClientProps) {
  const [targetPost, setTargetPost] = useState<Post | null>(null);

  return (
    <Stack spacing={3}>
      {feedback ? <AdminFeedback message={feedback.message} severity={feedback.severity} /> : null}

      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Chip label="Posts" color="primary" variant="outlined" />
            <Typography variant="h4" sx={{ mt: 1 }}>
              Biblioteca editorial
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {posts.length} artículo{posts.length === 1 ? '' : 's'} en gestión.
            </Typography>
          </Box>

          {posts.length ? (
            <Alert severity="info" variant="outlined" sx={{ alignSelf: 'stretch' }}>
              Borrado con confirmación. Las portadas se guardan en Supabase Storage.
            </Alert>
          ) : null}
        </Stack>
      </Paper>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small" aria-label="Lista de posts">
          <TableHead>
            <TableRow>
              <TableCell>Estado</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Idioma</TableCell>
              <TableCell>Actualizado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id} hover>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Chip
                    label={post.published ? 'Publicado' : 'Borrador'}
                    color={post.published ? 'success' : 'default'}
                    variant={post.published ? 'filled' : 'outlined'}
                  />
                </TableCell>
                <TableCell>
                  <Stack spacing={0.5}>
                    <Typography variant="subtitle2">{post.title}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {post.excerpt}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>{post.categories?.name_es ?? 'Sin categoría'}</TableCell>
                <TableCell>{post.locale.toUpperCase()}</TableCell>
                <TableCell>{new Date(post.updated_at).toLocaleDateString('es-ES')}</TableCell>
                <TableCell align="right">
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    spacing={1}
                    flexWrap="wrap"
                  >
                    <Button
                      href={`/blog/${post.slug}`}
                      size="small"
                      variant="text"
                      startIcon={<VisibilityRoundedIcon fontSize="small" />}
                    >
                      Ver
                    </Button>
                    <Button
                      href={`/admin/posts/${post.id}/edit`}
                      size="small"
                      variant="outlined"
                      startIcon={<EditRoundedIcon fontSize="small" />}
                    >
                      Editar
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      startIcon={<DeleteOutlineRoundedIcon fontSize="small" />}
                      onClick={() => setTargetPost(post)}
                    >
                      Borrar
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {!posts.length ? (
        <Paper variant="outlined" sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            No hay posts todavía.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Empieza creando el primer artículo desde el botón “Nuevo post”.
          </Typography>
        </Paper>
      ) : null}

      <Dialog open={Boolean(targetPost)} onClose={() => setTargetPost(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirmar borrado</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Vas a borrar <strong>{targetPost?.title ?? 'este post'}</strong>. Esta acción elimina
            el post de forma permanente y no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <Box component="form" action={deleteAdminPostAction}>
          <input type="hidden" name="id" value={targetPost?.id ?? ''} />
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setTargetPost(null)} variant="outlined">
              Cancelar
            </Button>
            <Button type="submit" color="error" variant="contained">
              Borrar
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Stack>
  );
}
