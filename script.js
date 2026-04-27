// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== FADE-IN ON SCROLL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const isFloat = target % 1 !== 0;
  const duration = 1800;
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = target * ease;
    el.textContent = (isFloat ? current.toFixed(4) : Math.floor(current)) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObserver.observe(statsEl);

// ===== NEURAL NETWORK CANVAS =====
const canvas = document.getElementById('neuralCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let nodes = [], animFrame;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    initNodes();
  }

  function initNodes() {
    nodes = [];
    const count = Math.floor((canvas.width * canvas.height) / 14000);
    for (let i = 0; i < Math.min(count, 70); i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2.5 + 1
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // connections
    nodes.forEach((a, i) => {
      nodes.slice(i + 1).forEach(b => {
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.strokeStyle = `rgba(108,99,255,${(1 - dist / 140) * 0.25})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      });
    });
    // nodes
    nodes.forEach(n => {
      ctx.beginPath();
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 2);
      grad.addColorStop(0, 'rgba(108,99,255,0.9)');
      grad.addColorStop(1, 'rgba(0,212,255,0.1)');
      ctx.fillStyle = grad;
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
      // move
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });
    animFrame = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

// ===== TRAINING CHART =====
const trainingCanvas = document.getElementById('trainingChart');
if (trainingCanvas) {
  const ctx2 = trainingCanvas.getContext('2d');
  const trainAcc = [70.34,77.45,83.39,86.12,86.30,88.35,89.53,91.37,92.39,93.73,93.54,95.56,94.38,94.35,95.09,94.84,92.58,79.22];
  const valAcc   = [54.64,58.99,69.42,82.17,83.04,88.55,91.01,93.04,82.75,92.90,93.62,94.06,96.96,91.74,93.91,96.52,84.06,63.04];
  const labels   = trainAcc.map((_,i) => i+1);

  const W = trainingCanvas.width, H = trainingCanvas.height;
  const padL=44, padR=16, padT=16, padB=36;
  const cW = W - padL - padR, cH = H - padT - padB;
  const minY = 40, maxY = 100;

  function xPos(i) { return padL + (i / (labels.length - 1)) * cW; }
  function yPos(v) { return padT + cH - ((v - minY) / (maxY - minY)) * cH; }

  // grid
  ctx2.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx2.lineWidth = 1;
  for (let v = 50; v <= 100; v += 10) {
    const y = yPos(v);
    ctx2.beginPath(); ctx2.moveTo(padL, y); ctx2.lineTo(W - padR, y); ctx2.stroke();
    ctx2.fillStyle = 'rgba(136,153,170,0.7)';
    ctx2.font = '10px Inter';
    ctx2.textAlign = 'right';
    ctx2.fillText(v + '%', padL - 6, y + 3);
  }
  for (let i = 0; i < labels.length; i += 4) {
    const x = xPos(i);
    ctx2.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx2.beginPath(); ctx2.moveTo(x, padT); ctx2.lineTo(x, H - padB); ctx2.stroke();
    ctx2.fillStyle = 'rgba(136,153,170,0.7)';
    ctx2.textAlign = 'center';
    ctx2.fillText(labels[i], x, H - padB + 14);
  }

  function drawLine(data, color) {
    ctx2.strokeStyle = color;
    ctx2.lineWidth = 2.5;
    ctx2.lineJoin = 'round';
    ctx2.beginPath();
    data.forEach((v, i) => {
      i === 0 ? ctx2.moveTo(xPos(i), yPos(v)) : ctx2.lineTo(xPos(i), yPos(v));
    });
    ctx2.stroke();
    // dots
    data.forEach((v, i) => {
      ctx2.beginPath();
      ctx2.arc(xPos(i), yPos(v), 3.5, 0, Math.PI*2);
      ctx2.fillStyle = color;
      ctx2.fill();
    });
  }

  drawLine(trainAcc, '#6c63ff');
  drawLine(valAcc, '#00d4ff');

  // best epoch marker (13)
  const bx = xPos(12), by = yPos(valAcc[12]);
  ctx2.beginPath();
  ctx2.arc(bx, by, 7, 0, Math.PI*2);
  ctx2.strokeStyle = '#ffd700';
  ctx2.lineWidth = 2;
  ctx2.stroke();
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
