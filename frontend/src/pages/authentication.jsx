import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider, keyframes } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar } from '@mui/material';

// Define keyframes for animations
const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
`;

const glowPulse = keyframes`
  0% { box-shadow: 0 0 10px rgba(20, 184, 166, 0.5); }
  50% { box-shadow: 0 0 20px rgba(20, 184, 166, 0.8), 0 0 30px rgba(139, 92, 246, 0.4); }
  100% { box-shadow: 0 0 10px rgba(20, 184, 166, 0.5); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const emojiDrop = keyframes`
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 0.7; }
  100% { transform: translateY(100vh) rotate(360deg); opacity: 0.2; }
`;

const emojiTangent = keyframes`
  0% { transform: translateX(-100vw) rotate(0deg); opacity: 0.7; }
  100% { transform: translateX(100vw) rotate(360deg); opacity: 0.2; }
`;

const wave = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const defaultTheme = createTheme({
  typography: {
    fontFamily: '"Montserrat", sans-serif', // Professional, modern font
  },
  palette: {
    primary: {
      main: '#14B8A6', // Vibrant teal
    },
    secondary: {
      main: '#8B5CF6', // Vibrant violet
    },
    background: {
      default: '#0F172A', // Dark slate
    },
    text: {
      primary: '#E2E8F0', // Light slate
      secondary: '#94A3B8', // Muted slate
    },
  },
});

export default function Authentication() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [formState, setFormState] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  const handleAuth = async () => {
    try {
      if (formState === 0) {
        await handleLogin(username, password);
      }
      if (formState === 1) {
        const result = await handleRegister(name, username, password);
        setUsername('');
        setMessage(result);
        setOpen(true);
        setError('');
        setFormState(0);
        setPassword('');
        setName('');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'An error occurred';
      setError(message);
    }
  };

  // Array of call-related emojis
  const emojis = ['📞', '💬', '🎥', '📹'];

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(45deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
          backgroundSize: '200% 200%',
          animation: `${wave} 15s ease-in-out infinite`,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\'><circle cx=\'20\' cy=\'20\' r=\'12\' fill=\'none\' stroke=\'#14B8A6\' stroke-width=\'2\' stroke-dasharray=\'4 4\'><animateTransform attributeName=\'transform\' type=\'rotate\' from=\'0 20 20\' to=\'360 20 20\' dur=\'2s\' repeatCount=\'indefinite\'/></circle><circle cx=\'20\' cy=\'20\' r=\'6\' fill=\'#8B5CF6\'/></svg>"), auto', // Animated rotating ring cursor
          px: 2,
        }}
      >
        {/* Animated call emojis in background */}
        {[...Array(12)].map((_, i) => {
          const isDropping = Math.random() > 0.5; // Randomly choose dropping or tangential motion
          const emoji = emojis[Math.floor(Math.random() * emojis.length)];
          return (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                fontSize: '1.5rem',
                left: isDropping ? `${Math.random() * 100}%` : '-10%',
                top: isDropping ? '-10%' : `${Math.random() * 100}%`,
                animation: isDropping
                  ? `${emojiDrop} ${3 + Math.random() * 2}s linear infinite`
                  : `${emojiTangent} ${4 + Math.random() * 2}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
                color: i % 2 === 0 ? 'primary.main' : 'secondary.main',
                opacity: 0.5,
                textShadow: '0 0 10px rgba(20, 184, 166, 0.5)',
              }}
            >
              {emoji}
            </Box>
          );
        })}
        <Box
          sx={{
            width: '100%',
            maxWidth: 450,
            bgcolor: 'rgba(15, 23, 42, 0.95)',
            borderRadius: 3,
            border: '1px solid rgba(20, 184, 166, 0.2)',
            boxShadow: '0 8px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(20, 184, 166, 0.3)',
            p: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            animation: `${glowPulse} 3s infinite alternate, ${fadeIn} 1s ease-out`,
            transform: 'perspective(1000px) translateZ(0)',
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'perspective(1000px) translateZ(10px)',
            },
          }}
        >
          <Avatar
            sx={{
              bgcolor: 'secondary.main',
              mb: 3,
              width: 56,
              height: 56,
              animation: `${float} 4s infinite ease-in-out`,
              boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)',
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 32, color: '#0F172A' }} />
          </Avatar>
          <Typography
            variant="h4"
            sx={{
              color: 'text.primary',
              fontWeight: 700,
              mb: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              textShadow: '0 0 10px rgba(20, 184, 166, 0.5)',
            }}
          >
            {formState === 0 ? 'Join Meeting' : 'Create Account'}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mb: 4,
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <Button
              variant={formState === 0 ? 'contained' : 'outlined'}
              onClick={() => setFormState(0)}
              sx={{
                flex: 1,
                py: 1.5,
                textTransform: 'uppercase',
                fontWeight: 600,
                borderRadius: 2,
                borderColor: formState === 0 ? 'transparent' : 'secondary.main',
                bgcolor: formState === 0 ? 'primary.main' : 'transparent',
                color: formState === 0 ? '#0F172A' : 'text.secondary',
                boxShadow: formState === 0 ? '0 0 15px rgba(20, 184, 166, 0.5)' : 'none',
                '&:hover': {
                  bgcolor: formState === 0 ? '#0D9488' : 'rgba(139, 92, 246, 0.1)',
                  boxShadow: '0 0 20px rgba(20, 184, 166, 0.7)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(20, 184, 166, 0.3) 0%, transparent 70%)',
                  top: '-50%',
                  left: '-50%',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                },
                '&:hover:after': {
                  opacity: 1,
                },
              }}
            >
              Sign In
            </Button>
            <Button
              variant={formState === 1 ? 'contained' : 'outlined'}
              onClick={() => setFormState(1)}
              sx={{
                flex: 1,
                py: 1.5,
                textTransform: 'uppercase',
                fontWeight: 600,
                borderRadius: 2,
                borderColor: formState === 1 ? 'transparent' : 'secondary.main',
                bgcolor: formState === 1 ? 'primary.main' : 'transparent',
                color: formState === 1 ? '#0F172A' : 'text.secondary',
                boxShadow: formState === 1 ? '0 0 15px rgba(20, 184, 166, 0.5)' : 'none',
                '&:hover': {
                  bgcolor: formState === 1 ? '#0D9488' : 'rgba(139, 92, 246, 0.1)',
                  boxShadow: '0 0 20px rgba(20, 184, 166, 0.7)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(20, 184, 166, 0.3) 0%, transparent 70%)',
                  top: '-50%',
                  left: '-50%',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                },
                '&:hover:after': {
                  opacity: 1,
                },
              }}
            >
              Sign Up
            </Button>
          </Box>
          <Box component="form" sx={{ width: '100%' }}>
            {formState === 1 && (
              <TextField
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                value={name}
                autoFocus
                onChange={(e) => setName(e.target.value)}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: 'rgba(30, 41, 59, 0.5)',
                    color: 'text.primary',
                    '& fieldset': { borderColor: 'text.secondary' },
                    '&:hover fieldset': { borderColor: 'primary.main', boxShadow: '0 0 10px rgba(20, 184, 166, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main', boxShadow: '0 0 15px rgba(20, 184, 166, 0.7)' },
                  },
                  '& .MuiInputLabel-root': { color: 'text.secondary', fontWeight: 500 },
                  '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
                  transition: 'all 0.3s',
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #14B8A6, transparent)',
                    opacity: 0,
                    transition: 'opacity 0.3s',
                  },
                  '&:hover:after': {
                    opacity: 1,
                  },
                }}
              />
            )}
            <TextField
              fullWidth
              id="username"
              label="Username"
              name="username"
              value={username}
              autoFocus={formState === 0}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'rgba(30, 41, 59, 0.5)',
                  color: 'text.primary',
                  '& fieldset': { borderColor: 'text.secondary' },
                  '&:hover fieldset': { borderColor: 'primary.main', boxShadow: '0 0 10px rgba(20, 184, 166, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'primary.main', boxShadow: '0 0 15px rgba(20, 184, 166, 0.7)' },
                },
                '& .MuiInputLabel-root': { color: 'text.secondary', fontWeight: 500 },
                '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
                transition: 'all 0.3s',
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #14B8A6, transparent)',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                },
                '&:hover:after': {
                  opacity: 1,
                },
              }}
            />
            <TextField
              fullWidth
              id="password"
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'rgba(30, 41, 59, 0.5)',
                  color: 'text.primary',
                  '& fieldset': { borderColor: 'text.secondary' },
                  '&:hover fieldset': { borderColor: 'primary.main', boxShadow: '0 0 10px rgba(20, 184, 166, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'primary.main', boxShadow: '0 0 15px rgba(20, 184, 166, 0.7)' },
                },
                '& .MuiInputLabel-root': { color: 'text.secondary', fontWeight: 500 },
                '& .MuiInputLabel-root.Mui-focused': { color: 'primary.main' },
                transition: 'all 0.3s',
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #14B8A6, transparent)',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                },
                '&:hover:after': {
                  opacity: 1,
                },
              }}
            />
            {error && (
              <Typography
                sx={{
                  color: '#F43F5E',
                  mb: 3,
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  fontWeight: 500,
                  textShadow: '0 0 5px rgba(244, 63, 94, 0.5)',
                  animation: `${fadeIn} 0.5s ease-out`,
                }}
              >
                {error}
              </Typography>
            )}
            <Button
              fullWidth
              variant="contained"
              onClick={handleAuth}
              sx={{
                py: 1.5,
                textTransform: 'uppercase',
                fontWeight: 700,
                borderRadius: 2,
                bgcolor: 'primary.main',
                color: '#0F172A',
                boxShadow: '0 0 15px rgba(20, 184, 166, 0.5)',
                '&:hover': {
                  bgcolor: '#0D9488',
                  boxShadow: '0 0 25px rgba(20, 184, 166, 0.8)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
                animation: `${glowPulse} 2s infinite alternate`,
                position: 'relative',
                overflow: 'hidden',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(20, 184, 166, 0.3) 0%, transparent 70%)',
                  top: '-50%',
                  left: '-50%',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                },
                '&:hover:after': {
                  opacity: 1,
                },
              }}
            >
              {formState === 0 ? 'Join Meeting' : 'Create Account'}
            </Button>
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        message={message}
        sx={{
          '& .MuiSnackbarContent-root': {
            bgcolor: 'rgba(15, 23, 42, 0.95)',
            color: 'text.primary',
            borderRadius: 2,
            boxShadow: '0 0 15px rgba(20, 184, 166, 0.5)',
            fontWeight: 500,
          },
        }}
      />
    </ThemeProvider>
  );
}