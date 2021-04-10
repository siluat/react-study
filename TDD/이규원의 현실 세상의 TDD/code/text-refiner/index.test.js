const faker = require("faker");
const sut = require("./index");

test.each`
  source                 | expected
  ${"hello  world"}      | ${"hello world"}
  ${"hello   world"}     | ${"hello world"}
  ${"hello    world"}    | ${"hello world"}
  ${"hello     world"}   | ${"hello world"}
  ${"hello      world"}  | ${"hello world"}
  ${"hello       world"} | ${"hello world"}
`('sut transforms "$source" to "$expected"', ({ source, expected }) => {
  const actual = sut(source);
  expect(actual).toBe(expected);
});

test.each`
  source             | expected
  ${"hello\t world"} | ${"hello world"}
  ${"hello \tworld"} | ${"hello world"}
`(
  'sut transforms "$source" that contains tab character to "$expected"',
  ({ source, expected }) => {
    const actual = sut(source);
    expect(actual).toBe(expected);
  }
);

test.each`
  source             | bannedWords              | expected
  ${"hello mockist"} | ${["mockist", "purist"]} | ${"hello *******"}
  ${"hello purist"}  | ${["mockist", "purist"]} | ${"hello ******"}
`(
  'sut transforms "$source" to "$expected"',
  ({ source, bannedWords, expected }) => {
    const actual = sut(source, { bannedWords });
    expect(actual).toBe(expected);
  }
);

describe("given banned word", () => {
  const bannedWord = faker.lorem.word();
  const masked = "*".repeat(bannedWord.length);
  const source = `hello ${bannedWord}`;
  const options = { bannedWords: [bannedWord] };

  test(`"${bannedWord}" when invoke sut then it returns "hello ${masked}"`, () => {
    const actual = sut(source, options);
    expect(actual).toBe(`hello ${masked}`);
  });
});

test.each`
  source            | expected
  ${" hello world"} | ${"hello world"}
`("sut correctly trims whitespaces", ({ source, expected }) => {
  const actual = sut(source);
  expect(actual).toBe(expected);
});
