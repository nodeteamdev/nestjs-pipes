import parseObjectLiteral from "../../src/helpers/parse-object-literal";

describe('parseObjectLiteral', () => {
  it('should parse a string like "a: 1, b: 2" to [["a", "1"], ["b", "2"]]', () => {
    const obj = 'a: 1, b: 2';

    const result = parseObjectLiteral(obj);

    expect(result).toEqual([['a', '1'], ['b', '2']]);
  });

  it('should be defined', () => {
    expect(parseObjectLiteral).toBeDefined();
  });
});
