export interface HeroSectionProps {
  modelCount: number;
  testCount: number;
  providerCount: number;
  lastUpdated: Date;
  /** Current time in ms (for purity); pass from parent so render stays pure. */
  nowMs?: number;
}
