function highlight_findings() {
	// finally move to Section with ID finaldiagnosis
	let findiag = document.getElementById("finaldiagnosis");
	findiag.style.border = "thick solid #FF0000";
	findiag.scrollIntoView({behavior: "smooth"}); 	
}

function failure(){
	console.log('uh oh, something went terribly wrong: The internet vanished. Earth is flat. The pope is muslim. Please reload and give a second try');
}

/**
// functions in content scripts cannot be called directly from page, so we need messaging to check which mri-button was clicked 
console.log('adding listener for messages from page');
window.addEventListener("message", function(event) {
	if (event.source == window &&
		event.data &&
		event.data.direction == "from-page") {
			console.log("button " + event.data.message + " clicked");
			var mrtype = event.data.message; // cast into global scope 
			fill_myform(mrtype).then(highlight_findings, failure);
		}
});
**/

/****
* the main part:
*
* check if we are on a CT or MRI form
* CT forms get executed right away.
* for MRI forms we need selections, so we inject buttons into the page
* clicking a button sends a message to the listener above which will trigger the correspondig MRI-form to be used.
**/

function handleModalitySelection(modality) {
	console.log('selected modality is: ' + modality);

	if (modality.startsWith("CT")) {
		setTimeout(() => {
			fill_myform('CT_KHK').catch(error => {
				console.error("Could not fill CT_KHK form.", error);
			});
		}, 0);
	} else if (modality.startsWith("MR")) {
		// Avoid duplicate button elements
		if (document.getElementById("mrct-helper-buttons")) {
			return;
		}

		let selector_div = document.createElement("div");
		selector_div.id = "mrct-helper-buttons";

		const button = document.createElement("button");
		button.type = "button";
		button.textContent = "MRT-VITAL 1,5T";
		button.addEventListener('click', () => {
			window.postMessage({direction: "from-page", message: "MRT_VITAL_15T"}, "*");
		});
		selector_div.appendChild(button);

		const button2 = document.createElement("button");
		button2.type = "button";
		button2.textContent = "MRT_ITIS_3T";
		button2.addEventListener('click', () => {
			window.postMessage({direction: "from-page", message: "MRT_ITIS_3T"}, "*");
		});
		selector_div.appendChild(button2);

		const button3 = document.createElement("button");
		button3.type = "button";
		button3.textContent = "MRT-STRESS";
		button3.addEventListener('click', () => {
			window.postMessage({direction: "from-page", message: "MRT_STRESS"}, "*");
		});
		selector_div.appendChild(button3);

		let target = document.getElementById('app');
		target.insertBefore(selector_div, target.firstChild);
	}
}


function initHelper() {
	const modality_selector = document.getElementById('form-type-select');
	if (modality_selector) {
		modality_selector.addEventListener('change', (event) => {
			console.log("Selected:", event.target.value);
			handleModalitySelection(event.target.value);
		});
	} else {
		console.log("modality selector not found");
	}
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initHelper);
} else {
	initHelper();
}