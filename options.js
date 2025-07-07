// Default exam types
function defaultOptionsCT() {
    var options = {
        "suspcad":             "",
        "patrisk":             "low",
        "stresstest":          "ecg",
        "stresstestresults":   "inconclusive",
        "fd_imagequality_":    "good",
        "con_outcome":         "yes",
        "con_outcomelst":      "nofurtherdiagn",
        "com_ae_":             "no",
        "cts_notdualsource":   "no",
        "cts_csvlst":          "64",
        "cts_namelst":         "siemens_som_das",
        "cte_ae":              "",
        "cte_premed":          ["nitrates", "betablockeroral"],
        "ecg_mhrlst_":         "lt65",
        "ecg_hrlst":           "sinusrhythm",
        "ctscs_fieldset":      "",
        "ctscs_gating_":       "prospective",
        "ctscc_fieldset":      "",
        "ctscc_gating_":       "prospective",
        "ctscc_cm":            "yes",
        "ctscc":               "iomeprol",
        "ctscc_iomeprol":      "imeron",
        "ctscc_concentrcm":    "350",
        "ctscc_cm_amount":     "120",
        "ctscc_cm_flowrate":   "5",
        "pp_imagereconstr":    "ir",
        "pp_imagereconstrlst": "safire",
        "pp_perf":             "",
        "pp_perflst":          ["3d", "sc_mprs"],
        "rw_reporter_":        "radiologist",
        "consultants":         "akiessling_dsw"
    };
    return options;
}

function defaultOptionsMRT_itis() {
    var options = {
        "suspmyocarditis":"",
        "fd_imagequality_":"good",
        "outcome":"yes",
        "con_outcomelst":"nofurtherdiagn",
        "com_ae_":"no",
        "mrs_fslst":"1_5t",
        "mrs_lst":"siemens_magnetom_sytim",
        "mrexam_":["morphology", "cinemri", "edemaimg", "t1map", "t2map"],
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
        "pp_perflst":["ventrvolfunc", "musclecalc", "t1mapping", "t2mapping", "edemacalc"],
        "rw_reporter_":"radiologist",
        "rw_role_":"consultant",
    };
    return options;
}

function defaultOptionsMRT_stress() {
    var options = {
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
        "rw_role_":"consultant",
    }
    return options;
}

// Global variables
let currentCapturedFormValues = null;

// Save general options
function saveGeneralOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
        color: document.querySelector("#color").value,
    });
    showMessage("General settings saved successfully!");
}

// Helper function to show temporary messages
function showMessage(message, duration = 3000) {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    messageDiv.style.padding = "10px";
    messageDiv.style.backgroundColor = "#4CAF50";
    messageDiv.style.color = "white";
    messageDiv.style.borderRadius = "5px";
    messageDiv.style.marginTop = "10px";
    messageDiv.style.position = "fixed";
    messageDiv.style.top = "10px";
    messageDiv.style.right = "10px";
    messageDiv.style.zIndex = "1000";

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        document.body.removeChild(messageDiv);
    }, duration);
}

// Capture current form values from active tab
function captureCurrentFormValues() {
    browser.tabs.query({active: true, currentWindow: true})
        .then(tabs => {
            browser.tabs.executeScript(tabs[0].id, {
                code: `
                (function() {
                    const formValues = {};
                    const form = document.getElementsByTagName("form")[0];
                    if (!form) return null;

                    // Process input fields, select fields, and textareas
                    const elements = form.querySelectorAll("input, select, textarea");
                    for (const element of elements) {
                        if (!element.id) continue;

                        if (element.type === "checkbox" || element.type === "radio") {
                            if (element.checked) {
                                // For checkboxes with the same name, store as array
                                if (element.name.endsWith("_") && formValues[element.name]) {
                                    if (!Array.isArray(formValues[element.name])) {
                                        formValues[element.name] = [formValues[element.name]];
                                    }
                                    formValues[element.name].push(element.value);
                                } else {
                                    formValues[element.name || element.id] = element.value;
                                }
                            }
                        } else if (element.type === "select-multiple") {
                            const selectedValues = Array.from(element.selectedOptions).map(option => option.value);
                            formValues[element.name || element.id] = selectedValues;
                        } else {
                            formValues[element.name || element.id] = element.value;
                        }
                    }

                    return formValues;
                })();
                `
            })
            .then(results => {
                const formValues = results[0];
                if (!formValues) {
                    showMessage("No form found on the current page or unable to capture form values.", 5000);
                    return;
                }

                currentCapturedFormValues = formValues;
                displayCapturedFormValues(formValues);
                showMessage("Form values captured successfully!");
            })
            .catch(error => {
                console.error("Error capturing form values:", error);
                showMessage("Error capturing form values: " + error.message, 5000);
            });
        });
}

