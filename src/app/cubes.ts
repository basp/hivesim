import { ResourceSystem } from './resource-system';
import { State } from './state';
import { Cost } from './cost';
import { dronesPerCube } from './common';

export class Cubes implements ResourceSystem {
  private show = false;
  constructor(private s: State) {}
  private nanoprobeCost() {
    return 500 * Math.pow(1.09, this.s.cubes);
  }
  private droneCost() {
    return 50 * Math.pow(1.15, this.s.cubes);
  }
  name() {
    return 'cubes';
  }
  num() {
    return this.s.cubes;
  }
  costs(): Cost[] {
    return [
      { amount: this.nanoprobeCost(), unit: 'nanoprobes' },
      { amount: this.droneCost(), unit: 'drones' },
    ];
  }
  enabled() {
    return this.s.drones >= this.droneCost() && 
      this.s.nanoprobes >= this.nanoprobeCost();
  }
  visible() {
    if (this.show) {
      return true;
    }
    if (this.s.drones < 10) {
      return false;
    }
    if (this.s.nanoprobes < 25) {
      return false;
    }
    this.show = true;
    return true;
  }
  buy() {
    this.s.nanoprobes -= this.nanoprobeCost();
    this.s.drones -= this.droneCost();
    this.s.cubes += 1;
  }
  bverb() {
    return 'construct';
  }
  dverb() {
    return 'assimilates';
  }
  update(t: number) {
    this.s.cubes += t * this.pps();
  }
  pps() {
    return this.s.factories * 0.01;
  }
  info() {
    return `Each cube ${this.dverb()} ${dronesPerCube} drone/sec.`;
  }
}
