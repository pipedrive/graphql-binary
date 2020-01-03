const { assert } = require('chai');
const { buildSchema, parse, print } = require('graphql');
const compress = require('graphql-query-compress');

const { encode, decode } = require('./index');
const generate = require('src/dictionary');

describe('tests', () => {
	it('can encode & decode query', async () => {

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
`);

		const query = `
{
  hello { id }
  hellos { id name { text url } }
  yello(arg1: 1 arg2: "testasd")
  yellos
}`;


		const parsedQuery = parse(query, {
			noLocation: true
		});

		const parsedScheme = await generate(schema);
		const encoded = encode(parsedQuery, parsedScheme);
		const decoded = decode(encoded, parsedScheme);

		const valuesToCompare = [
			decoded[0],
			parsedQuery.definitions[0].selectionSet.selections
		];

		assert.notStrictEqual(valuesToCompare[0], valuesToCompare[1]);

		console.log(`Generated AST is valid. Query was ${(compress(print(parsedQuery)).length / encoded.length).toPrecision(3)} smaller in size`);
	});
});