<script>
	import { onMount } from 'svelte';
	import icon_arrow_clockwise from '../assets/icon_arrow_clockwise.svg';
	import icon_arrow_right from '../assets/icon_arrow_right.svg';
	import CatchyPassword from './CatchyPassword.svelte';
	import createCatchyPassword from '../helpers/catchyPassword';
	export let clipboardDialog;
	export let catchyMode = false;

	const CHARSET_UPERRCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const CHARSET_LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
	const CHARSET_NUMBER = '0123456789';
	const CHARSET_SPECIAL = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
	const INPUTS_CHARSET = {
		Uppercase: ['ABC', CHARSET_UPERRCASE],
		Lowercase: ['abc', CHARSET_LOWERCASE],
		Number: ['123', CHARSET_NUMBER],
		'Special characters': ['!@#', CHARSET_SPECIAL]
	};

	let password = '';
	let password_length = 28;
	let password_max_length = 40;
	let password_min_length = 3;
	let password_charset = [CHARSET_UPERRCASE, CHARSET_LOWERCASE, CHARSET_NUMBER, CHARSET_SPECIAL];
	let password_strength = { width: '', color: '' };
	let password_strength_values = {
		5: { width: '20%', color: '#dc2626' },
		10: { width: '40%', color: '#dc8426' },
		15: { width: '60%', color: '#dccd26' },
		20: { width: '80%', color: '#66dc26' },
		30: { width: '100%', color: 'linear-gradient(90deg, #9333ea, #4a53eb)' }
	};
	let password_catchy = '';
	const etest = 'afw';

	$: catchyMode ? (password_max_length = 10) : (password_max_length = 40);
	$: catchyMode ? (password_min_length = 1) : (password_min_length = 3);
	$: if (!catchyMode && password_length < 3) password_length = 3;

	function createPassword(animated = true) {
		for (let i = 0; i < password_length; i++) {
			let random_charset = password_charset[Math.floor(Math.random() * password_charset.length)];
			setTimeout(
				() => {
					password =
						password.slice(0, i) +
						random_charset[Math.floor(Math.random() * random_charset.length)] +
						password.slice(i + 1);
				},
				animated ? i * 15 : 0
			);

			if (i === password_length - 1) password = password.slice(0, i);
		}
		password_strength =
			password_strength_values[
				Object.keys(password_strength_values).reduce((a, b) =>
					Math.abs(b - password_length) < Math.abs(a - password_length) ? b : a
				)
			];
	}

	function setLocalStorage() {
		localStorage.setItem(
			'cosmoPasswordConfig',
			JSON.stringify({ password_length, password_charset, catchyMode })
		);
	}

	function handleCheck(e) {
		if (e.target.checked) {
			password_charset.push(e.target.value);
		} else {
			password_charset = password_charset.filter((item) => item !== e.target.value);
		}
		if (password_charset.length === 1) {
			document.querySelector(`.charset_checkbox[value="${password_charset[0]}"]`).disabled = true;
		} else {
			document.querySelectorAll('.charset_checkbox').forEach((item) => (item.disabled = false));
		}
		setLocalStorage();
		createPassword();
	}

	function handleClipboard() {
		navigator.clipboard.writeText(password);
		clipboardDialog.showModal();
		setTimeout(() => clipboardDialog.close(), 1100);
	}

	function handleKeydown(e) {
		if (e.key === 'Enter' || e.key === 'g') {
			createPassword();
		}
		if (e.key === ' ' || e.key === 'c') {
			handleClipboard();
		}
		if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
			password_length < password_max_length && password_length++;
			createPassword();
		}
		if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
			password_length > 1 && password_length--;
			createPassword();
		}
		if (e.key === '1') {
			document.querySelector(`.charset_checkbox[value="${CHARSET_UPERRCASE}"]`).click();
		}
		if (e.key === '2') {
			document.querySelector(`.charset_checkbox[value="${CHARSET_LOWERCASE}"]`).click();
		}
		if (e.key === '3') {
			document.querySelector(`.charset_checkbox[value="${CHARSET_NUMBER}"]`).click();
		}
		if (e.key === '4') {
			document.querySelector(`.charset_checkbox[value="${CHARSET_SPECIAL}"]`).click();
		}
	}

	function handleRange(e) {
		password_length = Number(e.target.value);
		setLocalStorage();
		catchyMode ? createCatchyPassword() : createPassword(false);
	}

	function handleSwitchMode() {
		catchyMode = !catchyMode;
		if (catchyMode) {
			password_length > 10 && (password_length = 5);
			password_catchy = createCatchyPassword();
		}
		setLocalStorage();
	}

	function handleColorChange(query, type = 'add') {
		document.querySelectorAll(query).forEach((item) => item.classList[type]('text-purple-600'));
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);
		if (localStorage.getItem('cosmoPasswordConfig')) {
			let config = JSON.parse(localStorage.getItem('cosmoPasswordConfig'));
			password_length = config.password_length;
			password_charset = config.password_charset;
			catchyMode = config.catchyMode;
		} else setLocalStorage();
		if (catchyMode) {
			password_length > 10 && (password_length = 5);
			password_catchy = createCatchyPassword();
		}
		createPassword();
	});

	$: console.log(password_catchy);
