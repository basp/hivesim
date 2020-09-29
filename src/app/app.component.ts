import { Component } from '@angular/core';
import { System } from './system'
import { State } from './state';

import { Hints } from './hints';
import { Nanoprobes } from './nanoprobes';
import { Drones } from './drones';
import { Cubes } from './cubes';
import { Factories } from './factories';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hivesim';

  state = new State();

  factories = new Factories(this.state);
  cubes = new Cubes(this.state);
  drones = new Drones(this.state);
  nanoprobes = new Nanoprobes(this.state);
  hints = new Hints(this.state);

  systems: System[] = [this.nanoprobes, this.drones, this.cubes, this.factories, this.hints];

  constructor() {
    let interval = 1000 / this.state.rate;
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