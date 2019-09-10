import forEach from 'lodash/forEach'
import isEmpty from 'lodash/isEmpty'
import concat from 'lodash/concat'
import map from 'lodash/map'
import reduce from 'lodash/reduce'
import * as ast from './ast'

const END = 255

export const encode = (definition, keyMap, result = []) => {
  forEach(definition.selectionSet.selections, (field, index) => {
    const name = keyMap[field.name.value]
    if (name !== undefined) {
      result.push(name)
      if (field.arguments.length > 0)
        forEach(field.arguments, argument => {
          const argName = `${field.name.value}:${argument.name.value}:${argument.value.kind}`
          console.log(argName)
          if (argName !== undefined) {
            result.push(argName)
            result.push(argument.value.value) // FIXME Cast to bytes corresponding to type
          } else throw new Error(`Argument ${argument.name.value} is not present in the schema`)
        })
      // if (children = field.selectionSet && field.slectionSet.selections)
      //     result.push(field, keyMap, result)
    } else throw new Error(`Field ${field.name.value} is not present in the schema`)
  })
  result.push(END)
  return new Uint8Array(result)
}

export const decode = (byteArray, mapKey) => {
  const recursive = (bytes, index, accumulator, currentFieldWithArgs) => {
    const byte = bytes[index]
    if (byte === END)
      return accumulator
    const next = mapKey[byte]
    if (next !== undefined) {
      const [nextField, nextArg, nextKind] = next.split(':')
      if (nextArg) {
        if (!currentFieldWithArgs) // FIXME probably not neccessary
          currentFieldWithArgs = accumulator[accumulator.length - 1] // FIXME previous might be elsewhere
        currentFieldWithArgs.arguments.push(ast.argument(nextArg, nextKind, 1))
        index += 1 // FIXME increment to skip the value with proper value length
      } else {
        currentFieldWithArgs = null
        accumulator.push(ast.field(next))
      }
      return recursive(bytes, index + 1, accumulator, currentFieldWithArgs)
    } else throw new Error('Not present in scheme')

  }
  return recursive(byteArray, 0, [])
}

export const binaryToStringsReducer = (result, object) =>
  concat(
    result,
    object.name,
    map(object.args, arg => `${object.name}:${arg.name}:${arg.type.name + 'Value'}`))

export const mapBinaryToStrings = input => reduce(input, binaryToStringsReducer, [])

export const mapStringsToBinary = input =>
  reduce(mapBinaryToStrings(input), (result, value, index) => ({  ...result, [value]: index }), {})