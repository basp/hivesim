import { Component } from '@angular/core';

interface System {
  update(t: number): void;
}

interface ResourceSystem {
  name(): string;
  costs(): Cost[];
  enabled(): boolean;
  visible(): boolean;
  buy(): void;
  bverb(): string;
  update(t: number): void;
  pps(): number;
  num(): number;
  info(): string;
}

interface Cost {
  amount: number;
  unit: string;
}

class State {
  public hint = "We have no drones so we need to assemble nanoprobes manually.";
  public nanoprobes = 0;
  public drones = 0;
  public cubes = 0;
  public factories = 0;
  public spaceports = 0;
}

const nanoprobesPerDrone = 0.1;
const dronesPerCube = 0.01;
const cubesPerFactory = 0.01;

class Hints implements System {
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

class Nanoprobes implements ResourceSystem {
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

class Drones implements ResourceSystem {
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

class Cubes implements ResourceSystem {
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

class Factories implements ResourceSystem {
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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hivesim';
  rate = 5;

  state = new State();

  factories = new Factories(this.state);
  cubes = new Cubes(this.state);
  drones = new Drones(this.state);
  nanoprobes = new Nanoprobes(this.state);
  hints = new Hints(this.state);

  systems: System[] = [this.nanoprobes, this.drones, this.cubes, this.factories, this.hints];

  constructor() {
    let interval = 1000 / this.rate;
    var prev = performance.now();
    setInterval(() => {
      let now = performance.now();
      let dt = now - prev;
      prev = now;
      let t = dt / 1000;
      this.update(t);
    }, interval);
  }

  update(t: number) {
    this.systems.forEach(sys => {
      sys.update(t);
    });
  }
}
