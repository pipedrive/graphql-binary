const { assert } = require('chai');
const { parse, print } = require('graphql');
const compress = require('graphql-query-compress');

const { encode, decode } = require('./index');
const dictionary = require('src/dictionary');

it('can encode & decode query', async () => {

	const schemaObject = dictionary.buildSchema(`
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

	const schemaDictionary = await dictionary.generate(schemaObject);
	const encoded = encode(parsedQuery, schemaDictionary);
	const decoded = decode(encoded, schemaDictionary);

	assert.notStrictEqual(decoded[0], parsedQuery.definitions[0].selectionSet.selections);

	const compressionRate = (compress(print(parsedQuery)).length / encoded.length).toPrecision(3);

	//Generated AST is valid. Query was x smaller in size
	assert(compressionRate > 2.6);
});