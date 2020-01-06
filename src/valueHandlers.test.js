const { assert } = require('chai');

it('encodeValue() simple string', async () => {
	const { encodeValue } = require('./valueHandlers');

	let result = [];
	await encodeValue(
		'String',
		'hello',
		result
	);
	const expected = [6, 165, 104, 101, 108, 108, 111];

	assert.deepEqual(result, expected);
});