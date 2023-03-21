<script>
	export let catchyMode, password_length, password_catchy;
	import { browser } from '$app/environment';

	import createCatchyPassword from '../helpers/catchyPassword';
	let separator = '-',
		catchyNumbers = 3,
		catchySymbols = false,
		catchyUppercase = true;

	if (browser) {
		if (localStorage.getItem('cosmoCatchyConfig')) {
			let settings = JSON.parse(localStorage.getItem('cosmoCatchyConfig'));
			password_length = settings.length;
			separator = settings.separator;
			catchyNumbers = settings.numbers;
			catchySymbols = settings.symbols;
			catchyUppercase = settings.uppercase;
		} else {
			localStorage.setItem(
				'cosmoCatchyConfig',
				JSON.stringify({
					length: password_length,
					separator: separator,
					numbers: catchyNumbers,
					symbols: catchySymbols,
					uppercase: catchyUppercase
				})
			);
		}
	}

	const catchyNumbersMax = 10;

	$: if (catchyMode) {
		password_catchy = createCatchyPassword(true, {
			catchySeparator: separator,
			catchyNumbers,
			catchySymbols,
			catchyUppercase
		});
	}
</script>

<fieldset
	class={`flex justify-between absolute transition-all w-full ${
		catchyMode ? '' : 'translate-x-[110%]'
	}`}
>
	<label>
		Separator:
		<input type="text" bind:value={separator} class="text-black w-[35px] text-center" />
	</label>
	<label>
		Uppercase:
		<input
			type="checkbox"
			value={catchyUppercase}
			bind:checked={catchyUppercase}
			class="charset_checkbox appearance-none relative w-5 h-5 bg-white border-none cursor-pointer outline-none before:w-full before:h-full before:absolute before:scale-0 checked:before:scale-100 transition-all duration-[150] hover:bg-gray-300 checked:!bg-purple-600 hover:checked:bg-purple-500"
		/>
	</label>
	<label>
		Symbols:
		<input
			type="checkbox"
			value={catchySymbols}
			bind:checked={catchySymbols}
			class="charset_checkbox appearance-none relative w-5 h-5 bg-white border-none cursor-pointer outline-none before:w-full before:h-full before:absolute before:scale-0 checked:before:scale-100 transition-all duration-[150] hover:bg-gray-300 checked:!bg-purple-600 hover:checked:bg-purple-500"
		/>
	</label>
	<label>
		Numbers:
		<input
			type="number"
			size="1"
			maxlength={catchyNumbersMax}
			bind:value={catchyNumbers}
			class="w-[30px] text-center text-black"
		/>
	</label>
</fieldset>

<style>
	label {
		display: flex;
		gap: 6px;
	}
	input[type='number']::-webkit-inner-spin-button {
		opacity: 1;
		-webkit-appearance: none;
	}
	/* === Checkboxes === */
	.charset_checkbox::before {
		background: url('../assets/icon_check.svg') no-repeat center center;
		background-size: 100%;
		transition: transform 0.05s ease-out;
	}
	:global(body.light-mode) .charset_checkbox,
	:global(body.light-mode) input {
		background: #c4c4fd;
	}
</style>
