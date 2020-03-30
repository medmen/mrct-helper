//// presets for CT and MRI
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
	
function fill_myform(){
	var field = null;
	var fieldname = null;
	var fieldvalue = null;
	Object.keys(CT_KHK).forEach(function(fieldname){
		fieldvalue = CT_KHK[fieldname];
		console.log(fieldname + ' - ' + fieldvalue);
		
		// if last character in name is _, we need to get element(s) by name
		if (fieldname.slice(-1) === '_') { 
			fields = document.getElementsByName(fieldname);
			for(field of fields) {
				enter_field(field, fieldname, fieldvalue);
			}
		} else {
			field = document.getElementById(fieldname);
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
		if(Array.isArray(CT_KHK[fieldname])) { // select multiple options
			CT_KHK[fieldname].forEach(function(item, index, array) {
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


fill_myform();
// finally move to Section with ID finaldiagnosis
let findiag = document.getElementById("finaldiagnosis");
findiag.style.border = "thick solid #FF0000";
findiag.scrollIntoView({behavior: "smooth"}); 


/**
if (window.location.href === "https://www.mrct-registry.org/asenacgip/newpatient.pl") {
	document.addEventListener("DOMContentLoaded", function(event) { 
		fill_myform();
	});

	//Do what you want to do when the browser UI button is clicked.	
	browser.browserAction.onClicked.addListener(function(tab) {
		fill_myform();
	});
}
**/
