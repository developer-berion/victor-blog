'use client';

import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useRouter } from 'next/navigation';
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CenterFocusWeakRoundedIcon from '@mui/icons-material/CenterFocusWeakRounded';
import CropFreeRoundedIcon from '@mui/icons-material/CropFreeRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Select,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import type { Category, Post } from '@/lib/supabase';
import { getAdminPostsPath } from '@/lib/admin-path';
import type { CoverImageEditor, SocialImageEditor } from '@/lib/social-sharing';
import { getPostBodyContent, getPostShareKit } from '@/lib/social-sharing';
import { normalizeMediaUrl } from '@/lib/media';
import { normalizeRichContent } from '@/lib/markdown';
import RichTextEditor from '@/components/editor/RichTextEditor';

type PostFormProps = {
  action: string;
  categories: Category[];
  authorId: string;
  siteUrl: string;
  shareCode: string;
  post?: Post | null;
  submitLabel: string;
};

function trimSlash(value: string) {
  return value.replace(/\/+$/, '');
}

function normalizeText(value: string) {
  return value.trim();
}

function normalizeEditableMediaUrl(value: string) {
  return normalizeMediaUrl(value) ?? '';
}

const SOCIAL_IMAGE_EDITOR_DEFAULT: SocialImageEditor = {
  format: 'instagram-4-5',
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
};

const SOCIAL_RECOMMENDED_WIDTH = 1080;
const SOCIAL_RECOMMENDED_HEIGHT = 1350;
const SOCIAL_ZOOM_MIN = 1;
const SOCIAL_ZOOM_MAX = 2.4;
const COVER_IMAGE_EDITOR_DEFAULT: CoverImageEditor = {
  format: 'article-16-9',
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
};

const COVER_RECOMMENDED_WIDTH = 1600;
const COVER_RECOMMENDED_HEIGHT = 900;

