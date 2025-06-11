import { useEffect, useState } from 'react';
import "../styles/theme.css"

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <button onClick={toggleTheme} style={{
      backgroundColor: 'var(--button-bg)',
      color: 'var(--button-text)',
      borderRadius: '50px',
      padding: '0.2rem 0.5rem',
      fontWeight: 600,
      cursor: 'pointer'
    }}>
      {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
};

export default ThemeToggle;
