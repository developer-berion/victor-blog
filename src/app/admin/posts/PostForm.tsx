'use client';

import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import type { Category, Post } from '@/lib/supabase';
import { renderMarkdown } from '@/lib/markdown';

type PostFormProps = {
  action: string;
  categories: Category[];
  authorId: string;
  post?: Post | null;
  submitLabel: string;
};

export default function PostForm({ action, categories, authorId, post, submitLabel }: PostFormProps) {
  const currentObjectUrlRef = useRef<string | null>(null);
  const [title, setTitle] = useState(post?.title ?? '');
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [locale, setLocale] = useState<Post['locale']>(post?.locale ?? 'es');
  const [categoryId, setCategoryId] = useState(post?.category_id ?? categories[0]?.id ?? '');
  const [coverUrl, setCoverUrl] = useState(post?.cover_image_url ?? '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPublished, setIsPublished] = useState(post?.published ?? false);
  const [previewSrc, setPreviewSrc] = useState(post?.cover_image_url ?? '');

  useEffect(() => {
    return () => {
      if (currentObjectUrlRef.current) {
        URL.revokeObjectURL(currentObjectUrlRef.current);
      }
    };
  }, []);

  function handleCoverUrlChange(value: string) {
    setCoverUrl(value);
    if (!selectedFile) {
      setPreviewSrc(value.trim());
    }
  }

  function handleFileChange(file: File | null) {
    setSelectedFile(file);

    if (currentObjectUrlRef.current) {
      URL.revokeObjectURL(currentObjectUrlRef.current);
      currentObjectUrlRef.current = null;
    }

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      currentObjectUrlRef.current = objectUrl;
      setPreviewSrc(objectUrl);
      return;
    }

    setPreviewSrc(coverUrl.trim());
  }

  const tagsValue = post?.tags?.join(', ') ?? '';
  const categoryLabel =
    categories.find((category) => category.id === categoryId)?.name_es ?? 'Sin categoría';
  const deferredContent = useDeferredValue(content);
  const renderedContent = useMemo(() => renderMarkdown(deferredContent), [deferredContent]);

  return (
    <Box
      component="form"
      action={action}
      method="post"
      encType="multipart/form-data"
      sx={{ display: 'grid', gap: 3 }}
    >
      {post?.id ? <input type="hidden" name="id" value={post.id} /> : null}
      <input type="hidden" name="author_id" value={authorId} />
      <input type="hidden" name="published" value={isPublished ? 'on' : ''} />

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 2fr) minmax(320px, 1fr)' },
          alignItems: 'start',
        }}
      >
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
          <Stack spacing={3} divider={<Divider flexItem />} sx={{ minWidth: 0 }}>
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Información general
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Título"
                  name="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                />
                <TextField
                  label="Slug"
                  name="slug"
                  defaultValue={post?.slug ?? ''}
                  placeholder="se-genera-si-lo-dejas-vacio"
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel id="locale-label">Idioma</InputLabel>
                    <Select
                      labelId="locale-label"
                      label="Idioma"
                      name="locale"
                      value={locale}
                      onChange={(event) => setLocale(event.target.value as Post['locale'])}
                    >
                      <MenuItem value="es">ES</MenuItem>
                      <MenuItem value="en">EN</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="category-label">Categoría</InputLabel>
                    <Select
                      labelId="category-label"
                      label="Categoría"
                      name="category_id"
                      value={categoryId}
                      onChange={(event) => setCategoryId(event.target.value)}
                      required
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name_es}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
                <TextField
                  label="Tiempo de lectura"
                  name="reading_time"
                  type="number"
                  defaultValue={post?.reading_time ?? ''}
                  placeholder="8"
                  inputProps={{ min: 1 }}
                />
              </Stack>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Portada
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Cover image URL"
                  name="cover_image_url"
                  value={coverUrl}
                  onChange={(event) => handleCoverUrlChange(event.target.value)}
                  placeholder="https://..."
                />
                <Button component="label" variant="outlined" startIcon={<AddPhotoAlternateRoundedIcon />}>
                  Subir portada
                  <input
                    hidden
                    name="cover_image_file"
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
                  />
                </Button>
                <Typography variant="caption" color="text.secondary">
                  Si subes un archivo, reemplaza la URL de portada.
                  {selectedFile ? ` Archivo seleccionado: ${selectedFile.name}.` : ''}
                </Typography>
              </Stack>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Contenido
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Extracto"
                  name="excerpt"
                  value={excerpt}
                  onChange={(event) => setExcerpt(event.target.value)}
                  multiline
                  minRows={4}
                  required
                />
                <TextField
                  label="Contenido Markdown"
                  name="content"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  multiline
                  minRows={18}
                  required
                />
                <TextField
                  label="Tags separados por coma"
                  name="tags"
                  defaultValue={tagsValue}
                  placeholder="IA, LATAM, Opinión"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={isPublished}
                      onChange={(event) => setIsPublished(event.target.checked)}
                    />
                  }
                  label="Publicado"
                />
              </Stack>
            </Box>
          </Stack>
        </Paper>

        <Stack spacing={2}>
          <Paper variant="outlined" sx={{ p: 2.5, position: 'sticky', top: 24 }}>
            <Stack spacing={2}>
              <Typography variant="h6">Vista previa</Typography>
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'grey.100',
                  aspectRatio: '16 / 9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {previewSrc ? (
                  <Box
                    component="img"
                    src={previewSrc}
                    alt={title || 'Vista previa de portada'}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <Stack spacing={1} alignItems="center" color="text.secondary">
                    <ImageOutlinedIcon />
                    <Typography variant="body2">Sin portada todavía</Typography>
                  </Stack>
                )}
              </Box>

              <Stack spacing={1}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {title || 'Título del post'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {excerpt || 'El extracto aparecerá aquí como resumen de lectura.'}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip
                  label={isPublished ? 'Publicado' : 'Borrador'}
                  color={isPublished ? 'success' : 'default'}
                />
                <Chip label={locale.toUpperCase()} variant="outlined" />
                <Chip label={categoryLabel} variant="outlined" />
              </Stack>

              <Alert severity="info" variant="outlined">
                El formulario prioriza el archivo subido sobre la URL escrita.
              </Alert>

              <Divider />

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Vista previa del contenido
                </Typography>
                <Box
                  className="prose"
                  sx={{
                    maxHeight: 420,
                    overflow: 'auto',
                    pr: 1,
                  }}
                  dangerouslySetInnerHTML={{
                    __html: renderedContent || '<p>Escribe el contenido para ver el render aquí.</p>',
                  }}
                />
              </Box>
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Button type="submit" variant="contained">
                {submitLabel}
              </Button>
              <Button href="/admin/posts" variant="outlined" color="inherit">
                Cancelar
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
}
