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
		const oldText = this.el.innerText;

		// Set so the "newText is the "

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

		/*let formatted_output = `<h1> ${output} </h1>`
		this.el.innerHTML = formatted_output;*/
		this.el.textContent = output;

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



// Create list of all 'terminals' on webpage to add effect to
let texts = document.querySelectorAll("div.terminal");
console.log(texts.length)
for (let i = 0; i < texts.length; i++) {
	let item = texts[i];

	item.setAttribute("data-original", item.textContent);

	console.log(item);

	//TODO: NEED TO SAVE ORIGINAL TEXT

	// Add listening for action
	item.addEventListener("mouseover", function() {
		helloThere(item);
	});	

	item.addEventListener("mouseout", function () {
		goodbyeThen(item);
	})
}


let originalText = '';
let textSet = false; // Sometimes resets originalText if flag not set

function helloThere(obj) {
	console.log("Hello there");

	if (!textSet) {

		//TODO: HAS TO START OFF OBFUSCATED THEN OMO BECOME NORMAL
		/*originalText = obj.innerHTML;*/
		const effects = new Scramble(obj);

		const newText = "This is a story all about how my life got flipped turned upside down"
		effects.setText(newText);


		/*originalText = obj.innerText;
		textSet = true;	
		obj.innerText = ''
		obj.innerText = 'Hello There';

		obj.style.color = 'yellow';*/
		textSet = true;
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
		effects.setText(obj.getAttribute("data-original"));
		textSet = false;
	}
}