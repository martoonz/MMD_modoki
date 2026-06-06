# Known Issues — MarToonZ Fork

Fork of MMD_modoki with different priorities (Linux support, WebGPU stability, audio workflow).

## 1. Physics & Playback

### Physics stuttering when audio is NOT loaded
- **Status:** Documented, not fixed
- **Root cause:** Discrete frame seeking (`advanceManualPlaybackWithoutAudio`) vs continuous physics integration
- **Files:** `src/mmd-manager.ts` lines 3936-3953, 6735-6747
- **Workaround:** Always load an audio track

### No audio track management UI
- **Status:** Partially fixed (basic remove panel added 2026-06-06)
- **Missing:** Timeline audio track, drag-to-seek, audio offset controls

## 2. WebGPU / Rendering

### Viewport turns black on window resize
- **Status:** Documented, not fixed
- **Root cause:** `VK_ERROR_OUT_OF_DEVICE_MEMORY` when recreating post-process textures at larger sizes
- **Workaround:** Do not resize window, use default 1440x810
- **Environment:** NVIDIA RTX 3080, Linux Wayland, Electron 40.10.2

## 3. Security / Dependencies

### npm audit vulnerabilities
- **Status:** Acknowledged, low priority
- **Details:** 47 vulns in devDependencies (eslint, electron-forge, vite, etc.)
- **Risk:** None for runtime (all in build tooling)
- **Note:** `min-release-age=3` configured in npmrc

## 4. Fork-specific TODOs
- [ ] Draggable audio track in timeline (click-left drag)
- [ ] Physics continuous playback without audio
- [ ] WebGPU resize handling / memory management
- [ ] Background color customization for 3D viewport
- [ ] Complete npm dependency audit and update strategy

---

*Last updated: 2026-06-06*
