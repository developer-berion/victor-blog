'use client';

import { useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import FormatBoldRoundedIcon from '@mui/icons-material/FormatBoldRounded';
import FormatItalicRoundedIcon from '@mui/icons-material/FormatItalicRounded';
import FormatUnderlinedRoundedIcon from '@mui/icons-material/FormatUnderlinedRounded';
import StrikethroughSRoundedIcon from '@mui/icons-material/StrikethroughSRounded';
import LooksTwoRoundedIcon from '@mui/icons-material/LooksTwoRounded';
import Looks3RoundedIcon from '@mui/icons-material/Looks3Rounded';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import FormatListNumberedRoundedIcon from '@mui/icons-material/FormatListNumberedRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import FormatClearRoundedIcon from '@mui/icons-material/FormatClearRounded';
import UndoRoundedIcon from '@mui/icons-material/UndoRounded';
import RedoRoundedIcon from '@mui/icons-material/RedoRounded';
import TextFieldsRoundedIcon from '@mui/icons-material/TextFieldsRounded';
import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  ToggleButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { normalizeRichContent } from '@/lib/markdown';

type RichTextEditorProps = {
  label: string;
  helperText?: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
};

type CaseMode = 'upper' | 'lower' | 'title';

function titleCase(value: string) {
  return value
    .toLocaleLowerCase('es')
    .split(/\s+/)
    .map((word) => {
      if (!word) return word;
      return `${word[0].toLocaleUpperCase('es')}${word.slice(1)}`;
    })
    .join(' ');
}

function transformSelectionText(input: string, mode: CaseMode) {
  if (mode === 'upper') {
    return input.toLocaleUpperCase('es');
  }

  if (mode === 'lower') {
    return input.toLocaleLowerCase('es');
  }

  return titleCase(input);
}

function ToolbarButton({
  title,
  active,
  onClick,
  children,
}: {
  title: string;
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Tooltip title={title} arrow>
      <span>
        <ToggleButton
          size="small"
          value={title}
          selected={Boolean(active)}
          onMouseDown={(event) => event.preventDefault()}
          onClick={onClick}
          sx={{
            minWidth: 38,
            height: 38,
            px: 1,
            borderRadius: 1.5,
          }}
        >
          {children}
        </ToggleButton>
      </span>
    </Tooltip>
  );
}

export default function RichTextEditor({
  label,
  helperText,
  name,
  value,
  onChange,
  placeholder,
  minHeight = 420,
}: RichTextEditorProps) {
  const initialContent = useMemo(() => normalizeRichContent(value), [value]);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Underline,
      Link.configure({
        autolink: true,
        linkOnPaste: true,
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? 'Escribe tu artículo con negrita, cursiva, títulos y enlaces.',
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose admin-prose rich-editor',
        spellcheck: 'true',
        autocapitalize: 'sentences',
        autocomplete: 'off',
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const normalized = normalizeRichContent(value);
    if (normalized && normalized !== editor.getHTML()) {
      editor.commands.setContent(normalized, { emitUpdate: false });
    }
  }, [editor, value]);

  function applyLink() {
    if (!editor) return;

    const currentLink = editor.getAttributes('link').href as string | undefined;
    const nextLink = window.prompt('Pega la URL del enlace', currentLink ?? 'https://');
    if (nextLink === null) return;

    const normalized = nextLink.trim();
    if (!normalized) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: normalized }).run();
  }

  function applyCaseMode(mode: CaseMode) {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    if (from === to) {
      return;
    }

    const selectedText = editor.state.doc.textBetween(from, to, '\n', '\n');
    if (!selectedText.trim()) {
      return;
    }

    const transformed = transformSelectionText(selectedText, mode);
    editor.chain().focus().deleteSelection().insertContent(transformed).run();
  }

  if (!editor) {
    return (
      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Cargando editor...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'grid', gap: 1.25 }}>
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        {label}
      </Typography>

      <PaperSurface>
        <input type="hidden" name={name} value={value} />

        <Stack
          spacing={1}
          sx={{
            p: 1.25,
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Stack direction="row" spacing={0.75} flexWrap="wrap" alignItems="center">
            <ToolbarButton title="Negrita" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
              <FormatBoldRoundedIcon fontSize="small" />
            </ToolbarButton>
            <ToolbarButton title="Cursiva" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
              <FormatItalicRoundedIcon fontSize="small" />
            </ToolbarButton>
            <ToolbarButton title="Subrayado" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
              <FormatUnderlinedRoundedIcon fontSize="small" />
            </ToolbarButton>
            <ToolbarButton title="Tachado" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
              <StrikethroughSRoundedIcon fontSize="small" />
            </ToolbarButton>
            <Divider flexItem orientation="vertical" sx={{ mx: 0.5 }} />
            <ToolbarButton title="Titulo nivel 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
              <LooksTwoRoundedIcon fontSize="small" />
            </ToolbarButton>
            <ToolbarButton title="Titulo nivel 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
              <Looks3RoundedIcon fontSize="small" />
            </ToolbarButton>
            <ToolbarButton title="Cita" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
              <FormatQuoteRoundedIcon fontSize="small" />
            </ToolbarButton>
            <ToolbarButton title="Lista" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
              <FormatListBulletedRoundedIcon fontSize="small" />
            </ToolbarButton>
            <ToolbarButton title="Lista numerada" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
              <FormatListNumberedRoundedIcon fontSize="small" />
            </ToolbarButton>
            <ToolbarButton title="Codigo" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>
              <CodeRoundedIcon fontSize="small" />
            </ToolbarButton>
            <ToolbarButton title="Enlace" active={editor.isActive('link')} onClick={applyLink}>
              <LinkRoundedIcon fontSize="small" />
            </ToolbarButton>
            <ToolbarButton title="Limpiar formato" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
              <FormatClearRoundedIcon fontSize="small" />
            </ToolbarButton>
            <Divider flexItem orientation="vertical" sx={{ mx: 0.5 }} />
            <ToolbarButton title="Deshacer" onClick={() => editor.chain().focus().undo().run()}>
              <UndoRoundedIcon fontSize="small" />
            </ToolbarButton>
            <ToolbarButton title="Rehacer" onClick={() => editor.chain().focus().redo().run()}>
              <RedoRoundedIcon fontSize="small" />
            </ToolbarButton>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
            <Chip
              size="small"
              icon={<TextFieldsRoundedIcon fontSize="small" />}
              label="Selecciona un fragmento para cambiar mayúsculas"
              variant="outlined"
            />
            <Button size="small" variant="outlined" onClick={() => applyCaseMode('upper')}>
              MAYÚSCULAS
            </Button>
            <Button size="small" variant="outlined" onClick={() => applyCaseMode('title')}>
              Título
            </Button>
            <Button size="small" variant="outlined" onClick={() => applyCaseMode('lower')}>
              minúsculas
            </Button>
          </Stack>
        </Stack>

        <Box
          sx={{
            '& .ProseMirror': {
              minHeight,
              px: { xs: 2, md: 3 },
              py: { xs: 2, md: 2.5 },
              outline: 'none',
            },
            '& .ProseMirror p.is-editor-empty:first-of-type::before': {
              color: 'text.disabled',
              content: 'attr(data-placeholder)',
              float: 'left',
              height: 0,
              pointerEvents: 'none',
            },
            '& .ProseMirror .ProseMirror-selectednode': {
              outline: '2px solid',
              outlineColor: 'primary.main',
            },
          }}
        >
          <EditorContent editor={editor} />
        </Box>
      </PaperSurface>

      {helperText ? (
        <Typography variant="caption" color="text.secondary">
          {helperText}
        </Typography>
      ) : null}
    </Box>
  );
}

function PaperSurface({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: 'background.paper',
      }}
    >
      {children}
    </Box>
  );
}
