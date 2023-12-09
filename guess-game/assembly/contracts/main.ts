// The entry file of your WebAssembly module.
import { Context, Storage, transferCoins, unsafeRandom, generateEvent } from '@massalabs/massa-as-sdk';
import { Args, stringToBytes } from '@massalabs/as-types';


/**
 * define some constants
 */
const intervals: u32 = 20;
const attempts: u32 = 4;
const randomKey: string = 'random_key';
const attemptsKey: string = 'attempts_key';

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
  return [];
}

/**
 * This function starts the game by generating the random number
 * @param _ not applicable
 * @returns the emitted event serialized in bytes
 */
export function start(_: StaticArray<u8>): StaticArray<u8> {
  // const playerName = new Args(name).nextString().expect('missing player name');
  const start = u32(abs(unsafeRandom()) % (100 - intervals));
  const end = start + intervals;
  let randNumber = generateRandomNumber(start);
  Storage.set(randomKey, randNumber.toString());
  Storage.set(attemptsKey, attempts.toString());
  const response = `Guess the number between ${start} and ${end}. You have ${attempts} attempts!`;
  generateEvent(response);
  return stringToBytes(response);
}

/**
 * This function starts the game by generating the random number
 * @param name - player name
 * @returns the emitted event serialized in bytes
 */
export function play(data: StaticArray<u8>): StaticArray<u8> {
  // TODO: check if the guess number and number of attempts are made.

  const guessedNumber = new Args(data)
    .nextU32()
    .expect('missing guessed number');
  let currentRandom = u32.parse(Storage.get(randomKey));
  let currentAttempts = u32.parse(Storage.get(attemptsKey));
  let response: string;
  if (currentRandom == guessedNumber) {
    transferCoins(Context.caller(), 1_000_000_000);
    response = `Congrat! You have won the game!`;
    generateEvent(response);
    return stringToBytes(response);
  } else {
    currentAttempts--;
    if (currentAttempts == 0) {
      response = `Game is over! You lost the game! The correct number was ${currentRandom}.`;
      generateEvent(response);
      return stringToBytes(response);
    }
    response = `Try gain! You still have ${currentAttempts} attempts!`;
    Storage.set(attemptsKey, currentAttempts.toString());
    generateEvent(response);
    return stringToBytes(response);
  }
}

// Generate a random number.
function generateRandomNumber(start: u32): u32 {
  const randNumber = u32(start + (abs(unsafeRandom()) % intervals));
  return randNumber;
}
