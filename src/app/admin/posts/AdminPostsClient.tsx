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
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
} from '@mui/material';
import type { Post } from '@/lib/supabase';
import AdminFeedback from '../AdminFeedback';
import type { AdminFeedbackState } from '../feedback';
import { deleteAdminPostAction } from './actions';
import { getAdminEditPostPath } from '@/lib/admin-path';

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

      <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'hidden' }}>
        <Table
          size="small"
          aria-label="Lista de posts"
          sx={{
            tableLayout: 'fixed',
            width: '100%',
            '& .MuiTableCell-root': {
              px: { xs: 1.25, md: 1.5 },
              py: { xs: 1.05, md: 1.25 },
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 112 }}>Estado</TableCell>
              <TableCell sx={{ width: '40%' }}>Título</TableCell>
              <TableCell sx={{ width: '18%' }}>Categoría</TableCell>
              <TableCell sx={{ width: 92 }}>Idioma</TableCell>
              <TableCell sx={{ width: 132 }}>Actualizado</TableCell>
              <TableCell align="right" sx={{ width: 176 }}>
                Acciones
              </TableCell>
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
                <TableCell sx={{ minWidth: 0 }}>
                  <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" noWrap title={post.title}>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap title={post.excerpt}>
                      {post.excerpt}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    noWrap
                    title={post.categories?.name_es ?? 'Sin categoría'}
                  >
                    {post.categories?.name_es ?? 'Sin categoría'}
                  </Typography>
                </TableCell>
                <TableCell>{post.locale.toUpperCase()}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {new Date(post.updated_at).toLocaleDateString('es-ES')}
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
                    <Tooltip title="Ver post">
                      <IconButton
                        component="a"
                        href={`/blog/${post.slug}`}
                        size="small"
                        aria-label={`Ver ${post.title}`}
                      >
                        <VisibilityRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar post">
                      <IconButton
                        component="a"
                        href={getAdminEditPostPath(post.id)}
                        size="small"
                        aria-label={`Editar ${post.title}`}
                      >
                        <EditRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Borrar post">
                      <IconButton
                        size="small"
                        color="error"
                        aria-label={`Borrar ${post.title}`}
                        onClick={() => setTargetPost(post)}
                      >
                        <DeleteOutlineRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
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
