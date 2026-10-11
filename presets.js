//// presets for CT and MRI

const MRT_VITAL_15T = {
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

const MRT_ITIS_15T = {
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

const MRT_ITIS_3T = {
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

const MRT_STRESS = {
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

const CT_KHK = {
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

const examtypes = {
    MRT_VITAL_15T,
    MRT_ITIS_15T,
    MRT_ITIS_3T,
    MRT_STRESS,
    CT_KHK
};

export default examtypes;
