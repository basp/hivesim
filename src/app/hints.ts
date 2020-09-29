import { System } from './system';
import { State } from './state';

export class Hints implements System {
  constructor(private s: State) {}
  update(t: number): void {
    if (this.s.nanoprobes >= 5) {
      this.s.hint = 'Drones can be assimilated to manufacture nanoprobes for us.';
    }
    if (this.s.drones >= 5) {
      this.s.hint = 'Eventually we can automate more.';
    }
    if (this.s.drones >= 10) {
      this.s.hint = 'Cubes are sent into space to assimilate more drones.';
    }
    if (this.s.cubes >= 1) {
      this.s.hint = null;
    }
  }
}