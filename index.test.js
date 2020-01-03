const fs = require('fs');
const { assert } = require('chai');
const { parse, print } = require('graphql');
const compress = require('graphql-query-compress');

const { encode, decode } = require('./index');
const dictionary = require('src/dictionary');

it('can encode & decode query', async () => {
	const schema = fs.readFileSync(`${__dirname}/test/artifacts/test1/schema.graphql`, 'utf8');
	const query = fs.readFileSync(`${__dirname}/test/artifacts/test1/query.graphql`, 'utf8');
	const schemaObject = dictionary.buildSchema(schema);


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

// it('can encode & decode payload', async () => {
// 	const schema = fs.readFileSync(`${__dirname}/test/artifacts/test1/schema.graphql`, 'utf8');
// 	const query = fs.readFileSync(`${__dirname}/test/artifacts/test1/query.graphql`, 'utf8');
// 	const schemaObject = dictionary.buildSchema(schema);
//
// 	const parsedQuery = parse(query, {
// 		noLocation: true
// 	});
//
// 	const schemaDictionary = await dictionary.generate(schemaObject);
// 	const encoded = encode(parsedQuery, schemaDictionary);
// 	const decoded = decode(encoded, schemaDictionary);
//
// 	assert.notStrictEqual(decoded[0], parsedQuery.definitions[0].selectionSet.selections);
//
// 	const compressionRate = (compress(print(parsedQuery)).length / encoded.length).toPrecision(3);
//
// 	//Generated AST is valid. Query was x smaller in size
// 	assert(compressionRate > 2.6);
// });