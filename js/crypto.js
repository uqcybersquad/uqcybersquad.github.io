/* 
Original scrambler code written by Justin Windle
Source: https://codepen.io/soulwire/pen/mErPAK, taken 05/02/2020

Has been modified for use by UQ Cyber Squad
*/

class Scramble {
	constructor(element) {
		this.el = element;
		this.chars = 'abcdefghijklmnopqrstuvwxyz!<>-_\\/[]{}—=+*^?#________';
		this.update = this.update.bind(this);
	}

	setText(newText) {
		const oldText = this.el.textContent;

		// Set so the "newText is the message "

		const length = Math.max(oldText.length, newText.length);
		const promise = new Promise((resolve) => this.resolve = resolve);

		this.queue = [];
		for (let i = 0; i < length; i++) {
			const from = oldText[i] || '';
			const to = newText[i] || '';
			const start = Math.floor(Math.random() * 40);
			const end = start + Math.floor(Math.random() * 40);
			this.queue.push({ from, to, start, end});
		}

		cancelAnimationFrame(this.frameRequest);
		this.frame = 0;
		this.update();

		return promise;
	}

	update() {
		let output = '';
		let complete = 0;

		for (let i = 0, n = this.queue.length; i < n; i++) {
			let { from, to, start, end, char} = this.queue[i];

			if (this.frame >= end) {
				complete++;
				output += to;
			} else if (this.frame >= start) {
				if (!char || Math.random() < 0.28) {
					char = this.randomChar();
					this.queue[i].char = char;
				}
				output += char;
			} else {
				output += from;
			}
		} 

		let formatted_output = `<h3> ${output} </h3>`
		this.el.innerHTML = formatted_output;
		//this.el.textContent = formatted_output; //TODO: Way to have css persist w/out using unsafe innerHTML?
		//this.el.innerText = output;

		if (complete == this.queue.length) {
			this.resolve();
		} else {
			this.frameRequest = requestAnimationFrame(this.update);
			this.frame++;
		}
	}

	randomChar() {
		return this.chars[Math.floor(Math.random() * this.chars.length)];
	}
}

function generateRandomText(obj) {
	const length = obj.innerText.length;
	const alphabet = "abcdefghijklmnopqrstuvwxyz"

	let hiddenMsg = '';

	// Add characters to the message
	for (let i = 0; i < length; i++) {
		if (obj.innerHTML[i] == '\n') {
			console.log("A new line!");
			hiddenMsg += '\n';
		} else if (obj.innerHTML[i] == ' ') {
			hiddenMsg += ' ';
		} else {
			hiddenMsg += alphabet[Math.floor(Math.random() * alphabet.length)];
		}
		
	}

	console.log(hiddenMsg);

	return hiddenMsg;
}

// Create list of all 'crypto' on webpage to add effect to
let texts = document.querySelectorAll("div.crypto");
console.log(texts.length)
for (let i = 0; i < texts.length; i++) {
	let item = texts[i];

	item.setAttribute("data-original", item.innerText); //Eventually to be the 'hidden message' that gets shown
	item.setAttribute("data-obfuscated", generateRandomText(item)); 

	item.innerHTML = '<h3>' + item.getAttribute("data-obfuscated") + '</h3>';

	// Add listening for action
	item.addEventListener("mouseover", function() {
		helloThere(item);
	});	

	item.addEventListener("mouseout", function () {
		goodbyeThen(item);
	})
}

let textSet = false; // Sometimes resets originalText if flag not set

function helloThere(obj) {
	console.log("Hello there");

	if (!textSet) {

		//TODO: Flickers if mouse twitched when text changes
		
		const effects = new Scramble(obj);

		effects.setText(obj.getAttribute("data-original"));

		textSet = true;
		console.log(obj);
	}
}

function goodbyeThen(obj) {
	console.log("Goodbye then");

	if (textSet) {
		/*obj.innerHTML = '';
		obj.innerHTML = originalText;

		originalText = '';

		obj.style.color = '#33FF00';*/

		const effects = new Scramble(obj);
		effects.setText(obj.getAttribute("data-obfuscated"));
		textSet = false;
	}
}