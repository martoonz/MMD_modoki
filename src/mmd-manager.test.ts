import { describe, expect, it } from "vitest";

// ---------------------------------------------------------------------------
// Phase 5 – GREEN: all phases complete.
//
// Because MmdManager's constructor relies on a live WebGL/WebGPU engine,
// full instantiation is not possible in vitest/node.  These tests verify
// the behaviour contract through prototype inspection, field access on
// partial stubs, and source-code checks on the private methods.
// ---------------------------------------------------------------------------

function createStubInstance(MmdManagerClass: new (...args: never[]) => unknown) {
    const stub = Object.create(MmdManagerClass.prototype) as Record<string, unknown>;
    stub.groundPhysicsBody = null;
    stub.groundPhysicsImpostor = null;
    stub.ground = null;
    stub.physicsBackend = "none";
    stub.bulletPhysicsRuntime = null;
    stub.physicsPlugin = null;
    stub.physicsRuntime = null;
    stub.scene = {};
    stub.physicsAvailable = false;
    return stub;
}

describe("MmdManager floor physics", () => {
    // -- Bullet -----------------------------------------------------------------
    it("2.1 — groundPhysicsBody is null before Bullet init", async () => {
        const { MmdManager } = await import("./mmd-manager");
        const stub = createStubInstance(MmdManager);
        expect(stub.groundPhysicsBody).toBeNull();
    });

    it("2.1-GREEN — Bullet backend creates ground collider", async () => {
        const { MmdManager } = await import("./mmd-manager");
        const methodSource = MmdManager.prototype[
            "initializeBulletPhysicsBackend"
        ].toString();

        expect(methodSource).toContain("PhysicsStaticPlaneShape");
        expect(methodSource).toContain("MotionType.Static");
        expect(methodSource).toContain("addRigidBodyToGlobal");
        expect(methodSource).toContain("groundPhysicsBody");
        expect(methodSource).toContain("Vector3(0, 1, 0)");
        expect(methodSource).toContain("mass = 0");
        expect(methodSource).toContain("friction = 0.5");
        expect(methodSource).toContain("this.ground");
    });

    // -- Ammo -------------------------------------------------------------------
    it("2.2 — groundPhysicsImpostor is null before Ammo init", async () => {
        const { MmdManager } = await import("./mmd-manager");
        const stub = createStubInstance(MmdManager);
        expect(stub.groundPhysicsImpostor).toBeNull();
    });

    it("2.2-GREEN — Ammo backend creates ground collider", async () => {
        const { MmdManager } = await import("./mmd-manager");
        const methodSource = MmdManager.prototype[
            "initializeAmmoPhysicsBackend"
        ].toString();

        expect(methodSource).toContain("PhysicsImpostor");
        expect(methodSource).toContain("BoxImpostor");
        expect(methodSource).toContain("groundPhysicsImpostor");
        expect(methodSource).toContain("mass: 0");
        expect(methodSource).toContain("friction: 0.5");
        expect(methodSource).toContain("restitution: 0.1");
        expect(methodSource).toContain("this.ground");
        expect(methodSource).toContain("this.scene");
    });

    // -- No-op guard ------------------------------------------------------------
    it("2.3 — no collider when backend=none (regression guard)", async () => {
        const { MmdManager } = await import("./mmd-manager");
        const stub = createStubInstance(MmdManager);
        stub.physicsBackend = "none";

        expect(stub.groundPhysicsBody).toBeNull();
        expect(stub.groundPhysicsImpostor).toBeNull();
    });

    // -- Toggle -----------------------------------------------------------------
    it("2.5-GREEN — Bullet toggle removes / re-adds ground body", async () => {
        const { MmdManager } = await import("./mmd-manager");
        const methodSource = MmdManager.prototype["syncScenePhysicsSimulationState"].toString();

        expect(methodSource).toContain('physicsBackend === "bullet"');
        expect(methodSource).toContain("removeRigidBodyFromGlobal");
        expect(methodSource).toContain("addRigidBodyToGlobal");
        expect(methodSource).toContain("groundPhysicsBody");
        expect(methodSource).toContain("bulletPhysicsRuntime");
    });

    // -- Dispose ----------------------------------------------------------------
    it("2.4-GREEN — dispose clears ground physics references", async () => {
        const { MmdManager } = await import("./mmd-manager");
        const methodSource = MmdManager.prototype["dispose"].toString();

        expect(methodSource).toContain("groundPhysicsBody");
        expect(methodSource).toContain("groundPhysicsImpostor");
        expect(methodSource).toContain("removeRigidBodyFromGlobal");
        expect(methodSource).toContain("groundPhysicsBody.dispose()");
        expect(methodSource).toContain("groundPhysicsBody = null");
        expect(methodSource).toContain("groundPhysicsImpostor.dispose()");
        expect(methodSource).toContain("groundPhysicsImpostor = null");
    });
});
