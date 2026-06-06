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
- **Available:** Load audio with VMD, remove audio via sidebar panel
- **Impossible:** Audio offset/drag in timeline (babylon-mmd architecture limitation)
- **Why drag failed:** babylon-mmd runtime uses audioPlayer.currentTime as absolute time anchor. No offset/time-shift API exists in the library. Implementing via wrapper causes race conditions (AbortError) because the runtime internally seeks the audio element during play().

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
- [x] ~~Draggable audio track in timeline~~ — **Attempted 2026-06-06, abandoned**: babylon-mmd architecture limitation. Audio offset requires modifying the WASM runtime internals.
- [ ] Physics continuous playback without audio
- [ ] WebGPU resize handling / memory management
- [ ] Background color customization for 3D viewport
- [ ] Complete npm dependency audit and update strategy
- [ ] Audio waveform visualization in timeline (read-only, no drag)

---

*Last updated: 2026-06-06*

## Learnings & Decisions

### Audio Offset/Drag Attempt (2026-06-06)
- **Attempted:** Created `OffsetAudioPlayer` wrapper to shift currentTime
- **Failed:** Race condition with WASM runtime's internal seek+play cycle causes AbortError
- **Root cause:** babylon-mmd runtime reads `audioPlayer.currentTime` every frame in `beforePhysics()` and snaps animation to it. No offset/time-shift API exists.
- **Conclusion:** Audio in MMD_modoki is inherently single-track, zero-offset. For Premiere-style audio editing, would need to replace babylon-mmd's audio system entirely or process audio blobs (add silence/trim) before loading.
- **Decision:** Keep basic audio (load/remove), abandon drag/offset feature.
