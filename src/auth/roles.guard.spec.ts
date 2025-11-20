import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = {
      get: jest.fn(),
      getAllAndOverride: jest.fn(),
    } as any;

    guard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
