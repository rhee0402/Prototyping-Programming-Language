// Initialize the class table!

OO.initializeCT();

// Tests for Part II

tests(O,
  {
    name: 'thenElse (1/2)',
    code: 'def True then tb else fb = tb.call();\n' +
          'def False then tb else fb = fb.call();\n' +
          '1 > 2 then {111} else {222}',
    expected: 222
  },
  {
    name: 'thenElse (2/2)',
    code: 'def True then tb else fb = tb.call();\n' +
          'def False then tb else fb = fb.call();\n' +
          '1 < 2 then {111} else {222}',
    expected: 111
  },
  {
    name: 'non-local return',
    code: 'def Object.m() {\n' +
          '  var b = { return 5; };\n' +
          ' return this.n(b) * 2;\n' +
          '}\n\n' +
          'def Object.n(aBlock) {\n' +
          '  aBlock.call();\n' +
          '  return 42;\n' +
          '}\n\n' +
          'new Object().m()',
    expected: 5
  }
,
  /* by David Torosyan */
  {
    name: 'implicit return',
    code: '{ var x = 1; x + 2; var y = 2;}.call()\n',
    expected: 3
  },
   {
    name: 'null return block',
    code: '{}.call()\n',
    expected: null
  },
   {
    name: 'recursive non-local return',
    code: 'def True then tb else fb = tb.call();\n' + 
          'def False then tb else fb = fb.call();\n' + 
          '\n' + 
          'def Object.foo(first) {\n' + 
          '  first\n' + 
          '    then { this.bar(); }\n' + 
          '    else { \n' + 
          '      var b =  {return 5;}; \n' + 
          '      return b;\n' + 
          '    }\n' + 
          '}\n' + 
          '\n' + 
          'def Object.bar() {\n' + 
          '  this.foo(false).call();\n' + 
          '}\n' + 
          '\n' + 
          'new Object().foo(true)\n',
    shouldThrow: true
  },
  {
    name: 'floating this',
    code: 'this;\n',
    shouldThrow: true
  },
  {
    name: 'floating super',
    code: 'super.foo();\n',
    shouldThrow: true
  },
  {
    name: 'Object super',
    code: 'def Object.foo() { return super.foo(); };\n',
    shouldThrow: true
  }
);