export default function PostForm({
  action,
  categories,
  authorId,
  siteUrl,
  shareCode,
  post,
  submitLabel,
}: PostFormProps) {
  const router = useRouter();
  const coverObjectUrlRef = useRef<string | null>(null);
  const socialObjectUrlRef = useRef<string | null>(null);
  const coverCropFrameRef = useRef<HTMLDivElement | null>(null);
  const coverDragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    baseOffsetX: number;
    baseOffsetY: number;
  } | null>(null);
  const socialCropFrameRef = useRef<HTMLDivElement | null>(null);
  const socialDragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    baseOffsetX: number;
    baseOffsetY: number;
  } | null>(null);
  const copyTimerRef = useRef<number | null>(null);
  const initialShareKit = getPostShareKit({
    share_code: post?.share_code ?? null,
    social_copy: post?.social_copy ?? null,
    social_copy_linkedin: post?.social_copy_linkedin ?? null,
    social_image_url: post?.social_image_url ?? null,
    social_image_editor: null,
    cover_image_editor: null,
    content: post?.content ?? '',
  });
  const initialCoverUrl = normalizeEditableMediaUrl(post?.cover_image_url ?? '');
  const initialSocialImageUrl = normalizeEditableMediaUrl(initialShareKit.social_image_url ?? '');
  const [title, setTitle] = useState(post?.title ?? '');
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  const [content, setContent] = useState(() =>
    normalizeRichContent(getPostBodyContent(post?.content ?? '')),
  );
  const [locale, setLocale] = useState<Post['locale']>(post?.locale ?? 'es');
  const [categoryId, setCategoryId] = useState(post?.category_id ?? categories[0]?.id ?? '');
  const [coverUrl, setCoverUrl] = useState(initialCoverUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [coverImageEditor, setCoverImageEditor] = useState<CoverImageEditor>(
    initialShareKit.cover_image_editor ?? COVER_IMAGE_EDITOR_DEFAULT,
  );
  const [coverEditorOpen, setCoverEditorOpen] = useState(false);
  const [socialCopy, setSocialCopy] = useState(initialShareKit.social_copy ?? '');
  const [socialCopyLinkedIn, setSocialCopyLinkedIn] = useState(
    initialShareKit.social_copy_linkedin ?? '',
  );
  const [socialImageUrl, setSocialImageUrl] = useState(initialSocialImageUrl);
  const [selectedSocialFile, setSelectedSocialFile] = useState<File | null>(null);
  const [socialImageEditor, setSocialImageEditor] = useState<SocialImageEditor>(
    initialShareKit.social_image_editor ?? SOCIAL_IMAGE_EDITOR_DEFAULT,
  );
  const [socialEditorOpen, setSocialEditorOpen] = useState(false);
  const [isPublished, setIsPublished] = useState(post?.published ?? false);
  const [previewSrc, setPreviewSrc] = useState(initialCoverUrl);
  const [socialPreviewSrc, setSocialPreviewSrc] = useState(initialSocialImageUrl);
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    return () => {
      if (coverObjectUrlRef.current) {
        URL.revokeObjectURL(coverObjectUrlRef.current);
      }
      if (socialObjectUrlRef.current) {
        URL.revokeObjectURL(socialObjectUrlRef.current);
      }
      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  function handleCoverUrlChange(value: string) {
    const normalized = normalizeEditableMediaUrl(value);
    setCoverUrl(normalized);
    if (!selectedFile) {
      setPreviewSrc(normalized);
    }
    if (normalized) {
      setCoverEditorOpen(true);
    }
  }

  function handleFileChange(file: File | null) {
    setSelectedFile(file);

    if (coverObjectUrlRef.current) {
      URL.revokeObjectURL(coverObjectUrlRef.current);
      coverObjectUrlRef.current = null;
    }

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      coverObjectUrlRef.current = objectUrl;
      setPreviewSrc(objectUrl);
      setCoverEditorOpen(true);
      return;
    }

    setPreviewSrc(coverUrl.trim());
  }

  function clampCoverOffset(value: number) {
    return Math.max(-28, Math.min(28, value));
  }

  function resetCoverImageEditor() {
    setCoverImageEditor(COVER_IMAGE_EDITOR_DEFAULT);
  }

  function handleCoverEditorPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!previewSrc) {
      return;
    }

    coverDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      baseOffsetX: coverImageEditor.offsetX,
      baseOffsetY: coverImageEditor.offsetY,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleCoverEditorPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!coverDragRef.current || coverDragRef.current.pointerId !== event.pointerId) {
      return;
    }

    const frame = coverCropFrameRef.current;
    if (!frame) {
      return;
    }

    const rect = frame.getBoundingClientRect();
    const drag = coverDragRef.current;
    const deltaX = ((event.clientX - drag.startX) / Math.max(rect.width, 1)) * 100;
    const deltaY = ((event.clientY - drag.startY) / Math.max(rect.height, 1)) * 100;

    setCoverImageEditor((current) => ({
      ...current,
      offsetX: clampCoverOffset(drag.baseOffsetX + deltaX),
      offsetY: clampCoverOffset(drag.baseOffsetY + deltaY),
    }));
  }

  function handleCoverEditorPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (coverDragRef.current?.pointerId === event.pointerId) {
      coverDragRef.current = null;
    }
  }

  function handleSocialImageUrlChange(value: string) {
    const normalized = normalizeEditableMediaUrl(value);
    setSocialImageUrl(normalized);
    if (!selectedSocialFile) {
      setSocialPreviewSrc(normalized || coverUrl.trim());
    }
    if (normalized) {
      setSocialEditorOpen(true);
    }
  }

  function clampSocialOffset(value: number) {
    return Math.max(-35, Math.min(35, value));
  }

  function resetSocialImageEditor() {
    setSocialImageEditor(SOCIAL_IMAGE_EDITOR_DEFAULT);
  }

  function handleSocialEditorPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!socialImagePreview) {
      return;
    }

    socialDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      baseOffsetX: socialImageEditor.offsetX,
      baseOffsetY: socialImageEditor.offsetY,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleSocialEditorPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!socialDragRef.current || socialDragRef.current.pointerId !== event.pointerId) {
      return;
    }

    const frame = socialCropFrameRef.current;
    if (!frame) {
      return;
    }

    const rect = frame.getBoundingClientRect();
    const drag = socialDragRef.current;
    const deltaX = ((event.clientX - drag.startX) / Math.max(rect.width, 1)) * 100;
    const deltaY = ((event.clientY - drag.startY) / Math.max(rect.height, 1)) * 100;

    setSocialImageEditor((current) => ({
      ...current,
      offsetX: clampSocialOffset(drag.baseOffsetX + deltaX),
      offsetY: clampSocialOffset(drag.baseOffsetY + deltaY),
    }));
  }

  function handleSocialEditorPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (socialDragRef.current?.pointerId === event.pointerId) {
      socialDragRef.current = null;
    }
  }

  function handleSocialFileChange(file: File | null) {
    setSelectedSocialFile(file);

    if (socialObjectUrlRef.current) {
      URL.revokeObjectURL(socialObjectUrlRef.current);
      socialObjectUrlRef.current = null;
    }

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      socialObjectUrlRef.current = objectUrl;
      setSocialPreviewSrc(objectUrl);
      setSocialEditorOpen(true);
      return;
    }

    setSocialPreviewSrc(socialImageUrl.trim() || coverUrl.trim());
  }

  async function copyShortlink() {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopyState('copied');
      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => setCopyState('idle'), 1500);
    } catch {
      setCopyState('idle');
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    setIsSaving(true);

    try {
      const response = await fetch(action, {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
      });

      const contentType = response.headers.get('content-type') ?? '';
      const payload = contentType.includes('application/json')
        ? await response.json().catch(() => null)
        : null;

      if (!response.ok) {
        throw new Error(payload?.error ? `Failed to save post: ${payload.error}` : `Failed to save post: ${response.status}`);
      }

      const redirectTo = typeof payload?.redirectTo === 'string' ? payload.redirectTo : null;
      if (redirectTo) {
        window.location.assign(redirectTo);
        return;
      }

      router.replace(`${getAdminPostsPath()}?saved=1`);
      router.refresh();
    } catch (error) {
      console.error('Post save submit failed:', error);
      router.replace(`${getAdminPostsPath()}?error=save_failed`);
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  const tagsValue = post?.tags?.join(', ') ?? '';
  const normalizedSiteUrl = trimSlash(siteUrl);
  const shareLink = `${normalizedSiteUrl}/s/${shareCode}`;
  const cancelLabel = post?.id ? 'Cancelar cambios' : 'Cancelar';
  const socialImagePreview = normalizeText(socialPreviewSrc) || normalizeText(coverUrl);
  const adminPostsPath = getAdminPostsPath();

  return (
    <Box
      component="form"
      method="post"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
      sx={{ display: 'grid', gap: 3, pb: { xs: 12, md: 14 } }}
    >
      {post?.id ? <input type="hidden" name="id" value={post.id} /> : null}
      <input type="hidden" name="author_id" value={authorId} />
      <input type="hidden" name="published" value={isPublished ? 'on' : ''} />
      <input type="hidden" name="share_code" value={shareCode} />
      <input type="hidden" name="cover_image_editor" value={JSON.stringify(coverImageEditor)} />
      <input type="hidden" name="social_image_editor" value={JSON.stringify(socialImageEditor)} />

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          width: '100%',
        }}
      >
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
          <Stack spacing={3} divider={<Divider flexItem />} sx={{ minWidth: 0 }}>
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Informacion general
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Titulo"
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
                    <InputLabel id="category-label">Categoria</InputLabel>
                    <Select
                      labelId="category-label"
                      label="Categoria"
                      name="category_id"
                      value={categoryId}
                      onChange={(event) => setCategoryId(event.target.value)}
                      required
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {locale === 'en' ? category.name_en : category.name_es}
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
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
                  <Button
                    type="button"
                    variant="outlined"
                    startIcon={<CropFreeRoundedIcon />}
                    onClick={() => setCoverEditorOpen(true)}
                  >
                    Editar portada
                  </Button>
                </Stack>
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
                  <RichTextEditor
                    label="Contenido del artículo"
                    name="content"
                    value={content}
                    onChange={setContent}
                    placeholder="Escribe el artículo aquí con formato real: títulos, negrita, cursiva, listas y enlaces."
                    helperText="El contenido se guarda como HTML semántico y se renderiza con SEO. Selecciona un fragmento para cambiar mayúsculas."
                  />
                  <TextField
                    label="Tags separados por coma"
                    name="tags"
                    defaultValue={tagsValue}
                  placeholder="IA, LATAM, Opinion"
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

            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Share kit
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Shortlink"
                  value={shareLink}
                  InputProps={{ readOnly: true }}
                  helperText="Este enlace se usara en X, Facebook y LinkedIn."
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <Button
                    type="button"
                    variant="outlined"
                    startIcon={<ContentCopyRoundedIcon />}
                    onClick={copyShortlink}
                  >
                    {copyState === 'copied' ? 'Copiado' : 'Copiar shortlink'}
                  </Button>
                  <Button
                    type="button"
                    variant="text"
                    href={shareLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Abrir enlace
                  </Button>
                </Stack>
                <TextField
                  label="Copy corto para X y Facebook"
                  name="social_copy"
                  value={socialCopy}
                  onChange={(event) => setSocialCopy(event.target.value)}
                  multiline
                  minRows={4}
                  placeholder="Hook corto, claro y con punch."
                  helperText="Si se deja vacio, el front usara el extracto."
                />
                <TextField
                  label="Copy largo para LinkedIn"
                  name="social_copy_linkedin"
                  value={socialCopyLinkedIn}
                  onChange={(event) => setSocialCopyLinkedIn(event.target.value)}
                  multiline
                  minRows={6}
                  placeholder="Un texto mas contextual para LinkedIn."
                  helperText="Si se deja vacio, cae al copy corto o al extracto."
                />
                <TextField
                  label="Social image URL"
                  name="social_image_url"
                  value={socialImageUrl}
                  onChange={(event) => handleSocialImageUrlChange(event.target.value)}
                  placeholder="https://..."
                  helperText={`Recomendado: ${SOCIAL_RECOMMENDED_WIDTH} x ${SOCIAL_RECOMMENDED_HEIGHT} px. Si esta vacio, se usara la portada.`}
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="flex-start">
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<AddPhotoAlternateRoundedIcon />}
                    >
                      Subir imagen social
                      <input
                        hidden
                        name="social_image_file"
                      type="file"
                      accept="image/*"
                        onChange={(event) => handleSocialFileChange(event.target.files?.[0] ?? null)}
                      />
                    </Button>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {selectedSocialFile
                    ? `Imagen social seleccionada: ${selectedSocialFile.name}.`
                    : 'La imagen social es opcional y puede reutilizar la portada.'}
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
                  <Button
                    type="button"
                    variant="outlined"
                    startIcon={<CropFreeRoundedIcon />}
                    onClick={() => setSocialEditorOpen(true)}
                  >
                    Editar imagen
                  </Button>
                  <Typography variant="caption" color="text.secondary">
                    Se abre automáticamente al cargar una imagen.
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Paper>

      </Box>

      <Paper
        variant="outlined"
        sx={{
          position: 'fixed',
          left: '50%',
          bottom: { xs: 12, md: 18 },
          transform: 'translateX(-50%)',
          width: 'min(100% - 24px, 760px)',
          px: { xs: 2, md: 2.5 },
          py: { xs: 1.5, md: 1.75 },
          borderRadius: 999,
          bgcolor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 20px 40px rgba(0, 23, 31, 0.16)',
          zIndex: 1200,
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.25}
          justifyContent="center"
          alignItems="center"
          sx={{ width: '100%' }}
        >
          <Button
            type="submit"
            variant="contained"
            sx={{ minWidth: { sm: 200 } }}
            disabled={isSaving}
          >
            {isSaving ? 'Guardando...' : submitLabel}
          </Button>
          <Button
            href={adminPostsPath}
            variant="outlined"
            color="inherit"
            sx={{ minWidth: { sm: 200 } }}
            disabled={isSaving}
          >
            {cancelLabel}
          </Button>
        </Stack>
      </Paper>

      <Dialog
        open={coverEditorOpen}
        onClose={() => setCoverEditorOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 4,
            width: '100%',
            maxHeight: 'calc(100vh - 32px)',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Editor portada editorial
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {COVER_RECOMMENDED_WIDTH} x {COVER_RECOMMENDED_HEIGHT} px, formato 16:9.
            </Typography>
          </Box>
          <IconButton aria-label="Cerrar editor" onClick={() => setCoverEditorOpen(false)}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                ref={coverCropFrameRef}
                onPointerDown={handleCoverEditorPointerDown}
                onPointerMove={handleCoverEditorPointerMove}
                onPointerUp={handleCoverEditorPointerUp}
                onPointerCancel={handleCoverEditorPointerUp}
                sx={{
                  position: 'relative',
                  width: 'min(100%, 560px)',
                  aspectRatio: '16 / 9',
                  overflow: 'hidden',
                  borderRadius: 3,
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'grey.100',
                  cursor: previewSrc ? 'grab' : 'default',
                  touchAction: 'none',
                  userSelect: 'none',
                }}
              >
                {previewSrc ? (
                  <Box
                    component="img"
                    src={previewSrc}
                    alt="Editor de portada"
                    draggable={false}
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: `translate(${coverImageEditor.offsetX}%, ${coverImageEditor.offsetY}%) scale(${coverImageEditor.zoom})`,
                      transformOrigin: 'center center',
                      transition: 'transform 120ms ease',
                      pointerEvents: 'none',
                    }}
                  />
                ) : (
                  <Stack
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                    sx={{ width: '100%', height: '100%', color: 'text.secondary', px: 2 }}
                  >
                    <ImageOutlinedIcon />
                    <Typography variant="body2" align="center">
                      Sube una portada para abrir el editor.
                    </Typography>
                  </Stack>
                )}

                <Box
                  sx={{
                    position: 'absolute',
                    inset: '12% 8%',
                    borderRadius: 2,
                    border: '2px dashed rgba(255,255,255,0.85)',
                    boxShadow: 'inset 0 0 0 9999px rgba(0,0,0,0.12)',
                    pointerEvents: 'none',
                  }}
                />

                <Stack
                  spacing={0.25}
                  sx={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    px: 1,
                    py: 0.5,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.88)',
                    color: 'text.primary',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.3 }}>
                    Zona segura editorial
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {COVER_RECOMMENDED_WIDTH} x {COVER_RECOMMENDED_HEIGHT}px
                  </Typography>
                </Stack>

                <Stack
                  spacing={0.25}
                  sx={{
                    position: 'absolute',
                    bottom: 12,
                    right: 12,
                    px: 1,
                    py: 0.5,
                    borderRadius: 2,
                    bgcolor: 'rgba(0, 23, 31, 0.7)',
                    color: '#fff',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    Arrastra para mover
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Ajusta zoom y centra abajo
                  </Typography>
                </Stack>
              </Box>
            </Box>

            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Zoom
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {Math.round(coverImageEditor.zoom * 100)}%
                </Typography>
              </Stack>
              <Slider
                size="small"
                min={SOCIAL_ZOOM_MIN}
                max={SOCIAL_ZOOM_MAX}
                step={0.05}
                value={coverImageEditor.zoom}
                onChange={(_, value) =>
                  setCoverImageEditor((current) => ({
                    ...current,
                    zoom: Array.isArray(value) ? value[0] : value,
                  }))
                }
              />
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Button
                type="button"
                variant="outlined"
                startIcon={<CenterFocusWeakRoundedIcon />}
                onClick={() =>
                  setCoverImageEditor((current) => ({
                    ...current,
                    offsetX: 0,
                    offsetY: 0,
                  }))
                }
              >
                Centrar imagen
              </Button>
              <Button
                type="button"
                variant="text"
                startIcon={<RestartAltRoundedIcon />}
                onClick={resetCoverImageEditor}
              >
                Reiniciar zoom
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setCoverEditorOpen(false)} variant="contained">
            Listo
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={socialEditorOpen}
        onClose={() => setSocialEditorOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 4,
            width: '100%',
            maxHeight: 'calc(100vh - 32px)',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Editor Instagram
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {SOCIAL_RECOMMENDED_WIDTH} x {SOCIAL_RECOMMENDED_HEIGHT} px, formato 4:5.
            </Typography>
          </Box>
          <IconButton aria-label="Cerrar editor" onClick={() => setSocialEditorOpen(false)}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                ref={socialCropFrameRef}
                onPointerDown={handleSocialEditorPointerDown}
                onPointerMove={handleSocialEditorPointerMove}
                onPointerUp={handleSocialEditorPointerUp}
                onPointerCancel={handleSocialEditorPointerUp}
                sx={{
                  position: 'relative',
                  width: 'min(100%, 360px)',
                  aspectRatio: '4 / 5',
                  overflow: 'hidden',
                  borderRadius: 3,
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'grey.100',
                  cursor: socialImagePreview ? 'grab' : 'default',
                  touchAction: 'none',
                  userSelect: 'none',
                }}
              >
                {socialImagePreview ? (
                  <Box
                    component="img"
                    src={socialImagePreview}
                    alt="Editor de imagen social"
                    draggable={false}
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: `translate(${socialImageEditor.offsetX}%, ${socialImageEditor.offsetY}%) scale(${socialImageEditor.zoom})`,
                      transformOrigin: 'center center',
                      transition: 'transform 120ms ease',
                      pointerEvents: 'none',
                    }}
                  />
                ) : (
                  <Stack
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                    sx={{ width: '100%', height: '100%', color: 'text.secondary', px: 2 }}
                  >
                    <ImageOutlinedIcon />
                    <Typography variant="body2" align="center">
                      Sube una imagen para abrir el editor.
                    </Typography>
                  </Stack>
                )}

                <Box
                  sx={{
                    position: 'absolute',
                    inset: '10% 8%',
                    borderRadius: 2,
                    border: '2px dashed rgba(255,255,255,0.85)',
                    boxShadow: 'inset 0 0 0 9999px rgba(0,0,0,0.14)',
                    pointerEvents: 'none',
                  }}
                />

                <Stack
                  spacing={0.25}
                  sx={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    px: 1,
                    py: 0.5,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.88)',
                    color: 'text.primary',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.3 }}>
                    Zona segura Instagram
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {SOCIAL_RECOMMENDED_WIDTH} x {SOCIAL_RECOMMENDED_HEIGHT}px
                  </Typography>
                </Stack>

                <Stack
                  spacing={0.25}
                  sx={{
                    position: 'absolute',
                    bottom: 12,
                    right: 12,
                    px: 1,
                    py: 0.5,
                    borderRadius: 2,
                    bgcolor: 'rgba(0, 23, 31, 0.7)',
                    color: '#fff',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    Arrastra para mover
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Ajusta zoom y centra abajo
                  </Typography>
                </Stack>
              </Box>
            </Box>

            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Zoom
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {Math.round(socialImageEditor.zoom * 100)}%
                </Typography>
              </Stack>
              <Slider
                size="small"
                min={SOCIAL_ZOOM_MIN}
                max={SOCIAL_ZOOM_MAX}
                step={0.05}
                value={socialImageEditor.zoom}
                onChange={(_, value) =>
                  setSocialImageEditor((current) => ({
                    ...current,
                    zoom: Array.isArray(value) ? value[0] : value,
                  }))
                }
              />
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Button
                type="button"
                variant="outlined"
                startIcon={<CenterFocusWeakRoundedIcon />}
                onClick={() =>
                  setSocialImageEditor((current) => ({
                    ...current,
                    offsetX: 0,
                    offsetY: 0,
                  }))
                }
              >
                Centrar imagen
              </Button>
              <Button
                type="button"
                variant="text"
                startIcon={<RestartAltRoundedIcon />}
                onClick={resetSocialImageEditor}
              >
                Reiniciar zoom
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setSocialEditorOpen(false)} variant="contained">
            Listo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


