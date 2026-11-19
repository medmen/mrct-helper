function highlight_findings() {
	// finally move to Section with ID finaldiagnosis
	let findiag = document.getElementById("finaldiagnosis");
	if (findiag) {
		findiag.style.border = "thick solid #FF0000";
		if (typeof findiag.scrollIntoView === 'function') {
			findiag.scrollIntoView({behavior: "smooth"}); 	
		}
	}
}

function failure(){
	console.log('uh oh, something went terribly wrong: The internet vanished. Earth is flat. The pope is muslim. Please reload and give a second try');
}

/**
 * Finds the "New Examination" breadcrumb element in the DOM.
 *
 * @returns {Element|null} The "New Examination" element, breadcrumb nav, or null.
 */
function findNewExamBreadcrumb() {
	if (typeof document === 'undefined') return null;
	const breadcrumbNav = (document.querySelector && document.querySelector('nav[aria-label="Breadcrumb"]')) ||
		(document.querySelector && document.querySelector('nav')) ||
		(document.querySelector && document.querySelector('.breadcrumb'));

	if (!breadcrumbNav) return null;

	if (typeof breadcrumbNav.querySelectorAll === 'function') {
		const elements = Array.from(breadcrumbNav.querySelectorAll('span, a, div, li, p'));
		const match = elements.find(el => {
			const text = (el.textContent || '').trim().toLowerCase();
			return text === 'new examination';
		}) || elements.find(el => {
			const text = (el.textContent || '').trim().toLowerCase();
			return text.includes('new examination');
		});
		if (match) return match;
	}

	return breadcrumbNav;
}


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

	if (typeof filterPresetButtons === 'function') {
		filterPresetButtons(modality);
	}

	if (modality.startsWith("CT")) {
		const mrButtons = document.getElementById("mrct-helper-buttons");
		if (mrButtons && mrButtons.style) {
			mrButtons.style.display = "none";
		}
		setTimeout(() => {
			if (typeof fill_myform === 'function') {
				fill_myform('CT_KHK').catch(error => {
					console.error("Could not fill CT_KHK form.", error);
				});
			}
		}, 0);
	} else if (modality.startsWith("MR")) {
		// Avoid duplicate button elements
		const existingButtons = document.getElementById("mrct-helper-buttons");
		if (existingButtons) {
			if (existingButtons.style) {
				existingButtons.style.display = "";
			}
			return;
		}

		if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
			return;
		}

		let selector_div = document.createElement("div");
		selector_div.id = "mrct-helper-buttons";
		selector_div.className = "inline-flex items-center ml-2";

		const button = document.createElement("button");
		button.type = "button";
		button.className = "px-3 py-1 bg-gray-200 text-gray-800 text-sm font-medium rounded hover:bg-gray-300 focus:outline-none mr-2";
		button.textContent = "MRT-VITAL 1,5T";
		button.addEventListener('click', () => {
			if (typeof fill_myform === 'function') {
				fill_myform('MRT_VITAL_15T').then(highlight_findings, failure);
			}
			if (typeof window !== 'undefined' && typeof window.postMessage === 'function') {
				window.postMessage({direction: "from-page", message: "MRT_VITAL_15T"}, "*");
			}
		});
		selector_div.appendChild(button);

		const breadcrumbTarget = findNewExamBreadcrumb();
		if (breadcrumbTarget) {
			if (typeof breadcrumbTarget.after === 'function') {
				breadcrumbTarget.after(selector_div);
			} else if (breadcrumbTarget.parentNode && typeof breadcrumbTarget.parentNode.insertBefore === 'function') {
				breadcrumbTarget.parentNode.insertBefore(selector_div, breadcrumbTarget.nextSibling);
			} else if (typeof breadcrumbTarget.appendChild === 'function') {
				breadcrumbTarget.appendChild(selector_div);
			}
		} else {
			let target = document.getElementById('app') || (document.body || null);
			if (target && typeof target.insertBefore === 'function') {
				target.insertBefore(selector_div, target.firstChild);
			}
		}
	}
}


async function initHelper() {
	try {
		const modality_selector = await waitForElement('#form-type-select');
		if (modality_selector) {
			modality_selector.addEventListener('change', (event) => {
				console.log("Selected:", event.target.value);
				handleModalitySelection(event.target.value);
			});
		}
	} catch (error) {
		console.log("modality selector not found", error);
	}
}

if (typeof document !== 'undefined') {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initHelper);
	} else {
		initHelper();
	}
}

if (typeof module !== 'undefined' && module.exports) {
	module.exports = {
		highlight_findings,
		failure,
		findNewExamBreadcrumb,
		handleModalitySelection,
		initHelper
	};
}