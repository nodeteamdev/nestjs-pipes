import { Test } from '@nestjs/testing';
import OrderByPipe from '../../src/prisma/order-by.pipe';

describe('Order by pipe', () => {
  let pipe: OrderByPipe;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [OrderByPipe],
    }).compile();

    pipe = moduleRef.get<OrderByPipe>(OrderByPipe);
  });

  it('should convert value like "name:asc, address:desc" to { name: "asc", address: "desc" }', () => {
    const value = 'name:asc, address:desc';
    const result = pipe.transform(value);
    expect(result).toEqual({
      address: 'desc',
      name: 'asc',
    });
  });

  it('should convert values correctly when input contains a space before "asc" or "desc" ("name: asc, address: desc")', () => {
    const value = 'name: asc, address: desc';
    const result = pipe.transform(value);
    expect(result).toEqual({
      name: 'asc',
      address: 'desc',
    });
  });

  it('should throw error if value is empty', () => {
    expect.assertions(1);
    const value = '';
    try {
      pipe.transform(value);
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });

  it('should return values to lower case', () => {
    expect.assertions(1);
    const value = 'name:ASC, address:DESC';
    const result = pipe.transform(value);
    expect(result).toEqual({
      address: 'desc',
      name: 'asc',
    });
  });

  it('should throw an error if params not arc & desc', () => {
    const value = 'name:name, address:address';
    try {
      pipe.transform(value);
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });
});
