const SCALAR = name => ({
  kind: 'Field',
  alias: undefined,
  name: { kind: 'Name', value: name, loc: undefined },
  arguments: [],
  directives: [],
  selectionSet: undefined,
  loc: undefined
})

const OBJECT = name => ({
  ...SCALAR(name),
  selectionSet: {
    kind: 'SelectionSet',
    selections: [],
    loc: undefined
  }
})

const ARGUMENT = (name, kind, value) => ({
  kind: 'Argument',
  name: { kind: 'Name', value: name, loc: undefined },
  value: {
    kind, value,
    loc: undefined,
    ...kind === 'StringValue' && { block: false }
  },
  loc: undefined
})

module.exports.SCALAR = SCALAR;
module.exports.OBJECT = OBJECT;
module.exports.ARGUMENT = ARGUMENT;