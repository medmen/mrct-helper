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

/**
 * Examtype CT_KHK
 * Current control names/IDs are used directly; Vue field containers are resolved by ID and
 * their checkbox/radio children are selected by matching the preset value.
 *
 */

examtypes.CT_KHK = {
	"cad":"yes",
	"field-cad_status":"suspected",
	"patient_risk":"ptp2024_15_50",
	"field-stress_test_performed":"ecg",
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
	"pp_perf":"yes",
	"pp_perflst":["3d", "mpr"],
	"rw_reporter_":"radiologist"
};

