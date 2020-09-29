import { ResourceSystem } from './resource-system';
import { State } from './state';
import { Cost } from './cost';
import { nanoprobesPerDrone } from './common';

export class Nanoprobes implements ResourceSystem {
  constructor(private s: State) {}
  name() {
    return 'nanoprobes';
  }
  num() {
    return Math.floor(this.s.nanoprobes);
  }
  costs(): Cost[] {
    return [
      { amount: 1, unit: 'click' },
    ];
  }
  enabled() {
    return true;
  }
  visible() {
    return true;
  }
  buy(): void {
    this.s.nanoprobes += 1;
  }
  bverb() {
    return 'assemble';
  }
  dverb() {
    return 'assembles';
  }
  update(t: number): void {
    this.s.nanoprobes += t * this.pps();
  }
  pps() {
    return this.s.drones * nanoprobesPerDrone;
  }
  info() {
    return `Nanoprobes are made by us.`;
  }
}