// JavaScript Interactivity for Speed-Variation Distillation Project Page

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dark/Light Theme Switching
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  
  // System preference or stored theme
  const storedTheme = localStorage.getItem('svd-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const currentTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('svd-theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      themeIcon.className = 'fa fa-sun-o';
      themeIcon.setAttribute('aria-label', 'Switch to light mode');
    } else {
      themeIcon.className = 'fa fa-moon-o';
      themeIcon.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  // 2. Dataset Tab Switching (FFHQ, CelebA, Church, Bedroom)
  const tabBtns = document.querySelectorAll('.dataset-tabs .tab-btn');
  const datasetPanels = document.querySelectorAll('.dataset-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetDataset = btn.getAttribute('data-dataset');
      
      tabBtns.forEach(b => b.classList.remove('active'));
      datasetPanels.forEach(p => p.style.display = 'none');

      btn.classList.add('active');
      const activePanel = document.getElementById(`dataset-${targetDataset}`);
      if (activePanel) {
        activePanel.style.display = 'block';
      }
    });
  });

  // 3. Algorithm Switcher (Algorithm 1 vs Algorithm 2)
  const algoBtns = document.querySelectorAll('.algo-btn');
  const algoCodeBlocks = document.querySelectorAll('.algo-block');

  algoBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetAlgo = btn.getAttribute('data-algo');

      algoBtns.forEach(b => b.classList.remove('active'));
      algoCodeBlocks.forEach(c => c.style.display = 'none');

      btn.classList.add('active');
      const activeAlgo = document.getElementById(`algo-${targetAlgo}`);
      if (activeAlgo) {
        activeAlgo.style.display = 'block';
      }
    });
  });

  // 4. BibTeX Copy Functionality
  const copyBtn = document.getElementById('copy-bibtex-btn');
  const bibtexText = document.getElementById('bibtex-code');
  const toast = document.getElementById('toast-notification');

  if (copyBtn && bibtexText) {
    copyBtn.addEventListener('click', () => {
      const textToCopy = bibtexText.textContent;
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('BibTeX copied to clipboard!');
      }).catch(err => {
        console.error('Copy failed: ', err);
      });
    });
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }
});
