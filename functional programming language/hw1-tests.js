tests(
  F,
  {
    name: 'plus',
    code: '6 * 7',
    expected: 42
  },
  {
    name: 'less than',
    code: '6 < 7',
    expected: true
  },
  {
    name: 'arithmetic and relational operators should require args to be numbers',
    code: '(fun x -> x) + 1',
    shouldThrow: true
  },
  {
    name: 'or',
    code: 'true || false',
    expected: true
  },
  {
    name: 'boolean operators should require args to be booleans',
    code: '(fun x -> x) || true',
    shouldThrow: true
  },
  {
    name: 'conditional',
    code: 'if 2 > 3 then 4321 else 1234',
    expected: 1234
  },
  {
    name: 'let',
    code: 'let x = 3 + 4 in\n' +
          '  x - 2',
    expected: 5
  },
  {
    name: 'unbound identifier',
    code: 'x + 1',
    shouldThrow: true
  },
  {
    name: 'fun and call',
    code: '(fun x -> x + 1) 3',
    expected: 4
  },
  {
    name: 'passing too many args is not OK',
    code: '(fun x -> x + 1) 3 4',
    shouldThrow: true
  },
  {
    name: 'nested funs',
    code: 'let add = fun x -> fun y -> x + y in\n' +
          '  let inc = add 1 in\n' +
          '    inc 10',
    expected: 11
  },

  {
    name: 'number',
    code: '1234',
    expected: 1234
  },
  {
    name: 'true',
    code: 'true',
    expected: true
  },
  {
    name: 'false',
    code: 'false',
    expected: false
  },
  {
    name: 'null',
    code: 'null',
    expected: null
  },
  {
    name: 'plus',
    code: '6 + 7',
    expected: 13
  },
  {
    name: 'minus',
    code: '6 - 7',
    expected: -1
  },
  {
    name: 'times',
    code: '6 * 7',
    expected: 42
  },
  {
    name: '/',
    code: '4/2',
    expected: 2
  },
  {
    name: '%',
    code: '4 % 2',
    expected: 0
  },
  {
    name: 'chaining',
    code: '1 + 2 * 3',
    expected: 7
  },
  {
    name: 'less than',
    code: '6 < 7',
    expected: true
  },
  {
    name: 'greater than',
    code: '7 > 6',
    expected: true
  },
  {
    name: 'equals',
    code: '1 = 1',
    expected: true
  },
  {
    name: 'not equals',
    code: '1 != 2',
    expected: true
  },
  {
    name: 'equality of functions (shallow)',
    code: 'let f = fun x -> 0 in ' +
          'let f2 = f in ' +
          'f = f2',
    expected: true
  },
  {
    name: 'inequality of functions (shallow)',
    code: 'let f  = fun x -> 0 in ' +
          'let f2 = fun x -> 0 in ' +
           'f != f2',
    expected: true
  },
  {
    name: 'arithmetic and relational operators should require args to be numbers',
    code: '(fun x -> x) + 1',
    shouldThrow: true
  },
  {
    name: 'or',
    code: 'true || false',
    expected: true
  },
  {
    name: 'boolean operators should require args to be booleans',
    code: '(fun x -> x) || true',
    shouldThrow: true
  },
  {
    name: 'conditional',
    code: 'if 2 > 3 then 4321 else 1234',
    expected: 1234
  },
  {
    name: 'let',
    code: 'let x = 3 + 4 in\n' +
          '  x - 2',
    expected: 5
  },
  {
    name: 'unbound identifier',
    code: 'x + 1',
    shouldThrow: true
  },
  {
    name: 'fun and call',
    code: '(fun x -> x + 1) 3',
    expected: 4
  },
  {
    name: 'passing too many args is not OK',
    code: '(fun x -> x + 1) 3 4',
    shouldThrow: true
  },
  {
    name: 'function with multiple parameters',
    code: '(fun x y -> x + y) 1 2',
    expected: 3
  },
  {
    name: 'nested funs',
    code: 'let add = fun x -> fun y -> x + y in\n' +
          '  let inc = add 1 in\n' +
          '    inc 10',
    expected: 11
  },
  {
    name: 'shadowing',
    code: 'let x = 1 in' +
          '(fun x -> x) 2 + x',
    expected: 3
  },
  {
    name: 'closure',
    code: 'let y = 1 in' +
          '(fun x -> x + y) 2',
    expected: 3
  },
  {
    name: 'local variables',
    code: 'let y = 1 in' +
          '(fun x -> x + y) 2 + x',
    shouldThrow: true
  },
  {
  name: 'if condtion must be boolean',
  code: 'if 0 then 1 else 2',
  shouldThrow: true
}

);

