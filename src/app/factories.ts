import { ResourceSystem } from './resource-system';
import { State } from './state';
import { Cost } from './cost';
import { cubesPerFactory } from './common';

export class Factories implements ResourceSystem {
  private show = false;
  constructor(private s: State) {}
  private nanoprobeCost() {
    return 100000 * Math.pow(1.07, this.s.factories);
  }
  private droneCost() {
    return 10000 * Math.pow(1.10, this.s.factories);
  }
  name(): string {
    return 'factories';
  }
  costs(): Cost[] {
    return [
      { amount: this.nanoprobeCost(), unit: 'nanoprobes' },
      { amount: this.droneCost(), unit: 'drones' }
    ];
  }
  enabled(): boolean {
    return this.s.nanoprobes >= this.nanoprobeCost() &&
      this.s.drones >= this.droneCost();
  }
  visible() {
    if (this.show) { 
      return true;
    }
    if (this.s.drones <= 1000) {
      return false;
    }
    if (this.s.cubes <= 10) {
      return false;
    }
    this.show = true;
    return true;
  }
  buy(): void {
    this.s.nanoprobes -= this.nanoprobeCost();
    this.s.drones -= this.droneCost();
  }
  bverb(): string {
    return 'build';
  }
  dverb(): string {
    return 'constructs';
  }
  update(t: number): void {
  }
  pps(): number {
    return 0; 
  }
  num(): number {
    return this.s.factories;
  }
  info() {
    return `Each factory ${this.dverb()} ${cubesPerFactory} cube/sec`;
  }
}