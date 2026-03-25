// ─── DATA LOADER ────────────────────────────────────────────────────────────

async function loadData() {
  try {
    const res = await fetch('./data.json');
    if (!res.ok) throw new Error('Failed to load data.json');
    return await res.json();
  } catch (e) {
    console.error('Portfolio data load error:', e);
    return null;
  }
}

// ─── HELPERS ────────────────────────────────────────────────────────────────

/** Inject HTML into a section, wrapped in a .container div */
function inject(id, html) {
  const section = document.getElementById(id);
  section.innerHTML = `<div class="container">${html}</div>`;
}

const icon = {
  github: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>`,
  external: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
  linkedin: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  twitter: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  mail: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  map: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
};

// ─── BUILDERS ───────────────────────────────────────────────────────────────

function buildNav(data) {
  const nav = document.getElementById('nav');
  const links = ['about', 'skills', 'experience', 'projects', 'contact'];

  const brand = document.createElement('a');
  brand.className = 'nav-brand';
  brand.href = '#';
  brand.innerHTML = `<span>${data.meta.name.split(' ')[0]}</span>`;

  const ul = document.createElement('ul');
  ul.className = 'nav-links';
  links.forEach(l => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = l;
    a.href = `#${l}`;
    li.appendChild(a);
    ul.appendChild(li);
  });

  const hamburger = document.createElement('button');
  hamburger.className = 'hamburger';
  hamburger.setAttribute('aria-label', 'Toggle menu');
  hamburger.innerHTML = `<span></span><span></span><span></span>`;
  hamburger.addEventListener('click', () => {
    ul.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
  ul.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    ul.classList.remove('open');
    hamburger.classList.remove('active');
  }));

  nav.appendChild(brand);
  nav.appendChild(ul);
  nav.appendChild(hamburger);

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

function buildHero(data) {
  const { meta } = data;
  const section = document.getElementById('hero');
  const statusDot = meta.available
    ? `<span class="status-dot"></span><span>Available for work</span>`
    : `<span>Currently unavailable</span>`;
  section.innerHTML = `
    <div class="hero-eyebrow">${statusDot}</div>
    <h1 class="hero-name">${meta.name}</h1>
    <p class="hero-title">${meta.title}</p>
    <p class="hero-tagline">${meta.tagline}</p>
    <div class="hero-actions">
      <a href="#projects" class="btn btn-primary">View my work</a>
      <a href="${meta.resume}" class="btn btn-ghost" target="_blank" rel="noopener">Download CV</a>
    </div>
    <div class="hero-scroll-hint">
      <span>scroll</span>
      <div class="scroll-line"></div>
    </div>
  `;
}

function buildAbout(data) {
  const { meta, about } = data;
  inject('about', `
    <div class="section-label">01 — About</div>
    <div class="about-grid">
      <div class="about-left">
        <h2 class="section-heading">${about.headline}</h2>
        ${about.paragraphs.map(p => `<p>${p}</p>`).join('')}
        <div class="about-meta">
          <span>${icon.map} ${meta.location}</span>
        </div>
      </div>
      <div class="about-right">
        <div class="avatar-wrapper">
          <img src="${meta.avatar}" alt="${meta.name}" class="avatar" loading="lazy" />
          <div class="avatar-bg"></div>
        </div>
      </div>
    </div>
  `);
}

