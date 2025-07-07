//// presets for CT and MRI
//// presets for CT and MRI

var examtypes = {}; // empty object

// Default built-in exam types
examtypes.MRT_ITIS_15T = {
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

examtypes.MRT_ITIS_3T = {
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

examtypes.MRT_STRESS = {
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

examtypes.CT_KHK = { 
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

// Load custom exam types from storage
function loadCustomExamTypes() {
    return browser.storage.sync.get("customExamTypes")
        .then(result => {
            const customExamTypes = result.customExamTypes || {};

            // Add each custom exam type to the examtypes object
            for (const [name, values] of Object.entries(customExamTypes)) {
                examtypes[name] = values;
            }

            console.log("Loaded custom exam types:", Object.keys(customExamTypes));
            return customExamTypes;
        })
        .catch(error => {
            console.error("Error loading custom exam types:", error);
            return {};
        });
}



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
	console.log('uh oh, something went terribly wrong: The internet vanished. Earth is flat. The pope is muslim. Dolphins can fly. Please reload and give a second try');
}

// functions in content scripts cannot be called directly from page, so we need messaging to check which button was clicked 
window.addEventListener("message", function(event) {
	if (event.source == window &&
		event.data &&
		event.data.direction == "from-page") {
			// Handle exam type buttons
			if (event.data.message) {
				console.log("button " + event.data.message + " clicked");
				var mrtype = event.data.message; // cast into global scope 
				fill_myform(mrtype).then(highlight_findings, failure);
			}
			// Handle form management buttons
			else if (event.data.action) {
				console.log("form management action: " + event.data.action);
				switch (event.data.action) {
					case "captureForm":
						captureFormValues();
						break;
					case "saveForm":
						saveFormValues();
						break;
					case "manageForms":
						manageFormValues();
						break;
					default:
						console.log("Unknown action: " + event.data.action);
				}
			}
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

// Function to create buttons for all exam types (built-in and custom)
function createExamTypeButtons() {
    // Define predefined exam types
    const predefinedTypes = [
        { name: "MRT_ITIS_15T", label: "MR-ITIS 1,5T", color: "#ffffff" },
        { name: "MRT_ITIS_3T", label: "MR-ITIS 3T", color: "#ffffff" },
        { name: "MRT_STRESS", label: "MR-A-STRESS", color: "#ffffff" }
    ];

    // Start with empty buttons HTML
    let buttonsHtml = '';

    // Define colors for custom exam types
    const customColors = [
        "#e0f7fa", // Light cyan
        "#e8f5e9", // Light green
        "#fff8e1", // Light amber
        "#f3e5f5", // Light purple
        "#ffebee", // Light red
        "#e1f5fe", // Light blue
    ];

    // Load custom exam types and add buttons for them
    return loadCustomExamTypes().then(customExamTypes => {
        // Combine predefined and custom exam types
        const allExamTypes = [...predefinedTypes];

        // Add custom exam types with colors
        let colorIndex = 0;
        for (const name of Object.keys(customExamTypes)) {
            // Create a safe button label (first 15 chars of the name)
            const buttonLabel = name.length > 15 ? name.substring(0, 15) + '...' : name;

            // Assign a color from the array, cycling through them
            const color = customColors[colorIndex % customColors.length];
            colorIndex++;

            // Add to all exam types
            allExamTypes.push({ name, label: buttonLabel, color });
        }

        // Generate HTML for all buttons
        for (const examType of allExamTypes) {
            buttonsHtml += `
                <button style="background-color: ${examType.color}; margin-right: 5px; margin-bottom: 5px; border: 1px solid #ccc; border-radius: 3px; padding: 5px 10px; cursor: pointer;" 
                        onclick='window.postMessage({direction: "from-page", message: "${examType.name}"}, "*");'
                        title="${examType.name}">
                    ${examType.label}
                </button>
            `;
        }

        // Create the third cell with form management buttons
        const formManagementButtonsHtml = `
            <button style="margin-right: 5px; background-color: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;" 
                    onclick='window.postMessage({direction: "from-page", action: "captureForm"}, "*");' 
                    title="Capture current form values">
                Capture Form
            </button>
            <button style="margin-right: 5px; background-color: #2196F3; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;" 
                    onclick='window.postMessage({direction: "from-page", action: "saveForm"}, "*");' 
                    title="Save captured form values">
                Save Form
            </button>
            <button style="background-color: #FF9800; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;" 
                    onclick='window.postMessage({direction: "from-page", action: "manageForms"}, "*");' 
                    title="Manage saved forms">
                Manage Forms
            </button>
        `;

        // Create the complete selector HTML
        const selector = `<td>&nbsp;</td>
                        <td>${buttonsHtml}</td>
                        <td style="text-align: right; padding-right: 10px;">${formManagementButtonsHtml}</td>`;

        return selector;
    });


}


// Global variable to store captured form values
let capturedFormValues = null;

// Function to capture form values
function captureFormValues() {
    const form = document.getElementsByTagName("form")[0];
    if (!form) {
        showMessage("No form found on the current page.");
        return;
    }

    const formValues = {};

    // Process input fields, select fields, and textareas
    const elements = form.querySelectorAll("input, select, textarea");
    for (const element of elements) {
        if (!element.id && !element.name) continue;

        const fieldName = element.name || element.id;

        if (element.type === "checkbox" || element.type === "radio") {
            if (element.checked) {
                // For checkboxes with the same name, store as array
                if (element.name.endsWith("_") && formValues[fieldName]) {
                    if (!Array.isArray(formValues[fieldName])) {
                        formValues[fieldName] = [formValues[fieldName]];
                    }
                    formValues[fieldName].push(element.value);
                } else {
                    formValues[fieldName] = element.value;
                }
            }
        } else if (element.type === "select-multiple") {
            const selectedValues = Array.from(element.selectedOptions).map(option => option.value);
            formValues[fieldName] = selectedValues;
        } else {
            formValues[fieldName] = element.value;
        }
    }

    capturedFormValues = formValues;
    showMessage("Form values captured successfully!");
    console.log("Captured form values:", formValues);
}

// Function to save form values
function saveFormValues() {
    if (!capturedFormValues) {
        showMessage("Please capture form values first.");
        return;
    }

    // Prompt for a name
    const examTypeName = prompt("Enter a name for this form:", "");

    if (!examTypeName || examTypeName.trim() === "") {
        showMessage("Form save cancelled.");
        return;
    }

    // Get existing exam types or initialize empty object
    browser.storage.sync.get("customExamTypes")
        .then(result => {
            const customExamTypes = result.customExamTypes || {};

            // Check if name already exists
            if (customExamTypes[examTypeName]) {
                if (!confirm(`Exam type "${examTypeName}" already exists. Do you want to overwrite it?`)) {
                    return;
                }
            }

            // Save the new exam type
            customExamTypes[examTypeName] = capturedFormValues;

            return browser.storage.sync.set({ customExamTypes });
        })
        .then(() => {
            showMessage(`Exam type "${examTypeName}" saved successfully!`);
            // Reload custom exam types to update buttons
            return loadCustomExamTypes();
        })
        .catch(error => {
            console.error("Error saving exam type:", error);
            showMessage("Error saving exam type: " + error.message);
        });
}

// Function to manage form values
function manageFormValues() {
    // Create a modal dialog
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.4)';
    modal.style.zIndex = '1000';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#fefefe';
    modalContent.style.padding = '20px';
    modalContent.style.border = '1px solid #888';
    modalContent.style.width = '80%';
    modalContent.style.maxWidth = '600px';
    modalContent.style.maxHeight = '80%';
    modalContent.style.overflowY = 'auto';
    modalContent.style.borderRadius = '5px';

    // Add a close button
    const closeButton = document.createElement('span');
    closeButton.textContent = '×';
    closeButton.style.color = '#aaa';
    closeButton.style.float = 'right';
    closeButton.style.fontSize = '28px';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = function() {
        document.body.removeChild(modal);
    };

    // Add a title
    const title = document.createElement('h2');
    title.textContent = 'Manage Saved Forms';
    title.style.marginTop = '0';

    // Add a container for the list of saved forms
    const formsList = document.createElement('div');
    formsList.id = 'savedFormsList';

    // Add elements to the modal
    modalContent.appendChild(closeButton);
    modalContent.appendChild(title);
    modalContent.appendChild(formsList);
    modal.appendChild(modalContent);

    // Add the modal to the page
    document.body.appendChild(modal);

    // Load and display saved forms
    loadSavedForms(formsList);
}

// Function to load and display saved forms
function loadSavedForms(container) {
    browser.storage.sync.get("customExamTypes")
        .then(result => {
            const customExamTypes = result.customExamTypes || {};

            if (Object.keys(customExamTypes).length === 0) {
                container.innerHTML = "<p>No saved forms yet.</p>";
                return;
            }

            container.innerHTML = "";

            for (const [name, values] of Object.entries(customExamTypes)) {
                const formDiv = document.createElement('div');
                formDiv.style.padding = '10px';
                formDiv.style.marginBottom = '10px';
                formDiv.style.backgroundColor = '#f9f9f9';
                formDiv.style.borderRadius = '5px';
                formDiv.style.display = 'flex';
                formDiv.style.justifyContent = 'space-between';
                formDiv.style.alignItems = 'center';

                const formName = document.createElement('span');
                formName.textContent = name;
                formName.style.fontWeight = 'bold';

                const buttonsDiv = document.createElement('div');

                // Create load button
                const loadButton = document.createElement('button');
                loadButton.textContent = 'Load';
                loadButton.style.marginRight = '5px';
                loadButton.style.backgroundColor = '#4CAF50';
                loadButton.style.color = 'white';
                loadButton.style.border = 'none';
                loadButton.style.padding = '5px 10px';
                loadButton.style.borderRadius = '3px';
                loadButton.style.cursor = 'pointer';
                loadButton.onclick = function() {
                    fill_myform(name).then(highlight_findings, failure);
                    document.body.removeChild(formDiv.closest('#savedFormsList').closest('div').closest('div'));
                };

                // Create delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.style.backgroundColor = '#f44336';
                deleteButton.style.color = 'white';
                deleteButton.style.border = 'none';
                deleteButton.style.padding = '5px 10px';
                deleteButton.style.borderRadius = '3px';
                deleteButton.style.cursor = 'pointer';
                deleteButton.onclick = function() {
                    if (confirm(`Are you sure you want to delete the form "${name}"?`)) {
                        deleteForm(name, container);
                    }
                };

                buttonsDiv.appendChild(loadButton);
                buttonsDiv.appendChild(deleteButton);

                formDiv.appendChild(formName);
                formDiv.appendChild(buttonsDiv);

                container.appendChild(formDiv);
            }
        })
        .catch(error => {
            console.error("Error loading saved forms:", error);
            container.innerHTML = `<p>Error loading saved forms: ${error.message}</p>`;
        });
}

// Function to delete a saved form
function deleteForm(name, container) {
    browser.storage.sync.get("customExamTypes")
        .then(result => {
            const customExamTypes = result.customExamTypes || {};

            if (customExamTypes[name]) {
                delete customExamTypes[name];
                return browser.storage.sync.set({ customExamTypes });
            }
        })
        .then(() => {
            showMessage(`Form "${name}" deleted successfully!`);
            loadSavedForms(container);
        })
        .catch(error => {
            console.error("Error deleting form:", error);
            showMessage("Error deleting form: " + error.message);
        });
}

// Helper function to show temporary messages
function showMessage(message, duration = 3000) {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    messageDiv.style.padding = "10px";
    messageDiv.style.backgroundColor = "#4CAF50";
    messageDiv.style.color = "white";
    messageDiv.style.borderRadius = "5px";
    messageDiv.style.position = "fixed";
    messageDiv.style.top = "10px";
    messageDiv.style.right = "10px";
    messageDiv.style.zIndex = "1000";

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        if (document.body.contains(messageDiv)) {
            document.body.removeChild(messageDiv);
        }
    }, duration);
}

// Initialize the page based on form type
if(is_ct) {
    fill_myform('CT_KHK').then(highlight_findings, failure);
} else if(is_mr) {
    createExamTypeButtons().then(selector => {
        let target_tr = document.body.getElementsByTagName("table")[0].getElementsByTagName("tr")[1]; // get 2nd row in first table
        target_tr.innerHTML = selector;
    }).catch(error => {
        console.error("Error creating exam type buttons:", error);
        // Fallback to default buttons if there's an error
        const selector = `<td>&nbsp;</td>
                        <td>
                            <button style="background-color: #ffffff; margin-right: 5px; margin-bottom: 5px; border: 1px solid #ccc; border-radius: 3px; padding: 5px 10px; cursor: pointer;" 
                                    onclick='window.postMessage({direction: "from-page", message: "MRT_ITIS_15T"}, "*");'
                                    title="MRT_ITIS_15T">
                                MR-ITIS 1,5T
                            </button>
                            <button style="background-color: #ffffff; margin-right: 5px; margin-bottom: 5px; border: 1px solid #ccc; border-radius: 3px; padding: 5px 10px; cursor: pointer;" 
                                    onclick='window.postMessage({direction: "from-page", message: "MRT_ITIS_3T"}, "*");'
                                    title="MRT_ITIS_3T">
                                MR-ITIS 3T
                            </button>
                            <button style="background-color: #ffffff; margin-right: 5px; margin-bottom: 5px; border: 1px solid #ccc; border-radius: 3px; padding: 5px 10px; cursor: pointer;" 
                                    onclick='window.postMessage({direction: "from-page", message: "MRT_STRESS"}, "*");'
                                    title="MRT_STRESS">
                                MR-A-STRESS
                            </button>
                        </td>
                        <td style="text-align: right; padding-right: 10px;">
                            <button style="margin-right: 5px; background-color: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;" 
                                    onclick='window.postMessage({direction: "from-page", action: "captureForm"}, "*");' 
                                    title="Capture current form values">
                                Capture Form
                            </button>
                            <button style="margin-right: 5px; background-color: #2196F3; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;" 
                                    onclick='window.postMessage({direction: "from-page", action: "saveForm"}, "*");' 
                                    title="Save captured form values">
                                Save Form
                            </button>
                            <button style="background-color: #FF9800; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;" 
                                    onclick='window.postMessage({direction: "from-page", action: "manageForms"}, "*");' 
                                    title="Manage saved forms">
                                Manage Forms
                            </button>
                        </td>`;
        let target_tr = document.body.getElementsByTagName("table")[0].getElementsByTagName("tr")[1];
        target_tr.innerHTML = selector;
		target_tr.style.border = "1px solid red"; // Add a border to the row for visibility
    });
}
