/**
 * declaration of examtypes and their corresponding fields and values,
 * it would be great to offload this into a separate file, but then we would need to import it
 * and that is not possible in content scripts, so we keep it here for now.
 */
var examtypes={}; // empty object

examtypes.MRT_VITAL_15T = {
	"diagnosis_":"viabilityassessment",
	"fd_imagequality_":"good",
	"outcome":"yes",
	"con_outcomelst":"nofurtherdiagn",
	"com_ae_":"no",
	"mrs_fslst":"1_5t",
	"mrs_lst":"siemens_magnetom_sytim",
	"mrexam_":["morphology", "cinemri"],
	"mrexm_cm":"yes",
	"mrexm_cmapp_":["lateenh"],
	"mrexm":"gadoterate",
	"mrexm_product":"dotavision",
	"mrexm_dist":"b_e_imaging",
	"mrexm_concentrcm":"0_1",
	"mrexm_examtime_":"lt30",
	"ecg_mhrlst_":"btw65_75",
	"ecg_hrlst":"sinusrhythm",
	"pp_perf":"",
	"pp_perflst":["ventrvolfunc", "musclecalc"],
	"rw_reporter_":"radiologist"
};

examtypes.MRT_ITIS_15T = {
	"suspmyocarditis_":"",
	"fd_imagequality_":"good",
	"outcome":"yes",
	"con_outcomelst":"nofurtherdiagn",
	"com_ae_":"no",
	"mrs_fslst":"1_5t",
	"mrs_lst":"siemens_magnetom_sytim",
	"mrexam_":["morphology", "cinemri", "edemaimg"],
	"mrexm_cm":"yes",
	"mrexm_cmapp_":["lateenh", "earlyenh"],
	"mrexm":"gadoterate",
	"mrexm_product":"dotavision",
	"mrexm_dist":"b_e_imaging",
	"mrexm_concentrcm":"0_1",
	"mrexm_examtime_":"btw30_60",
	"ecg_mhrlst_":"btw65_75",
	"ecg_hrlst":"sinusrhythm",
	"pp_perf":"",
	"pp_perflst":["ventrvolfunc", "musclecalc", "edemacalc"],
	"rw_reporter_":"radiologist"
};

examtypes.MRT_ITIS_3T = {
	"suspmyocarditis_":"",
	"fd_imagequality_":"good",
	"outcome":"yes",
	"con_outcomelst":"nofurtherdiagn",
	"com_ae_":"no",
	"mrs_fslst":"3t",
	"mrs_lst":"siemens_magnetom_verio",
	"mrexam_":["morphology", "cinemri", "edemaimg", "t1map", "t2map"],
	"mrexm_cm":"yes",
	"mrexm_cmapp_":"lateenh",
	"mrexm":"gadoterate",
	"mrexm_product":"dotavision",
	"mrexm_dist":"b_e_imaging",
	"mrexm_concentrcm":"0_1",
	"mrexm_examtime_":"btw30_60",
	"ecg_mhrlst_":"btw65_75",
	"ecg_hrlst":"sinusrhythm",
	"pp_perf":"",
	"pp_perflst":["ventrvolfunc", "musclecalc", "edemacalc", "t1mapping", "t2mapping"],
	"rw_reporter_":"radiologist"
};

examtypes.MRT_STRESS = {
	"knowncad_":"",
	"stresstest":"ecg",
	"stresstestresults":"inconclusive",
	"fd_imagequality_":"good",
	"outcome":"yes",
	"con_outcomelst":"impactintervproc",
	"com_ae_":"no",
	"mrs_fslst":"3t",
	"mrs_lst":"siemens_magnetom_verio",
	"mrexam_":["morphology", "cinemri"],
	"mrexm_cm":"yes",
	"mrexm_cmapp_":["lateenh", "mrprest", "mrpadenosine"],
	"mrexm":"gd_dota",
	"mrexm_product":"dotarem",
	"mrexm_dist":"guerbet",
	"mrexm_concentrcm":"0_1",
	"mrexm_examtime_":"btw30_60",
	"ecg_mhrlst_":"btw65_75",
	"ecg_hrlst":"sinusrhythm",
	"pp_perf":"",
	"pp_perflst":["ventrvolfunc", "musclecalc"],
	"rw_reporter_":"radiologist"
};

