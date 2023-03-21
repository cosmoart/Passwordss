import words from './words.json'
import { browser } from "$app/environment"

let passwordString, length, separator, numbers, symbols, uppercase

if (browser) {
	if (localStorage.cosmoCatchyConfig) {
		const settings = JSON.parse(localStorage.cosmoCatchyConfig)
		length = settings.length
		separator = settings.separator
		numbers = settings.numbers
		symbols = settings.symbols
		uppercase = settings.uppercase
	}
}

let alredyNumers = false
let password = []

const SYMBOLS = {
	a: '@',
	e: '3',
	i: '!',
	o: '0',
	s: '$',
	t: '7'
}

export default function createCatchyPassword (edit = false, options) {
	console.log(edit)
	if (options) {
		console.log(options)
		const { wordsLength, catchySeparator, catchyNumbers, catchySymbols, catchyUppercase } = options
		length = wordsLength
		separator = catchySeparator
		numbers = catchyNumbers
		symbols = catchySymbols
		uppercase = catchyUppercase
	}

	if (edit) return editCatchyPassword()

	password = []
	for (let i = 0; i < length; i++) {
		password.push(words.en[Math.floor(Math.random() * words.en.length)])
	}

	return editCatchyPassword()
}

export function editCatchyPassword () {
	console.log(password)
	if (numbers > 0 && !alredyNumers) {
		alredyNumers = true
		const START = Math.random() > 0.5
		let number = ''
		for (let i = 0; i < numbers; i++) {
			number += Math.floor(Math.random() * 10)
		}
		if (START) password.unshift(number)
		else password.push(number)
	}

	if (symbols) {
		password.forEach((word, i) => {
			password[i] = word.replaceAll(/[aeios]/g, (match) => SYMBOLS[match])
		})
	}

	if (uppercase) {
		password.forEach((word, i) => {
			password[i] = word[0].toUpperCase() + word.slice(1)
		})
	}

	passwordString = password.join(separator)
	return passwordString
}
