
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

  <header class="section" style="padding-top: 8rem; padding-bottom: 8rem;">
    <div class="container-fluid">
      <div class="grid-fluid">
        <div style="grid-column: span 8; padding: 4rem;">
          <div class="text-xs" style="margin-bottom: 1rem;">// SYSTEM_ONLINE</div>
          <h1 class="text-xl" style="margin-bottom: 2rem;">
            INTELLIGENCE<br>
            AS ARCHITECTURE.
          </h1>
          <p style="color: var(--text-secondary); max-width: 60ch; font-size: 1.25rem; margin-bottom: 3rem;">
            We engineer the autonomous layer of your business. 
            Replacing friction with fluid, self-optimizing agentic workflows.
          </p>
          <a href="#" class="btn">Initialize Project</a>
        </div>
        <div style="grid-column: span 4; background: #050505; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden;">
           <!-- Abstract Visualization -->
           <div style="width: 100%; height: 100%; position: absolute; opacity: 0.2; background: repeating-linear-gradient(45deg, #222 0px, #222 1px, transparent 1px, transparent 10px);"></div>
           <div style="width: 150px; height: 150px; border: 1px solid #333; display: flex; align-items: center; justify-content: center;">
              <div style="width: 10px; height: 10px; background: white;" class="animate-pulse"></div>
           </div>
        </div>
      </div>
    </div>
  </header>



  <section class="section section-white">
    <div class="container-fluid">
      <div style="margin-bottom: 2rem; padding: 0 2rem;">
        <h2 style="font-size: 1.5rem;">Core Modules</h2>
      </div>
      
      <div class="grid-fluid">
        <!-- Automation - Full Width -->
        <div class="card" style="grid-column: span 12; display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 2rem; min-height: 290px;">
           <div style="flex: 1;">
             <div class="text-xs">01</div>
             <h3 style="font-size: 2.5rem; margin: 1rem 0;">Automation Architecture</h3>
             <p style="color: var(--text-secondary); max-width: 60ch;">Complete autonomous workflow integration. From sales pipelines to internal CRM updates, we build the invisible layer that powers your business logic.</p>
           </div>
           <div style="border-left: 1px solid #222; padding-left: 2rem; display: flex; flex-direction: column; align-items: flex-end;">
             <span class="text-xs">+ VIEW SCHEMATICS</span>
             <div style="margin-top: 1rem; font-family: monospace; color: var(--brand-primary);">STATUS: ACTIVE</div>
           </div>
        </div>

        <!-- Voice - Half Width -->
        <div class="card" style="grid-column: span 6;">
           <div class="text-xs" style="margin-bottom: auto;">02</div>
           <h3 style="font-size: 2rem; margin: 1rem 0;">Voice Agents</h3>
           <p style="color: var(--text-secondary);">Latency-optimized conversational models.</p>
           <div style="margin-top: 2rem; border-top: 1px solid #222; padding-top: 1rem;">
             <span class="text-xs">+ HEAR SAMPLES</span>
           </div>
        </div>

        <!-- Academy - Half Width -->
        <div class="card" style="grid-column: span 6;">
           <div class="text-xs" style="margin-bottom: auto;">03</div>
           <h3 style="font-size: 2rem; margin: 1rem 0;">Academy</h3>
           <p style="color: var(--text-secondary);">Corporate training and certification.</p>
           <div style="margin-top: 2rem; border-top: 1px solid #222; padding-top: 1rem;">
             <span class="text-xs">+ ACCESS CURRICULUM</span>
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
`
