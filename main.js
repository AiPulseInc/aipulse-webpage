
import './style.css'

document.querySelector('#app').innerHTML = `
  <nav style="border-bottom: 1px solid var(--border-color); padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; background: #000; position: sticky; top: 0; z-index: 100;">
    <div style="font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">Antigravity AI</div>
    <div style="display: flex; gap: 2rem; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary);">
      <a href="#" class="hover-white">Services</a>
      <a href="#" class="hover-white">Academy</a>
      <a href="#" class="hover-white">Login</a>
    </div>
  </nav>

  <!-- SCROLL-DRIVEN HERO -->
  <!-- Container height controls animation duration (400vh = 4 screens of scrolling) -->
  <div class="scroll-hero-track" style="height: 400vh; position: relative; background: #000;">
    <div class="scroll-hero-sticky" style="position: sticky; top: 0; height: 100vh; overflow: hidden; display: flex; align-items: flex-end;">
      <div class="container-fluid" style="width: 100%; padding-bottom: 2rem;">
        <div class="grid-fluid" style="height: 100%; align-items: flex-end;">
          
          <!-- LEFT: Text Content -->
          <div style="grid-column: span 5; display: flex; flex-direction: column; justify-content: center; height: 100vh; z-index: 10; padding-bottom: 10vh; background: transparent;">
             <div class="text-xs" style="margin-bottom: 2rem; color: var(--brand-primary);">// SYSTEM_ONLINE</div>
             <h1 style="font-size: clamp(3.3rem, 6.6vw, 5.5rem); line-height: 1; margin-bottom: 2rem; letter-spacing: -0.02em;">
               INTELLIGENCE<br>
               <span style="white-space: nowrap;">AS ARCHITECTURE.</span>
             </h1>
             <p style="color: var(--text-secondary); font-size: 1.25rem; max-width: 40ch; line-height: 1.6;">
               We engineer the autonomous layer of your business. 
               Replacing friction with fluid, self-optimizing agentic workflows.
             </p>
             <div style="margin-top: 3rem;">
                <a href="#" class="btn" style="border: 1px solid #333;">Initialize Project</a>
             </div>
          </div>

          <!-- RIGHT: Abstract Canvas Animation -->
          <div style="grid-column: span 7; height: 100vh; position: relative; display: flex; align-items: flex-end; justify-content: center; background: transparent; padding-bottom: 50px;">
             <canvas id="hero-canvas" width="1000" height="1000" style="width: 85%; height: auto; max-height: 70vh; object-fit: contain;"></canvas>
          </div>
          
        </div>
      </div>
    </div>
  </div>

  <!-- CORE MODULE 01: AUTOMATION (White) -->
  <section id="section-automation" class="section section-white section-full-height" style="position: relative;">
    <div class="container-fluid">
      
      <!-- SLIDER VIEWPORT -->
      <div class="slider-viewport">
        <div class="slider-track" id="track-automation">
            
            <!-- SLIDE 1: Orchestration -->
            <div class="slider-slide">
              <div class="grid-fluid" style="align-items: center;">
                <div class="layout-col" style="grid-column: span 5; padding: 2rem;">
                  <div class="text-xs module-label">CORE_MODULE_01 // ORCHESTRATION</div>
                  <h2 class="module-title">Automation<br>Architecture</h2>
                  <p class="module-desc">
                    Complete autonomous workflow integration. From sales pipelines to internal CRM updates, we build the invisible layer that powers your business logic.
                  </p>
                  <div>
                    <a href="#" class="btn btn-outline">+ View Schematics</a>
                  </div>
                </div>
                <div class="layout-col" style="grid-column: span 7; display: flex; justify-content: flex-end; padding: 2rem;">
                   <div class="module-visual-container">
                      <div style="text-align: center;">
                         <div class="text-xs" style="margin-bottom: 1rem;">SYSTEM STATUS</div>
                         <div style="font-family: monospace; font-size: 1.5rem; color: #000;">ACTIVE</div>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            <!-- SLIDE 2: Sales AI -->
            <div class="slider-slide">
              <div class="grid-fluid" style="align-items: center;">
                <div class="layout-col" style="grid-column: span 5; padding: 2rem;">
                  <div class="text-xs module-label">CORE_MODULE_01 // SALES_AI</div>
                  <h2 class="module-title">Intelligent<br>Outreach</h2>
                  <p class="module-desc">
                    Automated prospecting and lead qualification. Our agents engage stakeholders with hyper-personalized communication at scale.
                  </p>
                  <div>
                    <a href="#" class="btn btn-outline">+ View Performance</a>
                  </div>
                </div>
                <div class="layout-col" style="grid-column: span 7; display: flex; justify-content: flex-end; padding: 2rem;">
                   <div class="module-visual-container">
                      <div class="text-xl" style="color: #000;">+400% Lead G.</div>
                   </div>
                </div>
              </div>
            </div>

            <!-- SLIDE 3: Support AI -->
            <div class="slider-slide">
                <div class="grid-fluid" style="align-items: center;">
                  <div class="layout-col" style="grid-column: span 5; padding: 2rem;">
                    <div class="text-xs module-label">CORE_MODULE_01 // SUPPORT_AI</div>
                    <h2 class="module-title">Ticket<br>Resolution</h2>
                    <p class="module-desc">
                      L1 and L2 support handled instantly. 24/7 resolution of common issues without human intervention.
                    </p>
                  </div>
                  <div class="layout-col" style="grid-column: span 7; display: flex; justify-content: flex-end; padding: 2rem;">
                     <div class="module-visual-container">
                        <div class="text-xl" style="color: #000;">0s Wait Time</div>
                     </div>
                  </div>
                </div>
              </div>

            <!-- SLIDE 4: Ops AI -->
            <div class="slider-slide">
                <div class="grid-fluid" style="align-items: center;">
                  <div class="layout-col" style="grid-column: span 5; padding: 2rem;">
                    <div class="text-xs module-label">CORE_MODULE_01 // OPS_AI</div>
                    <h2 class="module-title">Internal<br>Operations</h2>
                    <p class="module-desc">
                      Self-healing operational workflows. Automated reporting, invoicing, and compliance checks.
                    </p>
                  </div>
                  <div class="layout-col" style="grid-column: span 7; display: flex; justify-content: flex-end; padding: 2rem;">
                     <div class="module-visual-container">
                        <div class="text-xl" style="color: #000;">100% Uptime</div>
                     </div>
                  </div>
                </div>
              </div>

        </div>
      </div>

      <!-- Contextual Bottom Bar (Fixed relative to screen via JS toggle, but markup here) -->
      <div id="nav-automation" class="context-nav-bar">
          <div class="nav-item active" onclick="goToSlide('automation', 0)">Orchestration</div>
          <div class="nav-item" onclick="goToSlide('automation', 1)">Sales</div>
          <div class="nav-item" onclick="goToSlide('automation', 2)">Support</div>
          <div class="nav-item" onclick="goToSlide('automation', 3)">Ops</div>
      </div>

    </div>
  </section>

  <!-- CORE MODULE 02: VOICE AGENTS (Black) -->
  <section id="section-voice" class="section section-full-height section-black-border" style="background: #000; position: relative;">
    <div class="container-fluid">
        
      <div class="slider-viewport">
        <div class="slider-track" id="track-voice">
            
            <!-- SLIDE 1: Inbound -->
            <div class="slider-slide">
                <div class="grid-fluid" style="align-items: center;">
                    <!-- Visual Left -->
                    <div class="layout-col" style="grid-column: span 7; padding: 2rem;">
                    <div class="module-visual-container visual-dark-bg" style="position: relative; overflow: hidden;">
                        <!-- Sound Wave Viz -->
                        <div style="display: flex; gap: 4px; align-items: center; height: 100px;">
                            <div class="viz-bar viz-bar-1 animate-pulse"></div>
                            <div class="viz-bar viz-bar-2 animate-pulse"></div>
                            <div class="viz-bar viz-bar-3 animate-pulse"></div>
                            <div class="viz-bar viz-bar-4 animate-pulse"></div>
                            <div class="viz-bar viz-bar-5 animate-pulse"></div>
                        </div>
                    </div>
                    </div>
                    <div class="layout-col" style="grid-column: span 5; padding: 2rem;">
                    <div class="text-xs" style="margin-bottom: 2rem; color: #555;">CORE_MODULE_02 // INBOUND</div>
                    <h2 class="module-title">Voice<br>Agents</h2>
                    <p class="module-desc">
                        Latency-optimized conversational models that speak your brand's language with human-like nuance.
                    </p>
                    <div>
                        <a href="#" class="btn btn-white">+ Hear Samples</a>
                    </div>
                    </div>
                </div>
            </div>

            <!-- SLIDE 2: Outbound -->
            <div class="slider-slide">
                <div class="grid-fluid" style="align-items: center;">
                    <div class="layout-col" style="grid-column: span 7; padding: 2rem;">
                    <div class="module-visual-container visual-dark-bg">
                        <div style="color: #FFF; font-size: 1.2rem; font-family: monospace;">> Dialing...</div>
                    </div>
                    </div>
                    <div class="layout-col" style="grid-column: span 5; padding: 2rem;">
                    <div class="text-xs" style="margin-bottom: 2rem; color: #555;">CORE_MODULE_02 // OUTBOUND</div>
                    <h2 class="module-title">Active<br>Recall</h2>
                    <p class="module-desc">
                        Proactive customer engagement. Surveys, appointment confirmations, and reactivation campaigns.
                    </p>
                    </div>
                </div>
            </div>

            <!-- SLIDE 3: Auth -->
            <div class="slider-slide">
                <div class="grid-fluid" style="align-items: center;">
                    <div class="layout-col" style="grid-column: span 7; padding: 2rem;">
                    <div class="module-visual-container visual-dark-bg">
                         <div style="border: 1px solid #27C93F; color: #27C93F; padding: 0.5rem 1rem; border-radius: 4px;">VERIFIED</div>
                    </div>
                    </div>
                    <div class="layout-col" style="grid-column: span 5; padding: 2rem;">
                    <div class="text-xs" style="margin-bottom: 2rem; color: #555;">CORE_MODULE_02 // SECURITY</div>
                    <h2 class="module-title">Voice<br>ID</h2>
                    <p class="module-desc">
                        Biometric voice authentication for secure, password-less customer verification.
                    </p>
                    </div>
                </div>
            </div>

        </div>
      </div>

       <!-- Contextual Bottom Bar -->
       <div id="nav-voice" class="context-nav-bar">
        <div class="nav-item active" onclick="goToSlide('voice', 0)">Inbound</div>
        <div class="nav-item" onclick="goToSlide('voice', 1)">Outbound</div>
        <div class="nav-item" onclick="goToSlide('voice', 2)">Security</div>
      </div>

    </div>
  </section>

  <!-- CORE MODULE 03: ACADEMY (White) -->
  <section class="section section-white" style="position: relative; padding: 6rem 0;">
    <div class="container-fluid">
      <div class="grid-fluid">
        
        <!-- Left Col: Header & Action -->
        <div class="layout-col" style="grid-column: span 5; display: flex; flex-direction: column; justify-content: center;">
          <div class="text-xs" style="color: #999; margin-bottom: 1rem; letter-spacing: 0.1em;">CORE_MODULE_03</div>
          <h2 style="font-size: 4rem; line-height: 1; color: #000; margin-bottom: 2rem; font-weight: 700;">
            THE<br>ACADEMY
          </h2>
          <p style="font-size: 1.1rem; line-height: 1.6; color: #666; max-width: 40ch; margin-bottom: 4rem;">
            Corporate training and certification. We empower your workforce to govern the AI systems we build.
          </p>

          <div>
             <a href="#" class="btn btn-outline" style="color: #000; border-color: #000;">+ JOIN ACADEMY</a>
          </div>
        </div>

        <!-- Right Col: Curriculum List -->
        <div class="layout-col" style="grid-column: span 7; padding-left: 4rem;">
           <div style="background: #f9f9f9; padding: 4rem; border: 1px solid #eee;">
              
              <!-- Item 1 -->
              <div class="academy-item" onclick="openAcademyModal(1)" style="border-bottom: 1px solid #e5e5e5; padding-bottom: 2rem; margin-bottom: 2rem;">
                  <div class="text-xs" style="color: #aaa; margin-bottom: 0.5rem;">CERTIFICATION_LEVEL_01</div>
                  <h4 style="font-size: 1.5rem; color: #000; font-weight: 600;">PROMPT ENGINEERING</h4>
              </div>

              <!-- Item 2 -->
              <div class="academy-item" onclick="openAcademyModal(2)" style="border-bottom: 1px solid #e5e5e5; padding-bottom: 2rem; margin-bottom: 2rem;">
                  <div class="text-xs" style="color: #aaa; margin-bottom: 0.5rem;">CERTIFICATION_LEVEL_02</div>
                  <h4 style="font-size: 1.5rem; color: #000; font-weight: 600;">AGENTIC WORKFLOW DESIGN</h4>
              </div>

              <!-- Item 3 -->
              <div class="academy-item" onclick="openAcademyModal(3)">
                  <div class="text-xs" style="color: #aaa; margin-bottom: 0.5rem;">CERTIFICATION_LEVEL_03</div>
                  <h4 style="font-size: 1.5rem; color: #000; font-weight: 600;">SYSTEMS GOVERNANCE</h4>
              </div>

           </div>
        </div>

      </div>
    </div>
  </section>

  <!-- ACADEMY MODAL (Brutalist) -->
  <div id="academy-modal" class="academy-modal-backdrop">
     <div class="academy-modal-content">
        <button class="academy-modal-close" onclick="closeAcademyModal()">
           <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" stroke-width="2"/>
           </svg>
        </button>
        <div id="modal-body">
           <!-- Dynamic Content -->
        </div>
     </div>
  </div>

  <!-- THE PROTOCOL (Process) -->
  <section class="section" style="background: #000; padding: 10rem 0; min-height: 800px; display: flex; flex-direction: column; justify-content: center;">
    <div class="container-fluid">
      <div style="margin-bottom: 4rem; padding: 0 2rem;">
        <h2 style="font-size: 1.5rem;">The Protocol</h2>
      </div>
      
      <div class="grid-fluid" style="border: none; background: transparent; gap: 2rem;">
         <div style="grid-column: span 4;" class="protocol-step">
            <div class="protocol-step-number">PHASE_01</div>
            <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">Audit & Architect</h3>
            <p style="color: var(--text-secondary);">We map your existing workflows to identify friction points. Then we design the neural architecture.</p>
         </div>
         <div style="grid-column: span 4;" class="protocol-step">
            <div class="protocol-step-number">PHASE_02</div>
            <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">Develop & Train</h3>
            <p style="color: var(--text-secondary);">Custom agents are built and trained on your proprietary data. RAG pipelines are established.</p>
         </div>
         <div style="grid-column: span 4;" class="protocol-step">
            <div class="protocol-step-number">PHASE_03</div>
            <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">Deploy & Autonomy</h3>
            <p style="color: var(--text-secondary);">Systems go live. We monitor drift and optimize for complete operational autonomy.</p>
         </div>
      </div>
      
      <!-- Trust Core Merged -->
      <div class="scroller-container" style="margin-top: auto; padding-top: 8rem; opacity: 0.7;">
         <div class="scroller-content">
            <div class="logo-item">OpenAI</div>
            <div class="logo-item">Anthropic</div>
            <div class="logo-item">Vapi</div>
            <div class="logo-item">HuggingFace</div>
            <div class="logo-item">Pinecone</div>
            <div class="logo-item">LangChain</div>
            <div class="logo-item">Stability</div>
            
            <div class="logo-item">OpenAI</div>
            <div class="logo-item">Anthropic</div>
            <div class="logo-item">Vapi</div>
            <div class="logo-item">HuggingFace</div>
            <div class="logo-item">Pinecone</div>
            <div class="logo-item">LangChain</div>
            <div class="logo-item">Stability</div>
         </div>
      </div>
    </div>
  </section>

  <section class="section section-white" style="min-height: auto; padding: 4rem 0; display: flex; flex-direction: column; justify-content: center;">
     <div class="container-fluid">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 4rem;">
            <div class="text-xs" style="color: #666; margin-bottom: 1rem;">// PERFORMANCE_METRICS</div>
            <h2 style="font-size: 3.5rem; margin-bottom: 1.5rem; line-height: 1;">Why Us?</h2>
            <p style="color: var(--text-secondary); max-width: 60ch; margin: 0 auto; font-size: 1.1rem; line-height: 1.6;">
               We don't just build software; we engineer outcomes. Our autonomous agents are designed to drastically reduce operational friction and amplify human potential.
            </p>
        </div>

        <!-- KPI Cards Container -->
        <div class="kp-container">
           <!-- KPI 1 -->
           <div class="kpi-card">
              <div class="kpi-number">94%</div>
              <div class="kpi-label">Faster Execution</div>
              <p class="kpi-desc">
                 Tasks that took days now take minutes. Our agents operate asynchronously, clearing backlogs while you sleep.
              </p>
           </div>
           
           <!-- KPI 2 -->
           <div class="kpi-card">
              <div class="kpi-number">85%</div>
              <div class="kpi-label">Cost Reduction</div>
              <p class="kpi-desc">
                 Minimizing overhead by automating repetitive, high-volume workflows, allowing capital reallocation to growth.
              </p>
           </div>

           <!-- KPI 3 -->
           <div class="kpi-card">
              <div class="kpi-number">0%</div>
              <div class="kpi-label">Hallucination Rate</div>
              <p class="kpi-desc">
                 Our proprietary RAG pipelines ensures strict adherence to your ground-truth data, eliminating creative drift.
              </p>
           </div>
        </div>
     </div>
  </section>

  <section class="section" style="border-bottom: none; background: #000;">
    <div class="container-fluid">
      <div class="grid-fluid">
        <div style="grid-column: span 6; padding: 4rem; display: flex; flex-direction: column; justify-content: center;">
           <h2 style="font-size: 3rem;">Ready to Deploy?</h2>
           <p style="color: var(--text-secondary); margin-bottom: 2rem;">Schedule a technical consultation to map your automation strategy.</p>
           <div>
             <a href="#" class="btn" style="background: transparent; color: white; border: 1px solid white;">Contact Engineering</a>
           </div>
        </div>
        <div style="grid-column: span 6; padding: 4rem; background: #050505; min-height: 510px; position: relative;">
           <div style="position: absolute; bottom: 2rem; left: 2rem; font-family: monospace; color: #444;">
             > _init protocol<br>
             > _loading modules...<br>
             > _waiting for user input<span class="animate-pulse">_</span>
           </div>
        </div>
      </div>
    </div>
  </section>

  <footer style="padding: 4rem 2rem; border-top: 1px solid var(--border-color);">
    <div class="container-fluid" style="display: flex; justify-content: space-between; align-items: flex-end;">
       <div>
         <div style="font-weight: 700; text-transform: uppercase; margin-bottom: 1rem;">Antigravity AI</div>
         <div style="color: var(--text-secondary); font-size: 0.8rem;">© 2026. All Systems Nominal.</div>
       </div>
       <div style="display: flex; gap: 2rem;">
          <a href="#" class="text-xs">Twitter</a>
          <a href="#" class="text-xs">LinkedIn</a>
          <a href="#" class="text-xs">GitHub</a>
       </div>
    </div>
  </footer>
`;

