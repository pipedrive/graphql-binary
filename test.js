const { buildSchema, parse, print } = require('graphql');
const generate = require('./dictionary');
const compress = require('graphql-query-compress');
const { encode, decode } = require('./index');
const isEqual = require('lodash/isEqual');

const schema = buildSchema(`
  input YellosArgs {
    test: String
  }
  type Name {
    text: String
    url: String
  }
  type Entity {
    id: Int
    name: Name
  }
  type Query {
    hello: Entity,
    yello(arg1: Int arg2: String): String
    hellos: [Entity]
    yellos(arg2: YellosArgs arg3: String): [String]
  }
`)

const query = `
{
  hello { id }
  hellos { id name { text url } }
  yello(arg1: 1 arg2: "testasd")
  yellos
}`


const parsedQuery = parse(query, {
	noLocation: true
})
// const schemaQueryFields = schema.getQueryType().getFields()

generate(schema)
	.then(parsedScheme => {
		const encoded = encode(parsedQuery, parsedScheme)
		const decoded = decode(encoded, parsedScheme)

		const valuesToCompare = [
			decoded[0],
			parsedQuery.definitions[0].selectionSet.selections
		]
		const test = isEqual(valuesToCompare[0], valuesToCompare[1])
		console.log(
			test
				? `Generated AST is valid. Query was ${(compress(print(parsedQuery)).length / encoded.length).toPrecision(3)} smaller in size`
				: 'Generated AST is invalid')
	})