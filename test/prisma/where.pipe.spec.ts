import { Test } from '@nestjs/testing';
import WherePipe from '../../src/prisma/where.pipe';

describe('WherePipe', () => {
  let pipe: WherePipe;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [WherePipe],
    }).compile();

    pipe = moduleRef.get<WherePipe>(WherePipe);
  });

  it('if transform value is empty pipe return empty json', () => {
    const result = pipe.transform('');
    expect(result).toEqual({});
  });

  it('if transform value is date should return parsed date', () => {
    const date = `date:${Date.now()}`;
    expect(pipe.transform(date)).toEqual({
      date: expect.any(String),
    });
  });

  it('if transform value is float should return parsed float', () => {
    const float = 'number: 0.0005';
    expect(pipe.transform(float)).toEqual({
      number: '0.0005',
    });
  });

  it('if transform value is string should return parsed string', () => {
    const user = 'userName: name';
    expect(pipe.transform(user)).toEqual({
      userName: 'name',
    });
  });

  it('if transform value is boolean should return parsed boolean', () => {
    const question = 'quest: true';
    expect(pipe.transform(question)).toEqual({
      quest: 'true',
    });
  });

  it('if transform value is integer should return parsed int', () => {
    const integer = 'number: 5';
    expect(pipe.transform(integer)).toEqual({
      number: '5',
    });
  });

  it('if transform value is array should return [in: array] ', () => {
    const string = 'zipCode: in array(int(111), int(222))';

    expect(pipe.transform(string)).toEqual({
      zipCode: {
        in: [111, 222]
      },
    });
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });
});
