# Feature Roadmap: Tone Generator

## Vision

Become the definitive online tone generator by combining professional audio capabilities, comprehensive educational content, and the best user experience in the market.

---

## Phase 1: Foundation Enhancement (Current Sprint)

### Priority: Critical

**Goal**: Achieve feature parity with top competitors while maintaining our unique strengths.

#### 1.1 Frequency Sweep Mode
- [ ] Add sweep mode toggle/section
- [ ] Start/end frequency inputs
- [ ] Duration selector (1-60 seconds)
- [ ] Sweep type options (Linear, Logarithmic)
- [ ] Real-time frequency display during sweep
- [ ] Sweep visualization on canvas
- [ ] Play/stop controls

**Effort**: Medium | **Impact**: High

#### 1.2 Expanded Tuning Presets
- [ ] Bass guitar (Standard, Drop D, 5-string)
- [ ] Ukulele (Standard GCEA, Baritone DGBE)
- [ ] Violin (G-D-A-E)
- [ ] Viola (C-G-D-A)
- [ ] Cello (C-G-D-A)
- [ ] Mandolin (G-D-A-E)
- [ ] Alternative guitar tunings (Drop D, DADGAD, Open G, Open D)
- [ ] Concert pitch variants (432 Hz, 442 Hz, 415 Hz Baroque)

**Effort**: Low | **Impact**: Medium-High

#### 1.3 Enhanced Educational Content
- [ ] Psychoacoustics section with academic citations
- [ ] Hearing science fundamentals
- [ ] Music theory: intervals and harmonics
- [ ] Historical context of concert pitch
- [ ] Safe listening guidelines with dB levels

**Effort**: Medium | **Impact**: High

#### 1.4 Simple Hearing Test Mode
- [ ] Test mode UI section
- [ ] Standard audiometric frequencies (250, 500, 1k, 2k, 4k, 8k Hz)
- [ ] Left/right ear selection
- [ ] Simple "can you hear this?" interface
- [ ] Results display
- [ ] Clear medical disclaimer

**Effort**: Medium | **Impact**: High

---

## Phase 2: Export & Sharing (Next Sprint)

### Priority: High

**Goal**: Enable users to export and share their configurations.

#### 2.1 WAV File Generation
- [ ] Client-side WAV generation using Web Audio API
- [ ] Configurable duration (1-30 seconds)
- [ ] Download button
- [ ] Include current waveform and frequency
- [ ] Optional: Sweep export

**Effort**: Medium | **Impact**: High

#### 2.2 URL Parameter Support
- [ ] Frequency parameter: `?freq=440`
- [ ] Waveform parameter: `?wave=sine`
- [ ] Volume parameter: `?vol=50`
- [ ] Auto-play option: `?play=1`
- [ ] Copy shareable URL button

**Effort**: Low | **Impact**: Medium

---

## Phase 3: Advanced Features (Future)

### Priority: Medium

**Goal**: Differentiate with unique, advanced capabilities.

#### 3.1 Binaural Beats Mode
- [ ] Base frequency input
- [ ] Beat frequency input (1-40 Hz)
- [ ] Presets for brain wave states
  - Delta (0.5-4 Hz): Deep sleep
  - Theta (4-8 Hz): Meditation
  - Alpha (8-13 Hz): Relaxation
  - Beta (13-30 Hz): Focus
  - Gamma (30-50 Hz): Peak performance
- [ ] Session timer
- [ ] Headphones required warning

**Effort**: Medium | **Impact**: Medium

#### 3.2 Tinnitus Frequency Matching
- [ ] Dedicated tinnitus section
- [ ] Fine-tuning controls (0.1 Hz precision)
- [ ] Octave verification prompts
- [ ] Volume matching
- [ ] Save matched frequency
- [ ] Masking sound suggestions
- [ ] Professional help resources

**Effort**: Low-Medium | **Impact**: Medium

#### 3.3 Noise Generation
- [ ] White noise
- [ ] Pink noise
- [ ] Brown/Brownian noise
- [ ] Mix with tones
- [ ] Filter controls

**Effort**: Medium | **Impact**: Low-Medium

#### 3.4 Harmonic Series Explorer
- [ ] Visual harmonic display
- [ ] Toggle individual harmonics
- [ ] See harmonic content of each waveform
- [ ] Educational explanations
- [ ] Interactive overtone series

**Effort**: High | **Impact**: Medium

---

## Phase 4: Platform Expansion (Long-term)

### Priority: Low

**Goal**: Expand reach and capabilities.

#### 4.1 Progressive Web App (PWA)
- [ ] Service worker for offline use
- [ ] Install prompt
- [ ] App-like experience
- [ ] Push notifications (optional)

**Effort**: Medium | **Impact**: Medium

#### 4.2 MIDI Input Support
- [ ] Web MIDI API integration
- [ ] MIDI note to frequency conversion
- [ ] Real-time note display
- [ ] MIDI learn for controls

**Effort**: High | **Impact**: Low

#### 4.3 API for Developers
- [ ] RESTful API for tone generation
- [ ] Embeddable widget
- [ ] Documentation

**Effort**: High | **Impact**: Low

---

## Implementation Timeline

### Week 1-2: Phase 1.1-1.3
- Frequency sweep mode
- Expanded tuning presets
- Enhanced educational content

### Week 3: Phase 1.4
- Hearing test mode

### Week 4-5: Phase 2
- WAV export
- URL parameters

### Month 2-3: Phase 3
- Binaural beats
- Tinnitus matching
- Noise generation

### Month 4+: Phase 4
- PWA
- MIDI
- API

---

## Technical Considerations

### Performance
- Canvas optimization for smooth visualization
- Efficient audio scheduling
- Lazy loading for educational content
- Minimize bundle size

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile Safari and Chrome

### Accessibility
- Full keyboard navigation
- ARIA labels
- Screen reader testing
- High contrast support

### SEO
- Structured data for tools
- FAQ schema
- Comprehensive meta tags
- Fast loading (Core Web Vitals)

---

## Success Metrics

### Phase 1 Goals
- [ ] Sweep mode usage: 20% of sessions
- [ ] New preset clicks: 30% increase
- [ ] Educational content scroll: 50% of visitors
- [ ] Time on page: > 3 minutes

### Phase 2 Goals
- [ ] WAV downloads: 10% of sessions
- [ ] URL shares: 5% of sessions

### Phase 3 Goals
- [ ] Binaural mode usage: 15% of sessions
- [ ] Tinnitus section visits: 10% of visitors

### Overall Goals
- [ ] Top 5 Google ranking for "tone generator"
- [ ] 25% return visitor rate
- [ ] < 3 second page load time
- [ ] > 90 Lighthouse score

---

## Dependencies

1. **No external dependencies for core features**
2. Web Audio API (native browser support)
3. Canvas API (native browser support)
4. Potential: Web MIDI API (Phase 4)

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Browser audio autoplay blocked | Medium | High | Clear play button, user interaction first |
| Poor mobile performance | Low | Medium | Optimize canvas, reduce animations |
| Hearing test misuse | Medium | Medium | Clear disclaimers, not medical advice |
| Audio quality issues | Low | High | Test across browsers, anti-aliasing |

---

## Current Sprint: Phase 1 Implementation

### Tasks
1. [x] Create research documentation
2. [ ] Add frequency sweep mode
3. [ ] Expand tuning presets (bass, ukulele, violin, alternative tunings)
4. [ ] Add hearing test section
5. [ ] Enhance educational content with citations
6. [ ] Test all features
7. [ ] Commit changes

### Definition of Done
- All features functional
- No console errors
- Responsive on mobile
- Educational content reviewed
- Git committed
