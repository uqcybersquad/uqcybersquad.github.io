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

		console.log("The heading: ", this.el.getAttribute("data-header-0"));
		let formatted_output = `<${this.el.getAttribute("data-header-0")}> ${output} </${this.el.getAttribute("data-heading-0")}>` // Very hacky way of doing
		
		this.el.innerHTML = formatted_output;

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
			hiddenMsg += '\n';
		} else if (obj.innerHTML[i] == ' ') {
			hiddenMsg += ' ';
		} else {
			let newLetter = alphabet[Math.floor(Math.random() * alphabet.length)].toUpperCase();
			/*if (obj.innerHTML[i] != obj.innerHTML[i].toUpperCase()) {
				hiddenMsg += newLetter.toUpperCase();
			} else {
				hiddenMsg += newLetter;
			}*/
			hiddenMsg += newLetter;
		}
		
	}

	console.log(hiddenMsg);

	return hiddenMsg;
}

// Create list of all 'crypto' on webpage to add effect to
let texts = document.querySelectorAll("div.crypto");

for (let i = 0; i < texts.length; i++) {
    let item = texts[i];
    let els = item.children;

    console.log("Has this mamy kids: ", els.length);

	// Initialise meta-data about elements in crypto div
    for (let j = 0; j < els.length; j++) {
        let el = els[j];
		item.setAttribute(`data-header-${j}`, el.localName);
        item.setAttribute(`data-header-${j}-collections`, `class="${el.className}" id="${el.id}"`);

        item.setAttribute(`data-header-${j}-original`, el.innerText);
        item.setAttribute(`data-header-${j}-obfuscated`, generateRandomText(el));
        
    }
    item.setAttribute("data-header-count", els.length);
	
	console.log(item);
	
	// Set text to be obfuscated
	for (let j = 0; j < els.length; j++) {

		els[j].textContent = item.getAttribute(`data-header-${j}-obfuscated`);

		console.log("Actual class: " + els[j].className);
		console.log("Persisting id: " + els[j].id);
		console.log("Generated: " + `<${item.getAttribute(`data-header-${j}`)} ${item.getAttribute(`data-header-${j}-collections`)}>` + 
			item.getAttribute(`data-header-${j}-obfuscated`) + `</${item.getAttribute(`data-header-${j}`)}>`)
	}

	// Add listening for action
	item.addEventListener("mouseenter", function() {
		helloThere(item);
	});	

	item.addEventListener("mouseleave", function () {
		goodbyeThen(item);
	})
}

let textSet = false; // Stop from continuing in loop

function helloThere(obj) {
	console.log("Hello there");

	if (!textSet) {
		//TODO: Flickers if mouse sits on text while changing - more prominent in chrome than firefox
		
		els = obj.children;

		for (let i = 0; i < els.length; i++) {
			const effects = new Scramble(els[i]);
			effects.setText(obj.getAttribute(`data-header-${i}-original`));
		}

		textSet = true;

		console.log("After changes:");
		console.log(obj);
	}
}

function goodbyeThen(obj) {
	console.log("Goodbye then");

	if (textSet) {	

		els = obj.children;

		for (let i = 0; i < els.length; i++) {
			const effects = new Scramble(els[i]);
			effects.setText(obj.getAttribute(`data-header-${i}-obfuscated`));
		}

		textSet = false;
	}
}