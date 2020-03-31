//// presets for CT and MRI
//// presets for CT and MRI

var MRT_ITIS_15T = {
	"suspcad":"",
	"patrisk":"medium",
	"stresstest":"ecg",
	"stresstestresults":"inconclusive",
	"fd_imagequality_":"good",
	"outcome":"yes",
	"con_outcomelst":"nofurtherdiagn",
	"com_ae_":"no",
	"mrs_fslst":"1_5t",
	"mrs_lst":"siemens_magnetom_sytim",
	"mrexam_":["morphology", "cinemri", "edemaimg"],
	"mrexm_cm":"yes",
	"mrexm_cmapp_":["lateenh", "earlyenh"],
	"mrexm":"gd_dota",
	"mrexm_product":"dotarem",
	"mrexm_dist":"guerbet",
	"mrexm_concentrcm":"0_1", 
	"mrexm_examtime_":"btw30_60",
	"ecg_mhrlst_":"btw65_75",
	"ecg_hrlst":"sinusrhythm",
	"pp_perf":"",
	"pp_perflst":["ventrvolfunc", "musclecalc", "edemacalc"],
	"rw_reporter_":"radiologist",
	"consultants":"aschuster_si"	
}

var MRT_ITIS_3T = {
	"suspcad":"",
	"patrisk":"medium",
	"stresstest":"ecg",
	"stresstestresults":"inconclusive",
	"fd_imagequality_":"good",
	"outcome":"yes",
	"con_outcomelst":"nofurtherdiagn",
	"com_ae_":"no",
	"mrs_fslst":"3t",
	"mrs_lst":"siemens_magnetom_verio",
	"mrexam_":["morphology", "cinemri", "edemaimg", "t1map", "t2map"],
	"mrexm_cm":"yes",
	"mrexm_cmapp_":"lateenh",
	"mrexm":"gd_dota",
	"mrexm_product":"dotarem",
	"mrexm_dist":"guerbet",
	"mrexm_concentrcm":"0_1", 
	"mrexm_examtime_":"btw30_60",
	"ecg_mhrlst_":"btw65_75",
	"ecg_hrlst":"sinusrhythm",
	"pp_perf":"",
	"pp_perflst":["ventrvolfunc", "musclecalc", "edemacalc", "t1mapping", "t2mapping"],
	"rw_reporter_":"radiologist",
	"consultants":"aschuster_si"	
}

var MRT_STRESS = {
	"suspcad":"",
	"patrisk":"medium",
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
	"rw_reporter_":"radiologist",
	"consultants":"aschuster_si"	
}

var CT_KHK = { 
	"suspcad":"",
	"patrisk":"low",
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
	"ctscc":"iomeprol",
	"ctscc_iomeprol":"imeron",
	"ctscc_concentrcm":"350", 
	"ctscc_cm_amount":"120",
	"ctscc_cm_flowrate":"5",
	"pp_imagereconstr":"ir",
	"pp_imagereconstrlst":"safire",
	"pp_perf":"",
	"pp_perflst":["3d", "sc_mprs"],
	"rw_reporter_":"radiologist",
	"consultants":"akiessling_dsw"
	};
	
function fill_myform(formtype){
	if(formtype === false) {
		return;
	} else {
		formtype = window[formtype]; // turn string into variable, see https://stackoverflow.com/questions/5613834/convert-string-to-variable-name-in-javascript
	}
	
	var field = null;
	var fieldname = null;
	var fieldvalue = null;
	
	Object.keys(formtype).forEach(function(fieldname){
		fieldvalue = formtype[fieldname];
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
};

function enter_field(field, fieldname, fieldvalue) {
	var element_type = field.tagName;
	var subtype = field.type;
	console.log(fieldname + ' is of type ' + element_type + '( subtype: ' + subtype + ' )' );
	
	// set the value
	if(subtype === 'checkbox') {
		if(field.value === fieldvalue) {
			//field.checked = true;
			field.click();
			console.log('checkbox ' + fieldname + 'with value ' + fieldvalue + ' checked..' );			
		}
	} 
	
	if(subtype === 'radio') {
		if(field.value === fieldvalue) {
			//field.checked = true;
			field.click();
			console.log('radiobutton ' + fieldname + 'with value ' + fieldvalue + ' klicked..' );			
		}
	} 
	
	if(subtype.slice(0,6)  === 'select') {		
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
	}
	
	if(subtype === 'text'){
		field.value = fieldvalue;
		console.log(' in text-field ' + fieldname + ' we entered value ' + fieldvalue);
	}							
}


function highlight_findings() {
	// finally move to Section with ID finaldiagnosis
	let findiag = document.getElementById("finaldiagnosis");
	findiag.style.border = "thick solid #FF0000";
	findiag.scrollIntoView({behavior: "smooth"}); 	
}


document.addEventListener("DOMContentLoaded", function(event) { 
	let formtype = false;
	let is_mr = document.getElementById('mrs_fslst');
	let is_ct = document.getElementById('cts_csvlst');

	if(is_ct) {
		fill_myform('CT_KHK').then(highlight_findings());
	} else if(is_mr) {
		let selector = `<td>&nbsp;</td>
						<td>
							<button onclick="fill_myform('MRT_ITIS_15T')">MR-ITIS 1,5T</button>
							<button onclick="fill_myform('MRT_ITIS_3T')">MR-ITIS 3T</button>
							<button onclick="fill_myform('MRT_STRESS')">MR-A-STRESS</button>
						</td>
						<td>&nbsp;</td>`;
						//td><button onclick="fill_myform('MRT_STRESS').then(highlight_findings())">MR-A-STRESS</button> </td>`;
		let target_tr = document.body.getElementsByTagName("table")[0].getElementsByTagName("tr")[3]; // get third row in first table
		target_tr.innerHTML = selector;	
	} else {
		alert('Weder CT noch MRT gefunden :-(');
	}
});