examtypes.CT_KHK = {
	"cad":"yes",
	"suspected":"yes",
	"patient_risk":"ptp2024_15_50",
	"ecg":"yes",
	"fd_image_quality_":"good",
	"con_outcome_ct":"yes",
	"con_outcome_option":"nofurtherdiagn",
	"com_adverse_events_":"no",
	"cts_scanner_name":"80ee3b80-49a1-49ca-a493-99e8b9a6a1d0",
	"cte_premed_enabled":"yes",
	"cte_premed":["nitrates", "betablockeroral"],
	"ecg_mhrlst_":"lt65",
	"ecg_hrlst":"sinusrhythm",
	"ctscs_fieldset":"yes",
	"ctscs_gating_":"prospective",
	"ctscc_fieldset":"yes",
	"ctscc_gating_":"prospective",
	"ctscc_data_acquisition":"single_energy",
	"ctscc_cm_protocol":"fixed",
	"ctscc_cm_phases":"monophasic",
	"ctscc_cm_type":"xenetix||guerbet",
	"ctscc_concentrcm":"350",
	"ctscc_cm_amount":"120",
	"ctscc_cm_flowrate":"5",
	"pp_imagereconstr_ir":"yes",
	"pp_imagereconstrlst":"safire",
	"pp_perf":"yes",
	"pp_perflst":["3d", "mpr", "cpr", "vrt"],
	"rw_reporter_":"radiologist"
};

function waitForElement(selector, timeout = 500) {
	return new Promise((resolve) => {
		let el = selector.startsWith('#')
			? document.getElementById(selector.slice(1))
			: document.querySelector(selector);
		if (el) {
			return resolve(el);
		}

		const observer = new MutationObserver((mutations, obs) => {
			let element = selector.startsWith('#')
				? document.getElementById(selector.slice(1))
				: document.querySelector(selector);
			if (element) {
				obs.disconnect();
				resolve(element);
			}
		});

		observer.observe(document.body || document.documentElement, {
			childList: true,
			subtree: true
		});

		setTimeout(() => {
			observer.disconnect();
			resolve(null);
		}, timeout);
	});
}

function clearForm() {
	// save fields we dont want to reset
	const preserve_fields = ["exam_date", "patient_registry_id", "patient_setting", "patient_age", "patient_gender", "patient_weight", "patient_height"];
	let preserve_obj = {};
	preserve_fields.forEach(function(item, index, array) {
		let field = document.getElementById(item);
		if (field && field.type) {
			if (field.type.match(/^select/)) {
				preserve_obj[item] = field.options && field.selectedIndex >= 0 ? field.options[field.selectedIndex].value : field.value;
			} else {
				preserve_obj[item] = field.value;
			}
		} else if (field) {
			preserve_obj[item] = field.value;
		} else {
			console.warn("Field with ID " + item + " not found in the form.");
		}
	});
	console.log("preserving:");
	console.log(JSON.stringify(preserve_obj, null, 4));
	
	// reset the whole form
	let form = document.getElementsByTagName("form")[0];
	if (form) {
		form.reset();
	}
	
	// restore saved fields
	Object.keys(preserve_obj).forEach(function(field_id){
		let field = document.getElementById(field_id);
		if (field) {
			field.value = preserve_obj[field_id];
		}
	});
}

async function fill_myform(formtype) {
	console.log('formtype is: ' + formtype);
	if (!formtype || typeof examtypes[formtype] !== "object") {
		console.error("Invalid form type: " + formtype);
		throw new Error("FAILURE");
	}

	const examtyp = examtypes[formtype];

	for (const fieldname of Object.keys(examtyp)) {
		const fieldvalue = examtyp[fieldname];
		console.log("filling " + fieldname + ' with value ' + fieldvalue);

		if (fieldname.slice(-1) === '_') {
			// For named groups (e.g., radio buttons or multi-checkboxes)
			let fields = document.getElementsByName(fieldname);
			if (!fields || fields.length === 0) {
				// Wait briefly if dynamic
				await waitForElement(`[name="${fieldname}"]`, 500);
				fields = document.getElementsByName(fieldname);
			}
			for (let field of fields) {
				if (field && typeof field === 'object') {
					enter_field(field, fieldname, fieldvalue);
				}
			}
		} else {
			// Resolve element dynamically by ID (handles #cad and Vue conditional nodes)
			let field = document.getElementById(fieldname);
			if (!field) {
				field = await waitForElement(`#${fieldname}`, 500);
			}
			if (field) {
				enter_field(field, fieldname, fieldvalue);
			} else {
				console.warn("Field with ID " + fieldname + " not found within timeout.");
			}
		}
	}

	return "SUCCESS";
}

