import { SeedGroupValidator } from './seed-group-validator';

describe('SeedGroupValidator', () => {
  it('should create an instance', () => {
    expect(new SeedGroupValidator("")).toBeTruthy();
  });
});
