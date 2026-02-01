
import './style.css'

document.querySelector('#app').innerHTML = `
  <nav style="border-bottom: 1px solid var(--border-color); padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 100;">
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
  <section class="section section-white section-full-height">
    <div class="container-fluid">
      <div class="grid-fluid" style="align-items: center;">
        <div class="layout-col" style="grid-column: span 5; padding: 2rem;">
          <div class="text-xs module-label">CORE_MODULE_01</div>
          <h2 class="module-title">Automation<br>Architecture</h2>
          <p class="module-desc">
            Complete autonomous workflow integration. From sales pipelines to internal CRM updates, we build the invisible layer that powers your business logic.
          </p>
          <div>
            <a href="#" class="btn btn-outline">+ View Schematics</a>
          </div>
        </div>
        <div class="layout-col" style="grid-column: span 7; display: flex; justify-content: flex-end; padding: 2rem;">
          <!-- Visual Placeholder or Schematic Rep -->
           <div class="module-visual-container">
              <div style="text-align: center;">
                 <div class="text-xs" style="margin-bottom: 1rem;">SYSTEM STATUS</div>
                 <div style="font-family: monospace; font-size: 1.5rem; color: #000;">ACTIVE</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CORE MODULE 02: VOICE AGENTS (Black) -->
  <section class="section section-full-height section-black-border" style="background: #000;">
    <div class="container-fluid">
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
          <div class="text-xs" style="margin-bottom: 2rem; color: #555;">CORE_MODULE_02</div>
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
  </section>

  <!-- CORE MODULE 03: ACADEMY (White) -->
  <section class="section section-white section-full-height">
    <div class="container-fluid">
      <div class="grid-fluid" style="align-items: center;">
        <div class="layout-col" style="grid-column: span 5; padding: 2rem;">
          <div class="text-xs module-label">CORE_MODULE_03</div>
          <h2 class="module-title">The<br>Academy</h2>
          <p class="module-desc">
            Corporate training and certification. We empower your workforce to govern the AI systems we build.
          </p>
          <div>
            <a href="#" class="btn btn-outline">+ Access Curriculum</a>
          </div>
        </div>
        <div class="layout-col" style="grid-column: span 7; display: flex; justify-content: flex-end; padding: 2rem;">
           <div class="module-visual-container" style="flex-direction: column; padding: 3rem; align-items: flex-start;">
              <div style="border-bottom: 1px solid #ddd; padding-bottom: 1rem; margin-bottom: 1rem; width: 100%;">
                 <div class="text-xs" style="color: #999;">CERTIFICATION_LEVEL_01</div>
                 <h4 style="font-size: 1.2rem; margin-top: 0.5rem; color: #000;">Prompt Engineering</h4>
              </div>
              <div style="border-bottom: 1px solid #ddd; padding-bottom: 1rem; margin-bottom: 1rem; width: 100%;">
                 <div class="text-xs" style="color: #999;">CERTIFICATION_LEVEL_02</div>
                 <h4 style="font-size: 1.2rem; margin-top: 0.5rem; color: #000;">Agentic Workflow Design</h4>
              </div>
              <div style="width: 100%;">
                 <div class="text-xs" style="color: #999;">CERTIFICATION_LEVEL_03</div>
                 <h4 style="font-size: 1.2rem; margin-top: 0.5rem; color: #000;">Systems Governance</h4>
              </div>
           </div>
        </div>
      </div>
    </div>
  </section>

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

  <section class="section section-white" style="min-height: 1000px; padding: 8rem 0; display: flex; flex-direction: column; justify-content: center;">
     <div class="container-fluid">
        <div class="grid-fluid">
           <div style="grid-column: span 4; display: flex; flex-direction: column; justify-content: flex-start; padding-top: 4rem;">
              <div class="text-xs" style="color: #666; margin-bottom: 1rem;">// NEURAL_INTERFACE_V2</div>
              <h2 style="font-size: 3.5rem; margin-bottom: 1.5rem; line-height: 1;">Live<br>Intelligence.</h2>
              <p style="color: var(--text-secondary); margin-bottom: 3rem; max-width: 30ch; font-size: 1.1rem;">
                 Interact with your data. Our RAG pipelines turn static documentation into active, conversational knowledge bases. 
                 <br><br>
                 Watch the system think, retrieve, and generate in real-time.
              </p>
              <div>
                 <a href="#" class="btn" style="background: #000; color: #fff;">Initialize Demo</a>
              </div>
           </div>
           
           <!-- Complex Dashboard Visual -->
           <div style="grid-column: span 8;">
              <div class="dashboard-grid">
                 <!-- Main Chat / Terminal Window -->
                 <div class="terminal-window" style="grid-column: span 2;">
                     <div class="terminal-header" style="justify-content: space-between;">
                        <div style="display: flex; gap: 0.5rem;">
                           <div class="dot dot-red"></div>
                           <div class="dot dot-yellow"></div>
                           <div class="dot dot-green"></div>
                        </div>
                        <div style="font-size: 0.7rem; color: #555;">agent_core_alpha.exe</div>
                     </div>
                     <div class="terminal-body">
                        <div style="margin-bottom: 1rem; color: #666;">> connecting to vector_db... <span style="color: #27C93F;">SUCCESS</span></div>
                        <div style="margin-bottom: 1rem;">
                           <span style="color: #27C93F;">USER:</span> Analyze Q3 revenue against projected hiring costs.
                        </div>
                         <div style="margin-bottom: 1rem; padding: 1rem; background: #111; border-left: 2px solid #27C93F; font-size: 0.8rem; color: #888;">
                           > [THOUGHT CHAIN]
                           <br>> Retrieving Q3_Financials.pdf (Confidence: 0.98)
                           <br>> Retrieving HR_Budget_2026.xlsx (Confidence: 0.92)
                           <br>> Cross-referencing entities...
                        </div>
                        <div>
                           <span style="color: var(--brand-primary); opacity: 0.8;">AGENT:</span> Based on the analysis, Q3 revenue ($2.4M) supports the expansion of the engineering team by 4 headcount. However, Marketing budget should be constrained to maintain the <span style="color:#FFF; font-weight:bold;">22% net margin target</span>.<span class="typing-cursor"></span>
                        </div>
                     </div>
                 </div>
                 
                 <!-- Metric Card 1 -->
                 <div class="stat-card">
                    <div class="text-xs" style="color: #999; margin-bottom: 0.5rem;">VECTOR RETRIEVAL</div>
                    <div style="font-size: 2.5rem; font-weight: 700; color: #000;">14ms</div>
                    <div style="height: 4px; width: 100%; background: #EEE; margin-top: 1rem; border-radius: 2px;">
                       <div style="height: 100%; width: 85%; background: #000; border-radius: 2px;"></div>
                    </div>
                 </div>

                 <!-- Metric Card 2 -->
                 <div class="stat-card" style="background: #111; border: 1px solid #333; color: #FFF;">
                    <div class="text-xs" style="color: #666; margin-bottom: 0.5rem;">SYSTEM LOAD</div>
                    <div style="font-size: 2.5rem; font-weight: 700;">800t/s</div>
                    <div class="log-stream" style="margin-top: 1rem; color: #444;">
                       > node_1: active<br>
                       > node_2: standby
                    </div>
                 </div>
              </div>
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
