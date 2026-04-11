import './style.css'

// --- Academy Modal ---

const academyData = {
  1: {
    title: "Prompt Engineering",
    desc: "Achieve deterministic outputs from non-deterministic models. This comprehensive certification covers the physics of latent space navigation, enabling you to construct prompts that function as executable code. You will master the art of context window optimization, few-shot chain-of-thought protocols, and adversarial robustness testing to prevent prompt injection. By the end of this track, you will be able to engineer prompts that are statistically guaranteed to perform within strict business parameters.",
    modules: ["Syntax & Structure", "Context Windows", "Zero-shot vs Few-shot", "Anti-Hallucination"]
  },
  2: {
    title: "Agentic Workflow Design",
    desc: "Transition from static chatbots to autonomous agent swarms. This advanced track focuses on the architecture of cognitive architectures—designing systems that can plan, reason, and execute complex multi-step tasks without human intervention. You will learn to implement recursive self-correction loops, manage long-term memory states using vector databases, and orchestrate asynchronous tool-calling across distributed environments. This is the blueprint for the autonomous enterprise.",
    modules: ["Agent Architecture", "Tool Calling", "Memory & State", "Swarm Coordination"]
  },
  3: {
    title: "Systems Governance",
    desc: "Control the ghost in the machine. As AI systems become more autonomous, governance becomes the critical safety layer. This certification teaches you how to implement rigorous observablity pipelines, drift detection algorithms, and human-in-the-loop verification gates. You will design compliance frameworks that satisfy GDPR/EU AI Act requirements while maintaining operational velocity. We define the boundary conditions under which your synthetic workforce operates.",
    modules: ["Ethical AI Guardrails", "Drift Detection", "Audit Logs", "Compliance Standards"]
  }
};

function openAcademyModal(id) {
  const modal = document.getElementById('academy-modal');
  const body = document.getElementById('modal-body');
  const data = academyData[id];

  if (!modal || !body || !data) return;

  body.innerHTML = `
    <div class="grid-fluid" style="gap: 4rem;">
       <div style="grid-column: span 7; background: transparent;">
          <div class="text-xs" style="color: var(--brand-primary); margin-bottom: 2rem;">ACADEMY_CERTIFICATION_LEVEL_${id.toString().padStart(2, '0')}</div>
          <h3 style="font-size: 3.5rem; line-height: 1; margin-bottom: 2rem; color: #FFF; text-transform: uppercase;">${data.title}</h3>
          <p style="color: #999; font-size: 1.25rem; line-height: 1.6;">${data.desc}</p>
       </div>
       <div style="grid-column: span 5; border-left: 1px solid #333; padding-left: 3rem; display: flex; flex-direction: column; justify-content: center; background: transparent;">
          <div class="text-xs" style="color: #666; margin-bottom: 2rem;">CURRICULUM_TRACKS</div>
          <div style="display: grid; gap: 1.5rem;">
             ${data.modules.map(m => `
               <div style="display: flex; align-items: center; gap: 1rem; color: #FFF; font-size: 1.1rem;">
                  <span style="color: #444;">></span> ${m}
               </div>
             `).join('')}
          </div>
       </div>
    </div>
  `;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAcademyModal() {
  const modal = document.getElementById('academy-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// --- Slider Navigation ---

function goToSlide(section, index) {
  const track = document.getElementById(`track-${section}`);
  if (!track) return;

  track.style.transform = `translateX(-${index * 100}%)`;

  const nav = document.getElementById(`nav-${section}`);
  if (nav) {
    nav.querySelectorAll('.nav-item').forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
  }
}

// --- Event Delegation ---

// Academy items
document.addEventListener('click', (e) => {
  const academyItem = e.target.closest('[data-academy]');
  if (academyItem) {
    openAcademyModal(Number(academyItem.dataset.academy));
    return;
  }

  const closeBtn = e.target.closest('#academy-modal-close');
  if (closeBtn) {
    closeAcademyModal();
    return;
  }

  // Close modal on backdrop click
  const backdrop = e.target.closest('#academy-modal');
  if (backdrop && e.target === backdrop) {
    closeAcademyModal();
    return;
  }

  // Slider nav items
  const navItem = e.target.closest('[data-slider]');
  if (navItem) {
    goToSlide(navItem.dataset.slider, Number(navItem.dataset.slide));
    return;
  }
});

// --- Context Nav Visibility (IntersectionObserver) ---

const observerOptions = {
  root: null,
  threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const sectionId = entry.target.id;
    let navId = '';
    if (sectionId === 'section-automation') navId = 'nav-automation';
    if (sectionId === 'section-voice') navId = 'nav-voice';

    const nav = document.getElementById(navId);
    if (!nav) return;

    const rect = entry.boundingClientRect;
    const percentScrolledPastTop = (rect.top * -1) / rect.height;

    if (entry.intersectionRatio > 0.5 && percentScrolledPastTop < 0.20) {
      nav.classList.add('visible');
    } else {
      nav.classList.remove('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('#section-automation, #section-voice')
  .forEach(s => observer.observe(s));

// --- Hero Canvas Scroll Animation ---

(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const track = document.querySelector('.scroll-hero-track');

  const modules = import.meta.glob('./images/*.jpg', { eager: true });

  const imagesSrcs = Object.values(modules).map(mod => mod.default).sort((a, b) => {
    const numA = parseInt(a.match(/frame_(\d+)/)?.[1] || '0', 10);
    const numB = parseInt(b.match(/frame_(\d+)/)?.[1] || '0', 10);
    return numA - numB;
  });

  const images = [];
  let loadedCount = 0;

  imagesSrcs.forEach((src) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      loadedCount++;
      if (loadedCount === 1) {
        canvas.width = images[0].naturalWidth;
        canvas.height = images[0].naturalHeight;
        ctx.drawImage(images[0], 0, 0, canvas.width, canvas.height);
      }
    };
    images.push(img);
  });

  window.addEventListener('scroll', () => {
    if (!track || images.length === 0) return;

    const rect = track.getBoundingClientRect();
    const end = rect.height - window.innerHeight;
    const scrollTop = -rect.top;

    let progress = scrollTop / end;
    progress = Math.max(0, Math.min(1, progress));

    const frameIndex = Math.min(
      images.length - 1,
      Math.floor(progress * (images.length - 1))
    );

    if (images[frameIndex] && images[frameIndex].complete) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
    }
  });
})();
