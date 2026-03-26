/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Semantic tokens — same class name, color changes with .dark on <html>
        'c-base':       'var(--c-base)',
        'c-surface':    'var(--c-surface)',
        'c-elevated':   'var(--c-elevated)',
        'c-card':       'var(--c-card)',
        'c-hover':      'var(--c-hover)',
        'c-border':     'var(--c-border)',
        'c-border-sub': 'var(--c-border-sub)',
        'c-border-act': 'var(--c-border-act)',
        'c-accent':     'var(--c-accent)',
        'c-accent-hi':  'var(--c-accent-hi)',
        'c-accent-dim': 'var(--c-accent-dim)',
        'c-text':       'var(--c-text)',
        'c-text-2':     'var(--c-text-2)',
        'c-text-3':     'var(--c-text-3)',
        'c-ai-bg':      'var(--c-ai-bg)',
        'c-code-bg':    'var(--c-code-bg)',
        'c-code-txt':   'var(--c-code-txt)',
      },
      boxShadow: {
        'glow':       '0 0 30px var(--c-accent-glow)',
        'glow-ring':  '0 0 0 3px var(--c-accent-dim)',
        'card':       '0 4px 24px rgba(0,0,0,0.25)',
        'user-msg':   '0 4px 20px rgba(109,40,217,0.30)',
        'send':       '0 4px 16px rgba(109,40,217,0.40)',
        'send-hover': '0 6px 20px rgba(109,40,217,0.55)',
        'avatar':     '0 0 12px var(--c-accent-glow)',
      },
      animation: {
        'typing':       'typing 1.2s ease-in-out infinite',
        'blink':        'blink 0.8s step-end infinite',
        'msg-in':       'msg-in 0.3s cubic-bezier(0.16,1,0.3,1) both',
        'slide-down':   'slide-down 0.2s ease both',
        'logo-pulse':   'logo-pulse 3s ease-in-out infinite',
        'pulse-green':  'pulse-green 2s ease-in-out infinite',
        'spin-btn':     'spin 0.8s linear infinite',
      },
      keyframes: {
        typing: {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '30%':            { transform: 'translateY(-6px)', opacity: '1' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        'msg-in': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'logo-pulse': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%':      { opacity: '1',   transform: 'scale(1.08)' },
        },
        'pulse-green': {
          '0%, 100%': { boxShadow: '0 0 6px #22c55e' },
          '50%':      { boxShadow: '0 0 14px #22c55e' },
        },
      },
    },
  },
  plugins: [],
}
