import parseObjectLiteral from '../../src/helpers/parse-object-literal';

describe('parseObjectLiteral', () => {
  it('should parse a string with one key-value pair', () => {
    const input = 'a: 1';
    const expectedOutput = [['a', '1']];
    const actualOutput = parseObjectLiteral(input);
    expect(actualOutput).toEqual(expectedOutput);
  });

  it('should parse a string with multiple key-value pairs', () => {
    const input = 'a: 1, b: 2, c: 3';
    const expectedOutput = [['a', '1'], ['b', '2'], ['c', '3']];
    const actualOutput = parseObjectLiteral(input);
    expect(actualOutput).toEqual(expectedOutput);
  });

  it('should parse a string with a single-quoted value', () => {
    const input = 'a: \'1\'';
    const expectedOutput = [['a', '\'1\'']];
    const actualOutput = parseObjectLiteral(input);
    expect(actualOutput).toEqual(expectedOutput);
  });

  it('should parse a string with a double-quoted value', () => {
    const input = 'a: "1"';
    const expectedOutput = [['a', '"1"']];
    const actualOutput = parseObjectLiteral(input);
    expect(actualOutput).toEqual(expectedOutput);
  });
});