// Display captured form values in the UI
function displayCapturedFormValues(formValues) {
    const container = document.getElementById("currentFormValues");
    container.innerHTML = "";

    const heading = document.createElement("h4");
    heading.textContent = "Captured Form Values:";
    container.appendChild(heading);

    const valuesList = document.createElement("pre");
    valuesList.textContent = JSON.stringify(formValues, null, 2);
    valuesList.style.maxHeight = "200px";
    valuesList.style.overflow = "auto";
    valuesList.style.backgroundColor = "#f8f8f8";
    valuesList.style.padding = "10px";
    valuesList.style.borderRadius = "5px";
    container.appendChild(valuesList);
}

// Save current form values as a named exam type
function saveExamType() {
    const examTypeName = document.getElementById("examTypeName").value.trim();

    if (!examTypeName) {
        showMessage("Please enter a name for the exam type.", 5000);
        return;
    }

    if (!currentCapturedFormValues) {
        showMessage("Please capture form values first.", 5000);
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
            customExamTypes[examTypeName] = currentCapturedFormValues;

            return browser.storage.sync.set({ customExamTypes });
        })
        .then(() => {
            showMessage(`Exam type "${examTypeName}" saved successfully!`);
            document.getElementById("examTypeName").value = "";
            loadSavedExamTypes();
        })
        .catch(error => {
            console.error("Error saving exam type:", error);
            showMessage("Error saving exam type: " + error.message, 5000);
        });
}

// Load and display saved exam types
function loadSavedExamTypes() {
    const container = document.getElementById("examTypesList");

    browser.storage.sync.get("customExamTypes")
        .then(result => {
            const customExamTypes = result.customExamTypes || {};

            if (Object.keys(customExamTypes).length === 0) {
                container.innerHTML = "<p>No saved exam types yet.</p>";
                return;
            }

            container.innerHTML = "";

            for (const [name, values] of Object.entries(customExamTypes)) {
                const examTypeDiv = document.createElement("div");
                examTypeDiv.className = "examType";

                const examTypeName = document.createElement("strong");
                examTypeName.textContent = name;
                examTypeDiv.appendChild(examTypeName);

                const deleteButton = document.createElement("span");
                deleteButton.className = "deleteButton";
                deleteButton.textContent = "Delete";
                deleteButton.dataset.name = name;
                deleteButton.addEventListener("click", function() {
                    deleteExamType(name);
                });
                examTypeDiv.appendChild(deleteButton);

                const valueCount = document.createElement("div");
                valueCount.textContent = `Contains ${Object.keys(values).length} form fields`;
                valueCount.style.fontSize = "0.8em";
                valueCount.style.color = "#666";
                valueCount.style.marginTop = "5px";
                examTypeDiv.appendChild(valueCount);

                container.appendChild(examTypeDiv);
            }
        })
        .catch(error => {
            console.error("Error loading exam types:", error);
            container.innerHTML = `<p>Error loading exam types: ${error.message}</p>`;
        });
}

// Delete a saved exam type
function deleteExamType(name) {
    if (!confirm(`Are you sure you want to delete the exam type "${name}"?`)) {
        return;
    }

    browser.storage.sync.get("customExamTypes")
        .then(result => {
            const customExamTypes = result.customExamTypes || {};

            if (customExamTypes[name]) {
                delete customExamTypes[name];
                return browser.storage.sync.set({ customExamTypes });
            }
        })
        .then(() => {
            showMessage(`Exam type "${name}" deleted successfully!`);
            loadSavedExamTypes();
        })
        .catch(error => {
            console.error("Error deleting exam type:", error);
            showMessage("Error deleting exam type: " + error.message, 5000);
        });
}

// Restore general options
function restoreGeneralOptions() {
    function setCurrentChoice(result) {
        document.querySelector("#color").value = result.color || "blue";
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    let getting = browser.storage.sync.get("color");
    getting.then(setCurrentChoice, onError);
}

// Initialize the page
function initializePage() {
    restoreGeneralOptions();
    loadSavedExamTypes();

    // Set up event listeners
    document.getElementById("generalOptions").addEventListener("submit", saveGeneralOptions);
    document.getElementById("captureFormValues").addEventListener("click", captureCurrentFormValues);
    document.getElementById("saveCurrentForm").addEventListener("click", saveExamType);
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializePage);
