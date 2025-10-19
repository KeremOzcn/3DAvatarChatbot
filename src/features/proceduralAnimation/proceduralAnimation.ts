import * as THREE from "three";
import { VRM } from "@pixiv/three-vrm";

/**
 * Procedural animation controller for VRM models
 * Handles breathing, idle movements, and other procedural animations
 */
export class ProceduralAnimation {
  private vrm: VRM;
  private clock: THREE.Clock;
  private enabled: boolean = true;

  constructor(vrm: VRM) {
    this.vrm = vrm;
    this.clock = new THREE.Clock();
  }

  /**
   * Updates procedural animations
   * @param delta - Time delta in seconds
   */
  public update(delta: number): void {
    if (!this.enabled || !this.vrm) return;

    const time = this.clock.getElapsedTime();

    // Breathing animation
    this.updateBreathing(time);

    // Idle sway animation
    this.updateIdleSway(time);
  }

  /**
   * Updates breathing animation
   */
  private updateBreathing(time: number): void {
    const breathingSpeed = 2.0;
    const breathingAmount = 0.01;
    
    const breathingValue = Math.sin(time * breathingSpeed) * breathingAmount;
    
    // Apply breathing to chest/spine
    const spine = this.vrm.humanoid?.getNormalizedBoneNode("spine");
    if (spine) {
      spine.scale.y = 1 + breathingValue;
    }
  }

  /**
   * Updates idle sway animation
   */
  private updateIdleSway(time: number): void {
    const swaySpeed = 0.5;
    const swayAmount = 0.02;
    
    const swayValue = Math.sin(time * swaySpeed) * swayAmount;
    
    // Apply subtle sway to hips
    const hips = this.vrm.humanoid?.getNormalizedBoneNode("hips");
    if (hips) {
      hips.rotation.z = swayValue;
    }
  }

  /**
   * Enables or disables procedural animation
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Resets all procedural animations
   */
  public reset(): void {
    this.clock = new THREE.Clock();
  }
}
