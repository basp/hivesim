import { ResourceSystem } from './resource-system';
import { State } from './state';
import { Cost } from './cost';
import { nanoprobesPerDrone } from './common';

export class Drones implements ResourceSystem {
  private show = false;
  constructor(private s: State) {}
  private nanoprobeCost() {
    return 10 * Math.pow(1.001, this.s.drones);
  }
  name() {
    return 'drones';
  }
  num() {
    return this.s.drones;
  }
  costs(): Cost[] {
    return [
      { amount: this.nanoprobeCost(), unit: 'nanoprobes' },
    ];
  }
  enabled() {
    return this.s.nanoprobes >= this.nanoprobeCost();
  }
  visible() {
    if (this.show) {
      return true;
    }
    if (this.s.nanoprobes >= 5) {
      this.show = true;
    }
    return this.show;
  }
  buy() {
    this.s.nanoprobes -= this.nanoprobeCost();
    this.s.drones += 1;
  }
  bverb() {
    return 'assimilate';
  }
  dverb() {
    return 'assembles';
  }
  update(t: number) {
    this.s.drones += t * this.pps();
  }
  pps() {
    return this.s.cubes * 0.01;
  }
  info() {
    return `Each drone ${this.dverb()} ${nanoprobesPerDrone} nanoprobes/sec.`;
  }
}