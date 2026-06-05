# 既知課題（現行）

更新日: 2026-02-23

## 1. 編集機能
- 補間曲線編集は実装済みだが、複数キー同時編集やコピー/ペーストは未対応。
- カメラキー追加時の実値/補間スナップショット保存は実装済みだが、範囲編集UIは未実装。
- Property（表示/IK）トラック編集は未実装。
- VMDエクスポートは未実装。
- プロジェクトJSONは実装済みだが、外部ツール連携向けの仕様ドキュメント整備が不足。

## 2. タイムライン表現
- カメラ1行は同一フレーム列共有で、チャンネル別の独立キー編集は未対応。
- キー編集は追加/削除/1f移動が中心で、高度な範囲編集は未実装。

## 3. 物理
- 剛体モード 0/1/2 の運用仕様が未文書化。
- `disableBidirectionalTransformation` 相当切替の設計未完。
- 剛体/拘束デバッグ可視化は未実装。

## 4. 技術的注意
- `src/mmd-manager.ts` に文字コード由来の編集リスクがある環境がある。
- リポジトリはCRLF変換警告が出るため、差分確認時に行末変化へ注意。

## 5. 対応優先候補
- 1. Propertyトラック編集
- 2. VMDエクスポート
- 3. キー編集の範囲操作（複製/貼り付け/スケール）
- 4. 回転補間のMMD実機比較テスト自動化

## 6. Playback & Physics Issues (2026-06-05)

### Issue A: Physics stuttering when audio is NOT loaded
**Symptom:** When importing a PMX model and VMD motion without audio, rigid bodies (skirts, hair, accessories) behave erratically — stuttering, feeling lighter, apparent frame drops. Adding an audio track "fixes" the issue.

**Root Cause:** Two fundamentally different playback paths exist:
- **Without audio:** `advanceManualPlaybackWithoutAudio()` advances frames in discrete integer jumps (`Math.floor()` every ~2 frames) while physics steps every render frame. Bone transforms snap via `seekAnimation()`, creating discontinuous kinematic inputs.
- **With audio:** `mmdRuntime.beforePhysics()` receives continuous fractional frame time every render frame, providing smooth bone interpolation.

**Code:** `src/mmd-manager.ts` lines 3936-3953 (`play()`), 6735-6747 (`advanceManualPlaybackWithoutAudio()`), 2968-3006 (render loop).

### Issue B: No audio track management UI
**Symptom:** Once audio is loaded, there is no UI to remove, replace, or mute it. The only audio-related UI is the export checkbox (`export-ui-controller.ts`).

**Impact:** User must reload the entire project or manually edit the project JSON to remove audio.

**Code:** `src/assets/motion-asset-service.ts` lines 250-274 (audio loading). Missing: audio track panel, remove/swap controls.
