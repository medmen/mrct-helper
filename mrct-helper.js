//// presets for CT and MRI
//// presets for CT and MRI

var examtypes = {}; // empty object

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
}

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
}

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
}

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
}

examtypes.CT_KHK = { 
	"suspcad":"",
	"patrisk":"medium",
	"stresstest":"ecg",
	"stresstestresults":"inconclusive",
	"fd_imagequality_":"good",
	"con_outcome":"yes",
	"con_outcomelst":"nofurtherdiagn",
	"com_ae_":"no",
	"cts_notdualsource":"no",
	"cts_csvlst":"64",
	"cts_namelst":"siemens_som_das",
	"cte_ae":"",
	"cte_premed":["nitrates", "betablockeroral"],
	"ecg_mhrlst_":"lt65",
	"ecg_hrlst":"sinusrhythm",
	"ctscs_fieldset":"",
	"ctscs_gating_":"prospective",
	"ctscc_fieldset":"",
	"ctscc_gating_":"prospective",
	"ctscc_cm":"yes",
	"ctscc":"iobitrol",
	"ctscc_iobitrol_":"xenetix",
	"ctscc_concentrcm":"350", 
	"ctscc_cm_amount":"120",
	"ctscc_cm_flowrate":"5",
	"pp_imagereconstr":"ir",
	"pp_imagereconstrlst":"safire",
	"pp_perf":"",
	"pp_perflst":["3d", "sc_mprs"],
	"rw_reporter_":"radiologist"
	};



function clearForm() {
	// save fields we dont want to reset
	const preserve_fields = ["examinedby", "examinationdate", "registry_id", "age", "gender", "weight", "height"];
	let preserve_obj = {};
	preserve_fields.forEach(function(item, index, array) {
		field = document.getElementById(item);
		if(field.type.match(/^select/)){
			preserve_obj[item] = field.options[field.selectedIndex].value;
		} else {
			preserve_obj[item] = field.value;
		}
	});
	console.log("preserving:");
	console.log(JSON.stringify(preserve_obj, null, 4));
	
	// reset the whole form
	document.getElementsByTagName("form")[0].reset();
	
	// restore saved fields
	Object.keys(preserve_obj).forEach(function(field_id){
		let field = document.getElementById(field_id);
		field.value = preserve_obj[field_id];
	});
}

function fill_myform(formtype){
	console.clear();
	console.log('formtype is: ' + formtype);
	return new Promise((resolve, reject) => {
		//resolve("SUCCESS")
		//reject("FAILURE")
		if(formtype === false) {
			reject("FAILURE");
		}
		else {
			if(typeof(examtypes[formtype]) === "object") {
				var examtyp = examtypes[formtype];
			} else {
				reject("FAILURE");
			}
		}
		
		var field = null;
		var fieldname = null;
		var fieldvalue = null;
		
		/***
		* before we fill the form, make sure to clear it. Otherwise hitting different buttons would clutter the form more and more.
		* DANGER: document.getElementsByTagName("form")[0].reset(); --> this will also delete patient data we entered before
		* So we need an extra function to handle this!
		*/
		clearForm();

		/**
		* Now loop through predefined fields and enter the corresponding predefined values
		**/
		Object.keys(examtyp).forEach(function(fieldname){
			fieldvalue = examtyp[fieldname];
			console.log(fieldname + ' - ' + fieldvalue);		
			// if last character in name is _, we need to get element(s) by name
			if (fieldname.slice(-1) === '_') { 
				let fields = document.getElementsByName(fieldname);
				for(field of fields) {
					enter_field(field, fieldname, fieldvalue);
				}
			} else {
				let field = document.getElementById(fieldname);
				// check if field is really an object, otherwise names that do not match would break the script soon
				if (typeof field !== 'object') {
					return; // no match found, leave this 
				}
				enter_field(field, fieldname, fieldvalue);
			}
		});
		resolve("SUCCESS");
	});
};

function enter_field(field, fieldname, fieldvalue) {
	var element_type = field.tagName;
	var subtype = field.type;
	console.log(fieldname + ' is of type ' + element_type + '( subtype: ' + subtype + ' )' );
	
	// set the value
	switch(subtype) {
		case 'checkbox':
			if(Array.isArray(fieldvalue)) { // check multiple boxes with same name
				fieldvalue.forEach(function(item, index, array) {
					if(field.value === item) {
						field.checked = false; // make sure the field is unselected, then simulate a click
						field.click();
						console.log('checkbox ' + fieldname + 'with value ' + item + ' checked..' );
					}
				});
			}
			else if(field.value === fieldvalue) {
				field.checked = false; // make sure the field is unselected, then simulate a click
				field.click();
				console.log('checkbox ' + fieldname + 'with value ' + fieldvalue + ' checked..' );
			}
			break;
			
		case 'radio':
			if(field.value === fieldvalue) {
				field.checked = false; // make sure the field is unselected, then simulate a click
				field.click();
				console.log('radiobutton ' + fieldname + 'with value ' + fieldvalue + ' klicked..' );			
			}
			break;
			
		// thx to https://stackoverflow.com/a/24946696 for showing howto match substrings
		case (subtype.match(/^select/) || {}).input:
			if(Array.isArray(fieldvalue)) { // select multiple options
				fieldvalue.forEach(function(item, index, array) {
					let opts = field.getElementsByTagName('option');
					// console.log(opts);
					for (let option of opts) {
						if(option.value === item) {
							option.selected = 'selected';
							console.log('in select ' + fieldname + ' we selected option ' + item);
						}
					}
				});
			} else { // select one option
				let opts = field.getElementsByTagName('option');
				// console.log(opts);
				for (let option of opts) {
					if(option.value === fieldvalue) {
						option.selected = 'selected';
						console.log('in select ' + fieldname + ' we selected option ' + fieldvalue);
					}
				}
			}
			break;
		
		case 'text':
			field.value = fieldvalue;
			console.log(' in text-field ' + fieldname + ' we entered value ' + fieldvalue);
			break;
			
		default: 
			console.log('NO MATCH for field type ' + subtype);
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

var is_mr = document.getElementById('mrs_fslst');
var is_ct = document.getElementById('cts_csvlst');

if(is_ct) {
	fill_myform('CT_KHK').then(highlight_findings, failure);
} else if(is_mr) {
	const selector = `<td>&nbsp;</td>
					<td>
						<button onclick='window.postMessage({direction: "from-page", message: "MRT_ITIS_15T"}, "*");'>MR-ITIS 1,5T</button>
						<button onclick='window.postMessage({direction: "from-page", message: "MRT_ITIS_3T"}, "*");'>MR-ITIS 3T</button>
						<button onclick='window.postMessage({direction: "from-page", message: "MRT_STRESS"}, "*");'>MR-A-STRESS</button>
					</td>
					<td>&nbsp;</td>`;
	let target_tr = document.body.getElementsByTagName("table")[0].getElementsByTagName("tr")[1]; // get 2nd row in first table
	target_tr.innerHTML = selector;	
} 