function enter_field(field, fieldname, fieldvalue) {
	console.log("in enter_field we try filling " + fieldname + ' with value ' + fieldvalue);
	if (!field || typeof field !== 'object') {
		console.warn("Field with name " + fieldname + " is not an object.");
		return;
	}

	var element_type = field.tagName;
	var subtype = field.type;
	console.log(fieldname + ' is of type ' + element_type + '( subtype: ' + subtype + ' )');

	// set the value
	switch (subtype) {
		case 'checkbox':
			if (Array.isArray(fieldvalue)) { // check multiple boxes with same name
				fieldvalue.forEach(function(item) {
					if (field.value === item) {
						field.checked = true;
						field.dispatchEvent(new Event('input', { bubbles: true }));
						field.dispatchEvent(new Event('change', { bubbles: true }));
						console.log('checkbox ' + fieldname + ' with value ' + item + ' checked..');
					}
				});
			} else if (field.value === fieldvalue || fieldvalue === "yes" || fieldvalue === true) {
				field.checked = true;
				field.dispatchEvent(new Event('input', { bubbles: true }));
				field.dispatchEvent(new Event('change', { bubbles: true }));
				console.log('checkbox ' + fieldname + ' with value ' + fieldvalue + ' checked..');
			} else {
				console.log('checkbox ' + fieldname + ' with value ' + fieldvalue + ' not found..');
			}
			break;

		case 'radio':
			if (field.value === fieldvalue) {
				field.checked = true;
				field.dispatchEvent(new Event('input', { bubbles: true }));
				field.dispatchEvent(new Event('change', { bubbles: true }));
				console.log('radiobutton ' + fieldname + ' with value ' + fieldvalue + ' klicked..');
			}
			break;

		// thx to https://stackoverflow.com/a/24946696 for showing howto match substrings
		case (subtype.match(/^select/) || {}).input:
			if (Array.isArray(fieldvalue)) { // select multiple options
				for (let option of field.getElementsByTagName('option')) {
					if (fieldvalue.includes(option.value)) {
						option.selected = true;
						console.log('in select ' + fieldname + ' we selected option ' + option.value);
					}
				}
			} else { // select one option
				for (let option of field.getElementsByTagName('option')) {
					if (option.value === fieldvalue) {
						option.selected = true;
						console.log('in select ' + fieldname + ' we selected option ' + fieldvalue);
					}
				}
			}
			field.dispatchEvent(new Event('input', { bubbles: true }));
			field.dispatchEvent(new Event('change', { bubbles: true }));
			break;

		case 'text':
		default:
			field.value = fieldvalue;
			field.dispatchEvent(new Event('input', { bubbles: true }));
			field.dispatchEvent(new Event('change', { bubbles: true }));
			console.log('in text-field ' + fieldname + ' we entered value ' + fieldvalue);
			break;
	}
}


function highlight_findings() {
	// finally move to Section with ID finaldiagnosis
	let findiag = document.getElementById("finaldiagnosis");
	findiag.style.border = "thick solid #FF0000";
	findiag.scrollIntoView({behavior: "smooth"}); 	
}

function failure(){
	console.log('uh oh, something went terribly wrong: The internet vanished. Earth is flat. The pope is muslim. Please reload and give a second try');
}

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

/****
* the main part:
*
* check if we are on a CT or MRI form
* CT forms get executed right away.
* for MRI forms we need selections, so we inject buttons into the page
* clicking a button sends a message to the listener above which will trigger the correspondig MRI-form to be used.
**/

function handleModalitySelection() {
	var modality_selector = document.getElementById('form-type-select');
	if (!modality_selector || modality_selector.selectedIndex < 0) {
		console.log('modality selector not found or no selection made');
		return;
	}

	var selected_modality = modality_selector.options[modality_selector.selectedIndex].text;
	console.log('selected modality: ' + modality_selector.selectedIndex);
	console.log('selected modality is: ' + selected_modality);

	if (selected_modality.startsWith("CT")) {
		fill_myform('CT_KHK').then(highlight_findings, failure);

	} else if (selected_modality.startsWith("MR")) {
		// Avoid duplicate button elements
		if (document.getElementById("mrct-helper-buttons")) {
			return;
		}

		let selector_td = document.createElement("td");
		selector_td.id = "mrct-helper-buttons";
		selector_td.innerHTML = `<button onclick='window.postMessage({direction: "from-page", message: "MRT_VITAL_15T"}, "*");'>MR-VITAL 1,5T</button>
<button onclick='window.postMessage({direction: "from-page", message: "MRT_ITIS_3T"}, "*");'>MR-ITIS 3T</button>
<button onclick='window.postMessage({direction: "from-page", message: "MRT_STRESS"}, "*");'>MR-A-STRESS</button>`;

		let target_tr = document.getElementsByTagName("table")[0]?.getElementsByTagName("tr")[1];
		let target_td = target_tr?.getElementsByTagName("td")[1];
		if (target_td) {
			target_td.replaceWith(selector_td);
		}
	}
}

function initHelper() {
	var modality_selector = document.getElementById('form-type-select');
	if (modality_selector) {
		modality_selector.addEventListener('change', handleModalitySelection);
		modality_selector.addEventListener('click', handleModalitySelection);
	} else {
		console.log("modality selector not found");
	}
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initHelper);
} else {
	initHelper();
}