function buildSkills(data) {
  inject('skills', `
    <div class="section-label">02 — Skills</div>
    <h2 class="section-heading">Tech I work with</h2>
    <div class="skills-grid">
      ${data.skills.map(group => `
        <div class="skill-group">
          <h3 class="skill-category">${group.category}</h3>
          <ul class="skill-list">
            ${group.items.map(item => `<li class="skill-tag">${item}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </div>
  `);
}

function buildExperience(data) {
  inject('experience', `
    <div class="section-label">03 — Experience</div>
    <h2 class="section-heading">Where I've worked</h2>
    <div class="timeline">
      ${data.experience.map((job, i) => `
        <div class="timeline-item" style="--delay:${i * 0.1}s">
          <div class="timeline-marker"></div>
          <div class="timeline-card">
            <div class="timeline-header">
              <div>
                <h3 class="job-role">${job.role}</h3>
                <span class="job-company">${job.company}</span>
              </div>
              <div class="timeline-meta">
                <span class="job-period">${job.period}</span>
                <span class="job-location">${icon.map} ${job.location}</span>
              </div>
            </div>
            <p class="job-desc">${job.description}</p>
            <div class="tag-row">
              ${job.tags.map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `);
}

function buildProjects(data) {
  const featured = data.projects.filter(p => p.featured);
  const others   = data.projects.filter(p => !p.featured);

  const othersHTML = others.length ? `
    <h3 class="other-projects-heading">Other projects</h3>
    <div class="projects-grid">
      ${others.map(p => `
        <div class="project-card other">
          <div class="project-header-row">
            <h4 class="project-title">${p.title}</h4>
            <div class="project-links">
              ${p.github ? `<a href="${p.github}" target="_blank" rel="noopener" title="GitHub">${icon.github}</a>` : ''}
              ${p.live   ? `<a href="${p.live}"   target="_blank" rel="noopener" title="Live">${icon.external}</a>` : ''}
            </div>
          </div>
          <p class="project-desc">${p.description}</p>
          <div class="tag-row">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        </div>
      `).join('')}
    </div>
  ` : '';

  inject('projects', `
    <div class="section-label">04 — Projects</div>
    <h2 class="section-heading">Things I've built</h2>
    <div class="projects-featured">
      ${featured.map((p, i) => `
        <div class="project-card featured" style="--delay:${i * 0.1}s">
          <div class="project-number">${String(i + 1).padStart(2, '0')}</div>
          <div class="project-content">
            <h3 class="project-title">${p.title}</h3>
            <p class="project-desc">${p.description}</p>
            <div class="tag-row">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
          </div>
          <div class="project-links">
            ${p.github ? `<a href="${p.github}" target="_blank" rel="noopener" title="GitHub">${icon.github}</a>` : ''}
            ${p.live   ? `<a href="${p.live}"   target="_blank" rel="noopener" title="Live">${icon.external}</a>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
    ${othersHTML}
  `);
}

function buildContact(data) {
  const { meta } = data;
  inject('contact', `
    <div class="section-label">05 — Contact</div>
    <h2 class="section-heading contact-heading">Let's work together.</h2>
    <p class="contact-sub">Got a project in mind? Let's talk. I'm always open to new opportunities and interesting conversations.</p>
    <a href="mailto:${meta.email}" class="btn btn-primary btn-large">${icon.mail} Say hello</a>
    <a href="tel:+918710009174" class="btn btn-ghost btn-large"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/></svg> +91 87100 09174</a>
    <div class="social-links">
      ${meta.github   ? `<a href="${meta.github}"   target="_blank" rel="noopener" aria-label="GitHub">${icon.github}</a>` : ''}
      ${meta.linkedin ? `<a href="${meta.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${icon.linkedin}</a>` : ''}
      ${meta.twitter  ? `<a href="${meta.twitter}"  target="_blank" rel="noopener" aria-label="Twitter / X">${icon.twitter}</a>` : ''}
    </div>
  `);
}

function buildFooter(data) {
  const footer = document.getElementById('footer');
  const year = new Date().getFullYear();
  footer.innerHTML = `<p>© ${year} ${data.meta.name} — Built with love</p>`;
}

// ─── ANIMATIONS ─────────────────────────────────────────────────────────────

function initAnimations() {
  const selector = [
    '.section-label', '.section-heading', '.about-grid', '.skills-grid',
    '.timeline-item', '.project-card', '.contact-heading',
    '.contact-sub', '.btn-large', '.social-links'
  ].join(',');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(selector).forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });
}

// ─── ACTIVE NAV ─────────────────────────────────────────────────────────────

function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s => observer.observe(s));
}

// ─── CURSOR GLOW ────────────────────────────────────────────────────────────

function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  let mx = 0, my = 0, gx = 0, gy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function tick() {
    gx += (mx - gx) * 0.06;
    gy += (my - gy) * 0.06;
    glow.style.transform = `translate(calc(${gx}px - 50%), calc(${gy}px - 50%))`;
    requestAnimationFrame(tick);
  })();
}

// ─── INIT ────────────────────────────────────────────────────────────────────

async function init() {
  const data = await loadData();
  if (!data) {
    document.body.innerHTML = '<p style="color:#e8a838;font-family:monospace;padding:2rem;">Failed to load data.json. Check the file and reload.</p>';
    document.body.style.opacity = '1';
    return;
  }

  document.title = `${data.meta.name} — ${data.meta.title}`;
  buildNav(data);
  buildHero(data);
  buildAbout(data);
  buildSkills(data);
  buildExperience(data);
  buildProjects(data);
  buildContact(data);
  buildFooter(data);

  requestAnimationFrame(() => {
    initAnimations();
    initActiveNav();
    initCursorGlow();
    document.body.classList.add('loaded');
  });
}

document.addEventListener('DOMContentLoaded', init);
