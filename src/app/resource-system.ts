import { Cost } from './cost';

export interface ResourceSystem {
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