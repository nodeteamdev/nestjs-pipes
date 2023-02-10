import { Test } from '@nestjs/testing';
import SelectPipe from '../../src/prisma/select.pipe';

describe('SelectPipe', () => {
  let pipe: SelectPipe;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [SelectPipe],
    }).compile();

    pipe = moduleRef.get<SelectPipe>(SelectPipe);
  });

  it('should transform string -user like { user:false }', () => {
    const value = '-user';

    const result = pipe.transform(value);

    expect(result).toEqual({
      user: false,
    });
  });

  it('should transform string user like { user:true }', () => {
    const value = 'user';

    const result = pipe.transform(value);

    expect(result).toEqual({
      user: true,
    });
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });
});
