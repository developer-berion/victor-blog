import { createTheme } from '@mui/material/styles';

export const adminTheme = createTheme({
  cssVariables: true,
  spacing: 8,
  palette: {
    mode: 'light',
    primary: {
      main: '#003459',
      dark: '#00171f',
      light: '#007ea7',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#007ea7',
      light: '#00a8e8',
      dark: '#006181',
      contrastText: '#ffffff',
    },
    info: {
      main: '#00a8e8',
    },
    success: {
      main: '#0f8b6a',
    },
    warning: {
      main: '#b86f08',
    },
    error: {
      main: '#c43c3c',
    },
    background: {
      default: '#f6fbfe',
      paper: '#ffffff',
    },
    text: {
      primary: '#00171f',
      secondary: '#35515e',
    },
    divider: '#d6e2ea',
  },
  typography: {
    fontFamily: 'var(--font-body)',
    h1: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    h3: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    h4: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      letterSpacing: '-0.03em',
      fontSize: '1.625rem',
    },
    h5: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
      fontSize: '1.2rem',
    },
    h6: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.2,
      fontSize: '0.95rem',
    },
    body1: {
      fontSize: '0.9rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.825rem',
      lineHeight: 1.55,
    },
    caption: {
      fontSize: '0.72rem',
      lineHeight: 1.45,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 700,
      letterSpacing: '0.12em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f6fbfe',
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
          backgroundColor: '#003459',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#00263f',
            boxShadow: '0 12px 28px rgba(0, 52, 89, 0.18)',
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
          borderColor: '#d6e2ea',
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
          minHeight: 52,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#c6d7df',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#8fb2c2',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00a8e8',
            borderWidth: 2,
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: '#c43c3c',
          },
        },
        input: {
          padding: '14px 14px',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#35515e',
          fontWeight: 500,
          fontSize: '0.8rem',
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          marginTop: 8,
          color: '#6b8794',
          '&.Mui-error': {
            color: '#c43c3c',
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
          color: '#00171f',
        },
        body: {
          borderBottomColor: '#d6e2ea',
        },
      },
    },
  },
});