// --- GLOBAL LOGIC ---

// Academy Data
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

window.openAcademyModal = (id) => {
  const modal = document.getElementById('academy-modal');
  const body = document.getElementById('modal-body');
  const data = academyData[id];

  if (modal && body && data) {
    body.innerHTML = `
      <div class="grid-fluid" style="gap: 4rem;">
         <!-- Left: Header & Desc -->
         <div style="grid-column: span 7; background: transparent;">
            <div class="text-xs" style="color: var(--brand-primary); margin-bottom: 2rem;">ACADEMY_CERTIFICATION_LEVEL_${id.toString().padStart(2, '0')}</div>
            <h3 style="font-size: 3.5rem; line-height: 1; margin-bottom: 2rem; color: #FFF; text-transform: uppercase;">${data.title}</h3>
            <p style="color: #999; font-size: 1.25rem; line-height: 1.6;">${data.desc}</p>
         </div>

         <!-- Right: Curriculum -->
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
};

window.closeAcademyModal = () => {
  const modal = document.getElementById('academy-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};
window.goToSlide = (section, index) => {
  const track = document.getElementById(`track - ${section} `);
  if (!track) return;

  // Slide transforms
  track.style.transform = `translateX(-${index * 100} %)`;

  // Update Nav Active State
  const nav = document.getElementById(`nav - ${section} `);
  if (nav) {
    const items = nav.querySelectorAll('.nav-item');
    items.forEach((item, i) => {
      if (i === index) item.classList.add('active');
      else item.classList.remove('active');
    });
  }
};



// Initialize Observers
// Using setTimeout to ensure DOM is rendered since we are injecting innerHTML
setTimeout(() => {
  // We observe multiple thresholds to handle the specific entry/exit requirements
  const observerOptions = {
    root: null,
    threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const sectionId = entry.target.id;
      // Map section IDs to Nav IDs
      let navId = '';
      if (sectionId === 'section-automation') navId = 'nav-automation';
      if (sectionId === 'section-voice') navId = 'nav-voice';

      const nav = document.getElementById(navId);
      if (nav) {
        const rect = entry.boundingClientRect;
        const sectionHeight = rect.height;

        // 1. ENTRY CONDITION: "visible after over 50% of the section is scrolled by user" (SCROLLED INTO VIEW)
        // We check if the section covers the viewport center OR is substantially overlapping.
        // intersectionRatio > 0.5 is a good proxy for "50% visible".

        // 2. EXIT CONDITION: "disappear when 20% of the section is over the top of the page" 
        // This means rect.top is negative (past top) and its magnitude is > 20% of height.
        const percentScrolledPastTop = (rect.top * -1) / sectionHeight;

        // Logic:
        // Show if: Intersection > 0.5 AND We haven't scrolled past 20%

        if (entry.intersectionRatio > 0.5 && percentScrolledPastTop < 0.20) {
          nav.classList.add('visible');
        } else {
          // Hide if less than 50% visible (entering/leaving bottom)
          // OR if we have scrolled past the top by more than 20%
          nav.classList.remove('visible');
        }
      }
    });
  }, observerOptions);

  const sections = document.querySelectorAll('#section-automation, #section-voice');
  sections.forEach(s => observer.observe(s));
}, 100);

// Logic for hero animation
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return; // Guard clause

  const ctx = canvas.getContext('2d');
  const track = document.querySelector('.scroll-hero-track');

  // Load images using Vite glob import
  // This imports all .jpg files from existing ./images/ directory
  const modules = import.meta.glob('./images/*.jpg', { eager: true });

  // Extract URLs and sort them by filename index (frame_000, frame_001, etc.)
  // Handles variable suffixes like delay-0.042s
  const imagesSrcs = Object.values(modules).map(mod => mod.default).sort((a, b) => {
    // Extract first number sequence after 'frame_'
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
      // Draw first frame immediately when ready
      if (loadedCount === 1) {
        canvas.width = images[0].naturalWidth;
        canvas.height = images[0].naturalHeight;
        ctx.drawImage(images[0], 0, 0, canvas.width, canvas.height);
      }
    };
    images.push(img);
  });

  // Scroll Logic
  window.addEventListener('scroll', () => {
    if (!track || images.length === 0) return;

    const rect = track.getBoundingClientRect();
    const end = rect.height - window.innerHeight;
    // rect.top is 0 when sticky starts. 
    // We want progress 0 when rect.top is 0.
    const scrollTop = -rect.top;

    let progress = scrollTop / end;
    progress = Math.max(0, Math.min(1, progress)); // Clamp 0-1

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
