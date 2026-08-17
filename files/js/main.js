document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Logic
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.getElementById('theme-text');
  
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeIcon && themeText) {
      if (theme === 'dark') {
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light Mode';
      } else {
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Dark Mode';
      }
    }
  }

  // Trajectory Explorer Logic
  let currentDataset = 'ffhq';
  const datasets = ['ffhq', 'celeba', 'bedroom', 'church'];
  const steps = ['001', '010', '020', '030', '040', '050'];
  let currentStepIndex = 0;
  let autoPlayInterval = null;
  let isPlaying = true; // Auto-play enabled by default

  const tabBtns = document.querySelectorAll('.tab-btn');
  const stepSlider = document.getElementById('step-slider');
  const stepBadge = document.getElementById('step-badge');
  const imgOurs = document.getElementById('img-ours');
  const imgBaseline = document.getElementById('img-baseline');
  const captionOurs = document.getElementById('caption-ours');
  const captionBaseline = document.getElementById('caption-baseline');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const playIcon = document.getElementById('play-icon');
  const copyBtn = document.getElementById('copy-bibtex-btn');
  const toast = document.getElementById('toast-notification');

  // Preload all dataset images for instantaneous auto-slide
  function preloadImages() {
    datasets.forEach(ds => {
      steps.forEach(st => {
        const img1 = new Image();
        img1.src = `./files/assets/results/${ds}/ours/step_${st}.jpg`;
        const img2 = new Image();
        img2.src = `./files/assets/results/${ds}/baseline/step_${st}.jpg`;
      });
    });
  }
  preloadImages();

  function updateImages() {
    if (!imgOurs || !imgBaseline) return;
    const stepStr = steps[currentStepIndex];
    const stepNum = parseInt(stepStr, 10);
    
    imgOurs.src = `./files/assets/results/${currentDataset}/ours/step_${stepStr}.jpg`;
    imgBaseline.src = `./files/assets/results/${currentDataset}/baseline/step_${stepStr}.jpg`;
    
    if (stepSlider) {
      stepSlider.value = currentStepIndex;
    }

    if (stepNum === 1) {
      captionOurs.textContent = 'Step 1: Instantly yields a crisp, recognizable prototype structure on the manifold.';
      captionBaseline.textContent = 'Step 1: Pure random Gaussian noise (far from image manifold).';
    } else if (stepNum < 30) {
      captionOurs.textContent = `Step ${stepNum}: Smoothly diversifies while retaining recognizable semantic structure.`;
      captionBaseline.textContent = `Step ${stepNum}: Heavily corrupted noise with unrecognizable shapes.`;
    } else {
      captionOurs.textContent = `Step ${stepNum}: Fully diversified high-fidelity sample with complete details.`;
      captionBaseline.textContent = `Step ${stepNum}: Late-stage denoising producing final output sample.`;
    }

    if (stepBadge) {
      stepBadge.textContent = `Step ${stepNum} of 50`;
    }
  }

  // Auto-play interval step forward
  function stepForward() {
    currentStepIndex = (currentStepIndex + 1) % steps.length;
    updateImages();
  }

  function startAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(stepForward, 1400); // 1.4s per step
    isPlaying = true;
    if (playPauseBtn && playIcon) {
      playIcon.textContent = '⏸ Pause Auto-Slide';
      playPauseBtn.classList.add('playing');
    }
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
    isPlaying = false;
    if (playPauseBtn && playIcon) {
      playIcon.textContent = '▶ Auto-Slide Timesteps';
      playPauseBtn.classList.remove('playing');
    }
  }

  // Play/Pause Button Toggle
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      if (isPlaying) {
        stopAutoPlay();
      } else {
        startAutoPlay();
      }
    });
  }

  // Dataset Tab Click Event
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDataset = btn.dataset.category;
      updateImages();
    });
  });

  // Slider Manual Interaction
  if (stepSlider) {
    stepSlider.addEventListener('input', (e) => {
      currentStepIndex = parseInt(e.target.value, 10);
      updateImages();
    });
  }

  // Copy BibTeX
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const bibtexCode = document.getElementById('bibtex-code');
      if (bibtexCode) {
        navigator.clipboard.writeText(bibtexCode.innerText).then(() => {
          showToast('BibTeX copied to clipboard!');
        }).catch(err => {
          console.error('Failed to copy: ', err);
        });
      }
    });
  }

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // Initial Load & Start Auto-Slide
  updateImages();
  startAutoPlay();
});
