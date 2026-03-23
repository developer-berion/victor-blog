import { createTheme } from '@mui/material/styles';

export const adminTheme = createTheme({
  cssVariables: true,
  spacing: 8,
  palette: {
    mode: 'light',
    primary: {
      main: '#1f2937',
      dark: '#111827',
      light: '#374151',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2563eb',
    },
    success: {
      main: '#15803d',
    },
    info: {
      main: '#0369a1',
    },
    warning: {
      main: '#b45309',
    },
    error: {
      main: '#b91c1c',
    },
    background: {
      default: '#f5f3ef',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#4b5563',
    },
    divider: '#e5e7eb',
  },
  typography: {
    fontFamily: 'var(--font-body)',
    h1: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
      fontSize: '1.5rem',
    },
    h6: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.2,
      fontSize: '1.125rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.65,
    },
    body2: {
      fontSize: '0.9375rem',
      lineHeight: 1.6,
    },
    caption: {
      fontSize: '0.8125rem',
      lineHeight: 1.5,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.12em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f5f3ef',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          minHeight: 44,
          paddingLeft: 18,
          paddingRight: 18,
          transition: 'transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease',
        },
        containedPrimary: {
          backgroundColor: '#1f2937',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#111827',
            boxShadow: '0 10px 24px rgba(15, 23, 42, 0.14)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderColor: '#e5e7eb',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        variant: 'outlined',
        size: 'medium',
        margin: 'none',
      },
    },
    MuiFormControl: {
      defaultProps: {
        fullWidth: true,
        margin: 'none',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: '#ffffff',
          minHeight: 56,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d1d5db',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#9ca3af',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1f2937',
            borderWidth: 2,
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: '#b91c1c',
          },
        },
        input: {
          padding: '16.5px 16px',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#4b5563',
          fontWeight: 500,
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          marginTop: 8,
          color: '#6b7280',
          '&.Mui-error': {
            color: '#b91c1c',
          },
        },
      },
    },
    MuiChip: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiAlert: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          color: '#111827',
        },
        body: {
          borderBottomColor: '#e5e7eb',
        },
      },
    },
  },
});
