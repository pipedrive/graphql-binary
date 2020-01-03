const { assert } = require('chai');

describe('dictionary', () => {
	it('generate() simple string', async () => {
		const dictionary = require('./dictionary');
		const input = dictionary.buildSchema(`
		type Query{
			hello: String
		}
		`);
		const output = await dictionary.generate(input);
		const expected = {
			Query: {
				decode: [
					{
						byte: 0,
						isArg: false,
						kind: 'SCALAR',
						name: 'hello',
						type: 'String',
					},
				],
				encode: {
					hello: {
						byte: 0,
						isArg: false,
						kind: 'SCALAR',
						name: 'hello',
						type: 'String',
					},
				},
			},

		};

		assert.deepEqual(output, expected);
	});

	it('generate() with arguments', async () => {
		const dictionary = require('./dictionary');
		const input = dictionary.buildSchema(`
		type Query{
			hello: Hello
		}
		
		type Hello{
			world(name:String): String
		}
		`);
		const output = await dictionary.generate(input);
		const expected = {
			Query: {
				decode: [
					{
						byte: 0,
						isArg: false,
						kind: 'OBJECT',
						name: 'hello',
						type: 'Hello',
					},
				],
				encode: {
					hello: {
						byte: 0,
						isArg: false,
						kind: 'OBJECT',
						name: 'hello',
						type: 'Hello',
					},
				},
			},

			Hello: {
				decode: [
					{
						"arguments": {
							"name": {
								"byte": 1,
								"isArg": true,
								"kind": "SCALAR",
								"name": "name",
								"type": "String",
							},
						},
						"byte": 0,
						"isArg": false,
						"kind": "SCALAR",
						"name": "world",
						"type": "String",
					},
					{
						"byte": 1,
						"isArg": true,
						"kind": "SCALAR",
						"name": "name",
						"type": "String",
					},
				],
				encode: {
					"world": {
						"arguments": {
							"name": {
								"byte": 1,
								"isArg": true,
								"kind": "SCALAR",
								"name": "name",
								"type": "String",
							},
						},
						"byte": 0,
						"isArg": false,
						"kind": "SCALAR",
						"name": "world",
						"type": "String",
					},
				},
			},

		};

		assert.deepEqual(output, expected);
	});
});