</script>

<form class="flex flex-col gap-2">
	<div
		class="password_container relative after:absolute after:h-[4px] after:transition-all"
		style={`--password_width: ${password_strength.width}; --password_color: ${password_strength.color}`}
	>
		<output
			class="bg-white block resize-none text-black w-full h-11 p-2 pl-3 pr-6 text-[15px] leading-[25px] truncate"
		>
			{#if catchyMode}
				{password_catchy}
			{:else}
				{#each password as char}
					<span
						class="transition-colors sm:text-lg font-medium charset_{[
							CHARSET_UPERRCASE,
							CHARSET_LOWERCASE,
							CHARSET_NUMBER,
							CHARSET_SPECIAL
						].findIndex((item) => item.includes(char)) + 1}">{char}</span
					>
				{/each}
			{/if}
		</output>
		<button
			type="button"
			title="Other Password"
			on:click={() => (catchyMode ? (password_catchy = createCatchyPassword()) : createPassword())}
			class="bg-white p-[10px] font-bold uppercase scale-90 absolute top-1/2 -translate-y-1/2 right-0 active:-rotate-180 hover:opacity-75 transition-all rounded-full"
		>
			<img src={icon_arrow_clockwise} alt="" class="w-6" />
		</button>
	</div>
	<span class=" mb-3 block">Length: {password_length}</span>

	<fieldset class="flex gap-2 items-center">
		<button
			type="button"
			disabled={password_length <= 3}
			title="Subtract one"
			on:click={() => {
				password_length--;
				createPassword();
			}}
			class={`bg-white w-7 aspect-square border-none rounded-full hover:scale-105 relative grid place-items-center after:absolute after:w-3/5 after:h-[2px] after:bg-black after:rounded-full ${
				password_length <= 3 ? 'opacity-50 hover:scale-100' : ''
			}`}
		/>
		<input
			type="range"
			min={password_min_length}
			max={password_max_length}
			value={password_length}
			on:input={handleRange}
			class="input_range cursor-pointer h-[6px] my-3 mx-0 w-full rounded-full focus:outline-none appearance-none"
			style={`--left-slider: ${Math.round(
				((password_length - password_min_length) * 100) /
					(password_max_length - password_min_length)
			)}`}
		/>
		<button
			type="button"
			disabled={password_length >= password_max_length}
			title="Add one"
			on:click={() => {
				password_length++;
				createPassword();
			}}
			class={`bg-white w-7 aspect-square  border-none rounded-full hover:scale-105 relative grid place-items-center after:absolute after:w-3/5 after:h-[2px] before:absolute before:w-3/5 before:h-[2px] before:rotate-90 before:left-1/2 before:-translate-x-1/2 before:bg-black after:bg-black after:rounded-full before:rounded-full ${
				password_length >= password_max_length ? 'opacity-50 hover:scale-100' : ''
			}`}
		/>
	</fieldset>

	<button
		type="button"
		class="text-white p-2 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 font-bold uppercase my-3 sm:my-5 w-full hover:opacity-95 bg-[length:300%_100%] hover:bg-[100%_0] transition-all duration-300 active:scale-95"
		on:click={handleClipboard}
		style="box-shadow: 0 0 15px #6447ea7a">Copy</button
	>

	<div>
		<fieldset
			class={`flex gap-2 text-lg flex-col sm:flex-row justify-between mt-2 transition-all w-full ${
				catchyMode ? 'translate-x-[-110%]' : ''
			}`}
		>
			<legend class="contents">Characters used:</legend>
			<div class="flex gap-5 justify-between">
				{#each Object.entries(INPUTS_CHARSET) as [Title, Value], i}
					<label
						class="cursor-pointer"
						title={Title}
						on:mouseover={() => handleColorChange(`.charset_${i + 1}`)}
						on:mouseout={() => handleColorChange(`.charset_${i + 1}`, 'remove')}
						on:focus={() => handleColorChange(`.charset_${i + 1}`)}
						on:blur={() => handleColorChange(`.charset_${i + 1}`, 'remove')}
					>
						<input
							type="checkbox"
							value={Value[1]}
							on:change={handleCheck}
							checked={password_charset.includes(Value[1])}
							class="charset_checkbox appearance-none relative size-6 mr-1 dark:bg-white border-none cursor-pointer outline-none before:w-full before:h-full before:absolute before:scale-0 checked:before:scale-100 transition-all duration-[150] hover:bg-gray-300 checked:!bg-purple-600 hover:checked:!bg-purple-500 "
						/>
						{Value[0]}
					</label>
				{/each}
			</div>
		</fieldset>
		<!-- <CatchyPassword bind:password_catchy {password_length} {catchyMode} /> -->
	</div>

	<!-- <div
		class="switchMode -bottom-3 -right-3 absolute hover:scale-105 active:scale-95 cursor-pointer h-8"
	>
		<button
			type="button"
			id="witchMode"
			on:click={handleSwitchMode}
			class=" bg-gradient-to-r from-purple-600 to-blue-600 rounded-full bg-[length:200%_100%] w-8 h-8 bottom-0 right-0 hover:scale-105 active:scale-95 transition-transform absolute"
			><img
				src={icon_arrow_right}
				alt=""
				class={`mx-auto w-3/5 transition-transform ${catchyMode ? 'rotate-180' : ''}`}
			/></button
		>
		<label
			for="witchMode"
			class="bg-[#35354e] w-0 absolute right-0 transition-all overflow-hidden rounded-full h-full px-4 text-[15px] inline-block cursor-pointer py-1 -z-10"
			style={`--maxWidth: ${catchyMode ? '11rem' : '12.5rem'}`}
		>
			{catchyMode ? 'Normal generator' : 'Passphrase generator'}
		</label>
	</div> -->
</form>

<style>
	.switchMode:hover label {
		width: var(--maxWidth);
	}
	:disabled {
		filter: grayscale(100%);
		cursor: not-allowed !important;
	}
	.password_container::after {
		width: var(--password_width);
		background: var(--password_color);
	}
	/* === Input === */
	.input_range {
		background: rgba(128, 128, 128, 0.6) linear-gradient(white, white) no-repeat;
		background-size: calc(var(--left-slider) * 1%) 100%;
	}
	.input_range::-webkit-slider-thumb {
		height: 36px;
		width: 36px;
		border-radius: 100%;
		cursor: ew-resize;
		-webkit-appearance: none;
		margin-top: -1px;
		transition: transform 0.2s ease;
		background: white url('../assets/icon_unfold_more.svg') no-repeat center;
		background-size: 100%;
	}
	.input_range:hover::-webkit-slider-thumb {
		transform: scale(1.05);
	}
	:global(body.light-mode) .input_range::-webkit-slider-thumb {
		background: #e4e4fd url('../assets/icon_unfold_more.svg') no-repeat center;
		background-size: 100%;
	}
	:global(body.light-mode) .input_range {
		background: rgba(128, 128, 128, 0.6) linear-gradient(#c4c4fd, #c4c4fd) no-repeat;
		background-size: calc(var(--left-slider) * 1%) 100%;
	}
	:global(body.light-mode) output {
		background: linear-gradient(#e7e7ff, #d5d5ff);
	}
	/* === Checkboxes === */
	.charset_checkbox::before {
		background: url('../assets/icon_check.svg') no-repeat center center;
		background-size: 100%;
		transition: transform 0.05s ease-out;
	}
	:global(body.light-mode) .charset_checkbox {
		background-color: rgb(148 163 184);
	}
</style>
