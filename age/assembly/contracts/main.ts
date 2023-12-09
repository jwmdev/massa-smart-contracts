// The entry file of your WebAssembly module.
import { Context,   Storage,  generateEvent } from '@massalabs/massa-as-sdk';
import { Args, stringToBytes } from '@massalabs/as-types';

/**
 * This function is meant to be called only one time: when the contract is deployed.
 *
 * @param binaryArgs - Arguments serialized with Args
 */
export function constructor(binaryArgs: StaticArray<u8>): StaticArray<u8> {
  // This line is important. It ensures that this function can't be called in the future.
  // If you remove this check, someone could call your constructor function and reset your smart contract.
  if (!Context.isDeployingContract()) {
    return [];
  }
  const argsDeser = new Args(binaryArgs);
  const name = argsDeser
    .nextString()
    .expect('Name argument is missing or invalid');
  generateEvent(`Constructor called with name ${name}`);

  let userName = new Args().add('alice'); // We create our 'name' key for the person's entry.
  let age = new Args().add(1 as u32); // We create our 'age' value for the person's entry.

  Storage.set(userName.serialize(), age.serialize()); // Here we apply our key/value pair to the storage.
 

  return [];
}


/**
 * This functions changes the age of someone by a given name and a given new age value.
 *
 * @remarks
 *  If the entry doesn't exist the person is created.
 *  It also generates an event that indicates the changes that are made.
 *
 * @param _args - The serialized arguments that should contain 'name' and 'age'.
 *
 * @returns none
 *
 */
export function changeAge(_args: StaticArray<u8>): void {
  let args = new Args(_args); // First we deserialize our arguments.

  // We use 'next[Type]()' to retrieve the next argument in the serialized arguments.
  let name = args.nextString().expect('Missing name argument.');
  // We use 'expect()' to check if the argument exists, if not we abort the execution.
  let age = args.nextU32().expect('Missing age argument.');

  // Then we create our key/value pair and store it.
  let ageEncoded = new Args().add(age).serialize();
  let nameEncoded = new Args().add(name).serialize();

  Storage.set(nameEncoded, ageEncoded);

  // Here we generate an event that indicates the changes that are made.
  generateEvent("Changed age of '" + name + "' to '" + age.toString() + "'");
}

/**
 * This functions retrieves the age of someone by a given name.
 *
 * @remarks
 *  If the entry doesn't exist the execution is aborted.
 *
 * @param args - The serialized arguments that should contain 'name'.
 *
 * @returns The serialized 'age' found.
 *
 */
export function getAge(_args: StaticArray<u8>): StaticArray<u8> {
  let args = new Args(_args); // First we deserialize our arguments.

  // We use 'expect()' to check if the argument exists, if not we abort the execution.
  let name = args.nextString().expect('Missing name argument.');
  // Then we create our encoded key from the function's argument.
  let nameEncoded = new Args().add(name).serialize();

  if (Storage.has(nameEncoded)) {
    // We check if the entry exists.
    let age = Storage.get(nameEncoded);
    // We get the associated value and return it.
    // Since the return type of 'Storage.get' is 'StaticArray<u8>' it is already serialized.
    return age;
  } else {
    // If the entry doesn't exist we abort the execution.
    abort("No such person's age is stored.");
    // We still need to return due AssemblyScript compiler.
    return [];
  }
}
