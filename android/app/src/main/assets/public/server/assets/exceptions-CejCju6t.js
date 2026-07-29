import { t as Parfait_design_default } from "./Parfait design-DElxFSkO.js";
import { t as DESMOHAIR_default } from "./DESMOHAIR-ByaQhVCO.js";
import { Link, useRouterState } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { motion } from "motion/react";
import { createClient } from "@supabase/supabase-js";
//#region src/assets/BEAUTE ESSENTIELLE.jpg
var BEAUTE_ESSENTIELLE_default = "/assets/BEAUTE%20ESSENTIELLE-xqS354eT.jpg";
//#endregion
//#region src/assets/catalog/Coupe_1.webp
var Coupe_1_default = "/assets/Coupe_1-CKF_PoV5.webp";
//#endregion
//#region src/assets/catalog/Coupe_2.webp
var Coupe_2_default = "/assets/Coupe_2-D6aJRNHj.webp";
//#endregion
//#region src/assets/catalog/Coupe_3.webp
var Coupe_3_default = "/assets/Coupe_3-DgXR16oW.webp";
//#endregion
//#region src/assets/catalog/Coupe_4.webp
var Coupe_4_default = "/assets/Coupe_4-CtXgB17j.webp";
//#endregion
//#region src/assets/catalog/Coupe_5.webp
var Coupe_5_default = "/assets/Coupe_5-9w4nZCz9.webp";
//#endregion
//#region src/assets/catalog/Coupe_6.webp
var Coupe_6_default = "/assets/Coupe_6-C-d5THf-.webp";
//#endregion
//#region src/assets/catalog/Coupe_7.webp
var Coupe_7_default = "/assets/Coupe_7-DEgVvoCL.webp";
//#endregion
//#region src/assets/catalog/Coupe_8.webp
var Coupe_8_default = "/assets/Coupe_8-swYtLBpP.webp";
//#endregion
//#region src/assets/catalog/Coupe_9.webp
var Coupe_9_default = "/assets/Coupe_9-04V6juWz.webp";
//#endregion
//#region src/assets/catalog/Coupe_10.webp
var Coupe_10_default = "/assets/Coupe_10-B-ojaiX_.webp";
//#endregion
//#region src/assets/catalog/Coupe_11.webp
var Coupe_11_default = "/assets/Coupe_11-k-QU0vGP.webp";
//#endregion
//#region src/assets/catalog/Coupe_12.webp
var Coupe_12_default = "/assets/Coupe_12-BWas--Kf.webp";
//#endregion
//#region src/assets/catalog/Coupe_13.webp
var Coupe_13_default = "/assets/Coupe_13-cUiSV3jT.webp";
//#endregion
//#region src/assets/catalog/Coupe_14.webp
var Coupe_14_default = "/assets/Coupe_14-D6IFOVug.webp";
//#endregion
//#region src/assets/catalog/Coupe_15.webp
var Coupe_15_default = "/assets/Coupe_15-fv8xnwRP.webp";
//#endregion
//#region src/assets/catalog/Coupe_16.webp
var Coupe_16_default = "/assets/Coupe_16-BTyZul2_.webp";
//#endregion
//#region src/assets/catalog/Coupe_17.webp
var Coupe_17_default = "/assets/Coupe_17-B-0CoFwh.webp";
//#endregion
//#region src/assets/catalog/Coupe_18.webp
var Coupe_18_default = "/assets/Coupe_18-C9k2_25H.webp";
//#endregion
//#region src/assets/catalog/Coupe_19.webp
var Coupe_19_default = "/assets/Coupe_19-DBe22m5g.webp";
//#endregion
//#region src/assets/catalog/Coupe_20.webp
var Coupe_20_default = "/assets/Coupe_20-CAOjVWTT.webp";
//#endregion
//#region src/assets/catalog/Coupe_21.webp
var Coupe_21_default = "/assets/Coupe_21-C_JwNXtG.webp";
//#endregion
//#region src/assets/catalog/Coupe_22.webp
var Coupe_22_default = "/assets/Coupe_22-BV-45aDc.webp";
//#endregion
//#region src/assets/catalog/Coupe_23.webp
var Coupe_23_default = "/assets/Coupe_23-D-PHG0vM.webp";
//#endregion
//#region src/assets/catalog/new/M1-1.webp
var M1_1_default = "/assets/M1-1-BdSyfu-f.webp";
//#endregion
//#region src/assets/catalog/new/M2-1.webp
var M2_1_default = "/assets/M2-1-B7nBBGHi.webp";
//#endregion
//#region src/assets/catalog/new/M3-1.webp
var M3_1_default = "/assets/M3-1-Db6UsRDn.webp";
//#endregion
//#region src/assets/catalog/new/M4-1.webp
var M4_1_default = "/assets/M4-1-eV-S8d77.webp";
//#endregion
//#region src/assets/catalog/new/M5-1.webp
var M5_1_default = "/assets/M5-1-DBUo8yRP.webp";
//#endregion
//#region src/assets/catalog/new/M6-1.webp
var M6_1_default = "/assets/M6-1-Dd-sdcMl.webp";
//#endregion
//#region src/assets/catalog/new/M7-1.webp
var M7_1_default = "/assets/M7-1-CpXAXoWD.webp";
//#endregion
//#region src/assets/catalog/new/M8-1.webp
var M8_1_default = "/assets/M8-1-Dk6xB7yP.webp";
//#endregion
//#region src/assets/catalog/new/M9-1.webp
var M9_1_default = "/assets/M9-1-CBVs4PK3.webp";
//#endregion
//#region src/assets/catalog/new/M10-1.webp
var M10_1_default = "/assets/M10-1-WbJNQpT8.webp";
//#endregion
//#region src/assets/catalog/new/M11-1.webp
var M11_1_default = "/assets/M11-1-CI0yJCzM.webp";
//#endregion
//#region src/assets/catalog/new/M12-1.webp
var M12_1_default = "/assets/M12-1-xpnPy1WK.webp";
//#endregion
//#region src/assets/catalog/new/M13-1.webp
var M13_1_default = "/assets/M13-1-CtRbQrh3.webp";
//#endregion
//#region src/assets/catalog/new/M14-1.webp
var M14_1_default = "/assets/M14-1-CRp-B-PR.webp";
//#endregion
//#region src/assets/catalog/new/M15-1.webp
var M15_1_default = "/assets/M15-1-C8Hrhmid.webp";
//#endregion
//#region src/assets/catalog/new/M16-1.webp
var M16_1_default = "/assets/M16-1-BOvKtXlq.webp";
//#endregion
//#region src/assets/catalog/new/M17-1.webp
var M17_1_default = "/assets/M17-1-Cq1h7zRo.webp";
//#endregion
//#region src/assets/catalog/new/M18-1.webp
var M18_1_default = "/assets/M18-1-Cpt2_Zvz.webp";
//#endregion
//#region src/assets/catalog/promo/promo_1.webp
var promo_1_default = "/assets/promo_1-kYNMlUML.webp";
//#endregion
//#region src/assets/catalog/promo/promo_2.webp
var promo_2_default = "/assets/promo_2-CUo5BaPt.webp";
//#endregion
//#region src/assets/catalog/promo/promo_3.webp
var promo_3_default = "/assets/promo_3-BpLLiFKy.webp";
//#endregion
//#region src/assets/catalog/promo/promo_4.webp
var promo_4_default = "/assets/promo_4-C1CJnmKe.webp";
//#endregion
//#region src/assets/catalog/promo/promo_5.webp
var promo_5_default = "/assets/promo_5-Lcf3nyhA.webp";
//#endregion
//#region src/assets/catalog/promo/promo_6.webp
var promo_6_default = "/assets/promo_6-DrlsQ9sR.webp";
//#endregion
//#region src/assets/catalog/promo/promo_7.webp
var promo_7_default = "/assets/promo_7-DaBfDaUi.webp";
//#endregion
//#region src/assets/catalog/promo/promo_8.webp
var promo_8_default = "/assets/promo_8-BwO8YJ85.webp";
//#endregion
//#region src/assets/catalog/promo/promo_9.webp
var promo_9_default = "/assets/promo_9-B-og9wZL.webp";
//#endregion
//#region src/assets/catalog/promo/promo_10.webp
var promo_10_default = "/assets/promo_10-Bs5oqWgZ.webp";
//#endregion
//#region src/assets/catalog/promo/promo_11.webp
var promo_11_default = "/assets/promo_11-CnLtXA7s.webp";
//#endregion
//#region src/assets/catalog/new/E_1-1.webp
var E_1_1_default = "/assets/E_1-1-Ce7pNDDW.webp";
//#endregion
//#region src/assets/catalog/new/E_2-1.webp
var E_2_1_default = "/assets/E_2-1-DXE7DTgn.webp";
//#endregion
//#region src/assets/catalog/new/E_3-1.webp
var E_3_1_default = "/assets/E_3-1-DNgFxWmO.webp";
//#endregion
//#region src/assets/catalog/new/E_4-1.webp
var E_4_1_default = "/assets/E_4-1-CV0iN6-A.webp";
//#endregion
//#region src/assets/catalog/new/E_5-1.webp
var E_5_1_default = "/assets/E_5-1-_RcxTglq.webp";
//#endregion
//#region src/assets/catalog/new/E_6-1.webp
var E_6_1_default = "/assets/E_6-1-Bhrj3wN1.webp";
//#endregion
//#region src/assets/catalog/new/E_7-1.webp
var E_7_1_default = "/assets/E_7-1-BoyT0hz9.webp";
//#endregion
//#region src/assets/catalog/new/E_8-1.webp
var E_8_1_default = "/assets/E_8-1-C_IF9F5f.webp";
//#endregion
//#region src/assets/catalog/new/E_9-1.webp
var E_9_1_default = "/assets/E_9-1-0rrCmuQF.webp";
//#endregion
//#region src/assets/catalog/new/E_10-1.webp
var E_10_1_default = "/assets/E_10-1-BzTKdSqA.webp";
//#endregion
//#region src/assets/catalog/new/E_11-1.webp
var E_11_1_default = "/assets/E_11-1-Dx5sXzRG.webp";
//#endregion
//#region src/assets/catalog/new/E_12-1.webp
var E_12_1_default = "/assets/E_12-1-BagMMLZb.webp";
//#endregion
//#region src/assets/catalog/new/E_13-1.webp
var E_13_1_default = "/assets/E_13-1-COWXWQ4o.webp";
//#endregion
//#region src/assets/catalog/new/E_14-1.webp
var E_14_1_default = "/assets/E_14-1-BrMG_KwH.webp";
//#endregion
//#region src/assets/catalog/new/E_15-1.webp
var E_15_1_default = "/assets/E_15-1-BeOf6Whw.webp";
//#endregion
//#region src/assets/catalog/new/E_16-1.webp
var E_16_1_default = "/assets/E_16-1-CWeHQDPu.webp";
//#endregion
//#region src/assets/catalog/new/E_17-1.webp
var E_17_1_default = "/assets/E_17-1-B0VhNeL2.webp";
//#endregion
//#region src/assets/catalog/new/E_18-1.webp
var E_18_1_default = "/assets/E_18-1-DSmGN24l.webp";
//#endregion
//#region src/assets/catalog/new/E_19-1.webp
var E_19_1_default = "/assets/E_19-1-B6CJPcwM.webp";
//#endregion
//#region src/assets/catalog/new/E_20-1.webp
var E_20_1_default = "/assets/E_20-1-CmiLjceP.webp";
//#endregion
//#region src/assets/catalog/new/E_21-1.webp
var E_21_1_default = "/assets/E_21-1-BXmdaNMp.webp";
//#endregion
//#region src/assets/catalog/new/P_1-1.webp
var P_1_1_default = "/assets/P_1-1-CL2mO0lM.webp";
//#endregion
//#region src/assets/catalog/new/P_2-1.webp
var P_2_1_default = "/assets/P_2-1-CMHdRqMH.webp";
//#endregion
//#region src/assets/catalog/new/P_3-1.webp
var P_3_1_default = "/assets/P_3-1-BcqydLLo.webp";
//#endregion
//#region src/assets/catalog/new/P_4-1.webp
var P_4_1_default = "/assets/P_4-1-DKbQIo8F.webp";
//#endregion
//#region src/assets/catalog/new/P_5-1.webp
var P_5_1_default = "/assets/P_5-1-BeXBtWDv.webp";
//#endregion
//#region src/assets/catalog/new/P_6-1.webp
var P_6_1_default = "/assets/P_6-1-RwE0qhpm.webp";
//#endregion
//#region src/assets/catalog/new/P_7-1.webp
var P_7_1_default = "/assets/P_7-1-rTd9XLwf.webp";
//#endregion
//#region src/assets/catalog/new/P_8-1.webp
var P_8_1_default = "/assets/P_8-1-BlelSzxN.webp";
//#endregion
//#region src/assets/catalog/new/P_9-1.webp
var P_9_1_default = "/assets/P_9-1-MGwloBMi.webp";
//#endregion
//#region src/assets/catalog/new/P_10-1.webp
var P_10_1_default = "/assets/P_10-1-gytbs04u.webp";
//#endregion
//#region src/assets/catalog/new/P_11-1.webp
var P_11_1_default = "/assets/P_11-1-yf9rDVCC.webp";
//#endregion
//#region src/assets/catalog/new/P_12-1.webp
var P_12_1_default = "/assets/P_12-1-BnClfZJ2.webp";
//#endregion
//#region src/assets/catalog/new/P_13-1.webp
var P_13_1_default = "/assets/P_13-1-D2IxRdYF.webp";
//#endregion
//#region src/assets/catalog/new/P_14-1.webp
var P_14_1_default = "/assets/P_14-1-i-BxaWKY.webp";
//#endregion
//#region src/assets/catalog/new/P_15-1.webp
var P_15_1_default = "/assets/P_15-1-CubWOlBL.webp";
//#endregion
//#region src/assets/catalog/new/P_16-1.webp
var P_16_1_default = "/assets/P_16-1-V9NKagz8.webp";
//#endregion
//#region src/assets/catalog/new/P_17-1.webp
var P_17_1_default = "/assets/P_17-1-B8n8wmbh.webp";
//#endregion
//#region src/assets/catalog/new/P_18-1.webp
var P_18_1_default = "/assets/P_18-1-Bc0z6KcJ.webp";
//#endregion
//#region src/assets/catalog/new/P_19-1.webp
var P_19_1_default = "/assets/P_19-1-CYaO2ob1.webp";
//#endregion
//#region src/assets/catalog/new/P_20-1.webp
var P_20_1_default = "/assets/P_20-1-B-tiWSRl.webp";
//#endregion
//#region src/assets/catalog/new/P_21-1.webp
var P_21_1_default = "/assets/P_21-1-Cy7JTPIO.webp";
//#endregion
//#region src/assets/catalog/new/P_22-1.webp
var P_22_1_default = "/assets/P_22-1-8-PVwMzy.webp";
//#endregion
//#region src/assets/catalog/new/P_23-1.webp
var P_23_1_default = "/assets/P_23-1-D29iLJ13.webp";
//#endregion
//#region src/assets/catalog/new/PB_1-1.webp
var PB_1_1_default = "/assets/PB_1-1-CYn_tUTa.webp";
//#endregion
//#region src/assets/catalog/new/PB_2-1.webp
var PB_2_1_default = "/assets/PB_2-1-CxO8qcY-.webp";
//#endregion
//#region src/assets/catalog/new/PB_3-1.webp
var PB_3_1_default = "/assets/PB_3-1-CvzSbrhx.webp";
//#endregion
//#region src/assets/catalog/new/PB_4-1.webp
var PB_4_1_default = "/assets/PB_4-1-B0VzeT-h.webp";
//#endregion
//#region src/assets/catalog/new/PB_5-1.webp
var PB_5_1_default = "/assets/PB_5-1-CwcbVV63.webp";
//#endregion
//#region src/assets/catalog/new/PB_6-1.webp
var PB_6_1_default = "/assets/PB_6-1-qOuTtefA.webp";
//#endregion
//#region src/assets/catalog/new/PB_7-1.webp
var PB_7_1_default = "/assets/PB_7-1-CBzqVN8n.webp";
//#endregion
//#region src/assets/catalog/new/PB_8-1.webp
var PB_8_1_default = "/assets/PB_8-1-B8uOhjOm.webp";
//#endregion
//#region src/assets/catalog/new/PB_9-1.webp
var PB_9_1_default = "/assets/PB_9-1-U0k5-XwF.webp";
//#endregion
//#region src/assets/catalog/new/PB_10-1.webp
var PB_10_1_default = "/assets/PB_10-1-CtNanHfL.webp";
//#endregion
//#region src/assets/catalog/new/PB_11-1.webp
var PB_11_1_default = "/assets/PB_11-1-B4K7lW4b.webp";
//#endregion
//#region src/assets/catalog/new/PB_14-1.webp
var PB_14_1_default = "/assets/PB_14-1-ETzGoHg-.webp";
//#endregion
//#region src/assets/catalog/new/PB_34-1.webp
var PB_34_1_default = "/assets/PB_34-1-qi7m_4GQ.webp";
//#endregion
//#region src/assets/catalog/new/PB_36-1.webp
var PB_36_1_default = "/assets/PB_36-1-uHv9s51t.webp";
//#endregion
//#region src/assets/catalog/new/PB_37-1.webp
var PB_37_1_default = "/assets/PB_37-1-CdsfQpL4.webp";
//#endregion
//#region src/assets/catalog/new/PB_38-1.webp
var PB_38_1_default = "/assets/PB_38-1-Eu-xE0YH.webp";
//#endregion
//#region src/assets/catalog/new/PCC_12-1.webp
var PCC_12_1_default = "/assets/PCC_12-1-DVErqNpL.webp";
//#endregion
//#region src/assets/catalog/new/PCC_15-1.webp
var PCC_15_1_default = "/assets/PCC_15-1-DCI4TLBb.webp";
//#endregion
//#region src/assets/catalog/new/PCC_16-1.webp
var PCC_16_1_default = "/assets/PCC_16-1-zoDV88N7.webp";
//#endregion
//#region src/assets/catalog/new/PCC_17-1.webp
var PCC_17_1_default = "/assets/PCC_17-1-CdDmlg1k.webp";
//#endregion
//#region src/assets/catalog/new/PCC_18-1.webp
var PCC_18_1_default = "/assets/PCC_18-1-BfrkHuQ8.webp";
//#endregion
//#region src/assets/catalog/new/PCC_19-1.webp
var PCC_19_1_default = "/assets/PCC_19-1-BSkG5Wgt.webp";
//#endregion
//#region src/assets/catalog/new/PCC_20-1.webp
var PCC_20_1_default = "/assets/PCC_20-1-BJg1_ve6.webp";
//#endregion
//#region src/assets/catalog/new/PCC_21-1.webp
var PCC_21_1_default = "/assets/PCC_21-1-mWXMiOIw.webp";
//#endregion
//#region src/assets/catalog/new/PCC_22-1.webp
var PCC_22_1_default = "/assets/PCC_22-1-DoJMRYwQ.webp";
//#endregion
//#region src/assets/catalog/new/PEM_13-1.webp
var PEM_13_1_default = "/assets/PEM_13-1-DaxvhFUL.webp";
//#endregion
//#region src/assets/catalog/new/PEM_30-1.webp
var PEM_30_1_default = "/assets/PEM_30-1-CESDskzR.webp";
//#endregion
//#region src/assets/catalog/new/PLL_25-1.webp
var PLL_25_1_default = "/assets/PLL_25-1-Dqt4WjWT.webp";
//#endregion
//#region src/assets/catalog/new/PEM_44-1.webp
var PEM_44_1_default = "/assets/PEM_44-1-CMas9hnC.webp";
//#endregion
//#region src/assets/catalog/new/PEM_31-1.webp
var PEM_31_1_default = "/assets/PEM_31-1-b1eYA6k6.webp";
//#endregion
//#region src/assets/catalog/new/PEM_32-1.webp
var PEM_32_1_default = "/assets/PEM_32-1-DcuyEswP.webp";
//#endregion
//#region src/assets/catalog/new/PEM_33-1.webp
var PEM_33_1_default = "/assets/PEM_33-1-CHILyyR9.webp";
//#endregion
//#region src/assets/catalog/new/PEM_35-1.webp
var PEM_35_1_default = "/assets/PEM_35-1-CAoKbMfc.webp";
//#endregion
//#region src/assets/catalog/new/PLL_23-1.webp
var PLL_23_1_default = "/assets/PLL_23-1-kElnX8Xj.webp";
//#endregion
//#region src/assets/catalog/new/PLL_24-1.webp
var PLL_24_1_default = "/assets/PLL_24-1-CkCVNWGv.webp";
//#endregion
//#region src/assets/catalog/new/PLL_26-1.webp
var PLL_26_1_default = "/assets/PLL_26-1-CzxswiB8.webp";
//#endregion
//#region src/assets/catalog/new/PLL_27-1.webp
var PLL_27_1_default = "/assets/PLL_27-1-BM8s6rbw.webp";
//#endregion
//#region src/assets/catalog/new/PLL_28-1.webp
var PLL_28_1_default = "/assets/PLL_28-1-XMLittom.webp";
//#endregion
//#region src/assets/catalog/new/PLL_29-1.webp
var PLL_29_1_default = "/assets/PLL_29-1-oCfQw7qb.webp";
//#endregion
//#region src/assets/catalog/new/PLL_41-1.webp
var PLL_41_1_default = "/assets/PLL_41-1-CdJ6_fWL.webp";
//#endregion
//#region src/assets/catalog/new/PLL_42-1.webp
var PLL_42_1_default = "/assets/PLL_42-1-CCpYhxPT.webp";
//#endregion
//#region src/assets/catalog/new/PC_39-1.webp
var PC_39_1_default = "/assets/PC_39-1-CN7abUNZ.webp";
//#endregion
//#region src/assets/catalog/new/PC_40-1.webp
var PC_40_1_default = "/assets/PC_40-1-BOiUO4Sh.webp";
//#endregion
//#region src/lib/salon-data.ts
var SALONS = [
	{
		id: "parfait",
		name: "Parfait Design",
		area: "Zone 1",
		city: "Ouagadougou, Burkina Faso",
		phone: "+22670028336",
		phoneDisplay: "+226 70 02 83 36",
		whatsapp: "22670028336",
		mapsLink: "https://www.google.com/maps?q=12.3664879,-1.4695977",
		embed: "https://www.google.com/maps?q=12.3664879,-1.4695977&hl=fr&z=16&output=embed",
		logo: Parfait_design_default,
		tags: [
			"services",
			"perruques",
			"meche",
			"mariage",
			"coiffure",
			"promotion"
		]
	},
	{
		id: "desmohair",
		name: "Desmo Hair",
		area: "Ouaga 2000",
		city: "Ouagadougou, Burkina Faso",
		phone: "+22671716411",
		phoneDisplay: "+226 71 71 64 11",
		whatsapp: "22671716411",
		mapsLink: "https://maps.app.goo.gl/AQnbR4cyVPYH3PmW7",
		embed: "https://www.google.com/maps?q=Desmo+Hair+Ouaga+2000&hl=fr&z=15&output=embed",
		logo: DESMOHAIR_default,
		tags: [
			"services",
			"perruques",
			"meche",
			"mariage",
			"coiffure",
			"promotion"
		]
	},
	{
		id: "beaute",
		name: "Beauté Essentielle",
		area: "Dassasgo",
		city: "Ouagadougou, Burkina Faso",
		phone: "+22671115784",
		phoneDisplay: "+226 71 11 57 84",
		whatsapp: "22671115784",
		mapsLink: "https://maps.app.goo.gl/TqSPQGnvZsVpRcK6A",
		embed: "https://www.google.com/maps?q=Dassasgo+Ouagadougou&hl=fr&z=15&output=embed",
		logo: BEAUTE_ESSENTIELLE_default,
		tags: ["produits", "equipement"]
	}
];
function getSalon(id) {
	return SALONS.find((s) => s.id === id) ?? SALONS[0];
}
function pickSalonFor(category) {
	if (!category) return SALONS[0];
	if (category === "produits" || category === "equipement") return getSalon("beaute");
	return getSalon("parfait");
}
function waLinkFor(salonId, message) {
	const s = getSalon(salonId);
	const text = message ?? `Bonjour ${s.name},\n\nJe souhaite obtenir plus d'informations.`;
	const encoded = encodeURIComponent(text);
	const fallback = `https://wa.me/${s.whatsapp}?text=${encoded}`;
	if (typeof window !== "undefined" && window.Capacitor?.isNativeApp?.()) return `whatsapp://send?phone=${s.whatsapp}&text=${encoded}`;
	return fallback;
}
SALONS[0].whatsapp;
SALONS[0].phoneDisplay;
function waLink(message) {
	return waLinkFor("parfait", message);
}
var SOCIALS = {
	facebook: "https://www.facebook.com/Faso.Perruque/",
	instagram: "https://www.instagram.com/parfaitdesign",
	tiktok: "https://www.tiktok.com/@desmohair.faso.perruque",
	website: "https://parfaitdesign-desmohair.com/"
};
var LOCATION = {
	lat: 12.3664879,
	lng: -1.4695977,
	city: SALONS[0].city,
	mapsLink: SALONS[0].mapsLink,
	embed: SALONS[0].embed
};
var COIFFURE = [
	{
		id: "CF1",
		code: "CF1",
		name: "Coupe tendance",
		desc: "Coupe moderne au style élégant quotidien.",
		price: 65e3,
		badge: "Best-seller",
		image: Coupe_1_default
	},
	{
		id: "CF2",
		code: "CF2",
		name: "Catalina version Chioma",
		desc: "Look glamour inspiré du style Chioma.",
		price: 35e3,
		image: Coupe_2_default
	},
	{
		id: "CF3",
		code: "CF3",
		name: "Catalina double frange",
		desc: "Double frange légère avec finition naturelle.",
		price: 35e3,
		image: Coupe_3_default
	},
	{
		id: "CF4",
		code: "CF4",
		name: "Catalina simple",
		desc: "Coupe courte simple et facile à porter.",
		price: 32e3,
		badge: "Nouveau",
		image: Coupe_4_default
	},
	{
		id: "CF5",
		code: "CF5",
		name: "Catalina bouclée",
		desc: "Boucles souples au volume naturel chic.",
		price: 32e3,
		image: Coupe_5_default
	},
	{
		id: "CF6",
		code: "CF6",
		name: "Catalina frange de côté",
		desc: "Frange latérale élégante au rendu naturel.",
		price: 32e3,
		image: Coupe_6_default
	},
	{
		id: "CF7",
		code: "CF7",
		name: "Catalina closure",
		desc: "Finition closure discrète et très réaliste.",
		price: 32e3,
		image: Coupe_7_default
	},
	{
		id: "CF8",
		code: "CF8",
		name: "Catalina frange de côté",
		desc: "Style raffiné avec frange sur le côté.",
		price: 32e3,
		image: Coupe_8_default
	},
	{
		id: "CF9",
		code: "CF9",
		name: "Catalina frange",
		desc: "Frange droite moderne et féminine élégante.",
		price: 32e3,
		image: Coupe_9_default
	},
	{
		id: "CF10",
		code: "CF10",
		name: "Catalina frange de côté",
		desc: "Coiffure courte avec mouvement naturel fluide.",
		price: 32e3,
		image: Coupe_10_default
	},
	{
		id: "CF11",
		code: "CF11",
		name: "Catalina frange de côté",
		desc: "Look chic parfait pour toutes occasions.",
		price: 32e3,
		image: Coupe_11_default
	},
	{
		id: "CF12",
		code: "CF12",
		name: "Catalina frange de côté",
		desc: "Frange légère avec coupe courte tendance.",
		price: 32e3,
		image: Coupe_12_default
	},
	{
		id: "CF13",
		code: "CF13",
		name: "Catalina frange de côté",
		desc: "Style féminin discret et facile d'entretien.",
		price: 32e3,
		image: Coupe_13_default
	},
	{
		id: "CF14",
		code: "CF14",
		name: "Catalina gris",
		desc: "Coloris gris moderne au rendu sophistiqué.",
		price: 45e3,
		image: Coupe_14_default
	},
	{
		id: "CF15",
		code: "CF15",
		name: "Catalina gris",
		desc: "Coupe grise élégante au style affirmé.",
		price: 45e3,
		image: Coupe_15_default
	},
	{
		id: "CF16",
		code: "CF16",
		name: "Catalina bouclée",
		desc: "Boucles définies avec effet naturel volumineux.",
		price: 32e3,
		image: Coupe_16_default
	},
	{
		id: "CF17",
		code: "CF17",
		name: "Catalina",
		desc: "Coupe classique adaptée au quotidien élégant.",
		price: 32e3,
		image: Coupe_17_default
	},
	{
		id: "CF18",
		code: "CF18",
		name: "Catalina bouclée",
		desc: "Texture bouclée douce avec belle densité.",
		price: 32e3,
		image: Coupe_18_default
	},
	{
		id: "CF19",
		code: "CF19",
		name: "Catalina frange",
		desc: "Frange stylée avec finition propre naturelle.",
		price: 32e3,
		image: Coupe_19_default
	},
	{
		id: "CF20",
		code: "CF20",
		name: "Catalina deux traits",
		desc: "Deux traits modernes pour look audacieux.",
		price: 35e3,
		image: Coupe_20_default
	},
	{
		id: "CF21",
		code: "CF21",
		name: "Catalina bouclée",
		desc: "Boucles courtes souples et très tendance.",
		price: 32e3,
		image: Coupe_21_default
	},
	{
		id: "CF22",
		code: "CF22",
		name: "Catalina modifiée",
		desc: "Modèle premium revisité avec finition travaillée.",
		price: 32e3,
		image: Coupe_22_default
	},
	{
		id: "CF23",
		code: "CF23",
		name: "Catalina modifiée frange",
		desc: "Frange revisitée avec coupe moderne raffinée.",
		price: 35e3,
		image: Coupe_23_default
	}
];
var PERR_BOUNCY = [
	{
		id: "PB1",
		code: "PB1",
		name: "Perruque Bouncy Closure sur le côté",
		desc: "Closure latérale avec effet naturel élégant.",
		price: 72e3,
		fromPrice: true,
		subCategory: "Bouncy",
		texture: "Virgin",
		badge: "Best-seller",
		image: PB_1_1_default
	},
	{
		id: "PB2",
		code: "PB2",
		name: "Bouncy SDD Closure 5x5",
		desc: "Perruque fluide avec closure discrète moderne.",
		price: 67e3,
		fromPrice: true,
		subCategory: "Bouncy",
		texture: "Raw",
		image: PB_2_1_default
	},
	{
		id: "PB3",
		code: "PB3",
		name: "Bouncy Hairline",
		desc: "Hairline réaliste avec volume naturel parfait.",
		price: 67e3,
		fromPrice: true,
		subCategory: "Bouncy",
		texture: "Brazilian",
		image: PB_3_1_default
	},
	{
		id: "PB4",
		code: "PB4",
		name: "Collection Hanriette",
		desc: "Collection premium au rendu soyeux luxueux.",
		price: 115e3,
		fromPrice: true,
		subCategory: "Bouncy",
		texture: "Indian",
		badge: "Nouveau",
		image: PB_4_1_default
	},
	{
		id: "PB5",
		code: "PB5",
		name: "Bouncy Anastasie Closure 6x6",
		desc: "Closure large avec finition haute définition.",
		price: 137e3,
		subCategory: "Bouncy",
		texture: "Raw",
		image: PB_5_1_default
	},
	{
		id: "PB6",
		code: "PB6",
		name: "Collection Hanriette",
		desc: "Style élégant avec texture douce naturelle.",
		price: 155e3,
		fromPrice: true,
		subCategory: "Bouncy",
		texture: "Peruvian",
		image: PB_6_1_default
	},
	{
		id: "PB7",
		code: "PB7",
		name: "Collection Hanriette",
		desc: "Perruque chic idéale pour usage quotidien.",
		price: 115e3,
		subCategory: "Bouncy",
		texture: "Malaysian",
		image: PB_7_1_default
	},
	{
		id: "PB8",
		code: "PB8",
		name: "Black Beauty Hanriette",
		desc: "Mélange coloré moderne avec brillance naturelle.",
		price: 105e3,
		subCategory: "Bouncy",
		texture: "Brazilian",
		image: PB_8_1_default
	},
	{
		id: "PB9",
		code: "PB9",
		name: "Léa Bouncy",
		desc: "Longueur glamour avec mouvement très fluide.",
		price: 87e3,
		subCategory: "Bouncy",
		texture: "Vietnamese",
		image: PB_9_1_default
	},
	{
		id: "PB10",
		code: "PB10",
		name: "Collection Hanriette",
		desc: "Coloration élégante avec finition haut de gamme.",
		price: 207e3,
		subCategory: "Bouncy",
		texture: "Peruvian",
		image: PB_10_1_default
	},
	{
		id: "PB11",
		code: "PB11",
		name: "Frange Closure 5x5",
		desc: "Frange naturelle avec closure parfaitement discrète.",
		price: 67e3,
		fromPrice: true,
		subCategory: "Bouncy",
		texture: "Virgin",
		image: PB_11_1_default
	},
	{
		id: "PB12",
		code: "PB12",
		name: "Foumi Frange",
		desc: "Coupe frange moderne au look raffiné.",
		price: 75e3,
		subCategory: "Bouncy",
		texture: "Brazilian",
		image: PB_14_1_default
	},
	{
		id: "PB13",
		code: "PB13",
		name: "Black Beauty Bounce HD Lace",
		desc: "Lace HD invisible avec rendu réaliste.",
		price: 115e3,
		subCategory: "Bouncy",
		texture: "Brazilian",
		image: PB_34_1_default
	},
	{
		id: "PB14",
		code: "PB14",
		name: "Bouncy Closure 5x5",
		desc: "Couleur lumineuse avec texture souple naturelle.",
		price: 82e3,
		subCategory: "Bouncy",
		texture: "Virgin",
		image: PB_36_1_default
	},
	{
		id: "PB15",
		code: "PB15",
		name: "Bouncy Closure 5x5",
		desc: "Effet piano élégant au rendu brillant. Promo limitée.",
		price: 82e3,
		oldPrice: 105e3,
		badge: "★ Limité",
		subCategory: "Bouncy",
		texture: "Vietnamese",
		image: PB_37_1_default
	},
	{
		id: "PB16",
		code: "PB16",
		name: "Bouncy Closure 5x5",
		desc: "Dégradé piano avec belle densité naturelle. Promo limitée.",
		price: 58e3,
		oldPrice: 7e4,
		badge: "★ Limité",
		subCategory: "Bouncy",
		texture: "Peruvian",
		image: PB_38_1_default
	}
];
var PERR_CC = [
	{
		id: "PCC1",
		code: "PCC1",
		name: "Frange dégradée",
		desc: "Dégradé gris moderne avec frange stylée.",
		price: 85e3,
		subCategory: "Coupe Carré",
		texture: "Brazilian",
		image: PCC_12_1_default
	},
	{
		id: "PCC2",
		code: "PCC2",
		name: "Raw Hair",
		desc: "Raw hair premium au toucher soyeux.",
		price: 9e4,
		subCategory: "Coupe Carré",
		texture: "Vietnamese",
		image: PCC_15_1_default
	},
	{
		id: "PCC3",
		code: "PCC3",
		name: "SDD Closure 5x5",
		desc: "Closure discrète avec rendu naturel impeccable.",
		price: 57e3,
		subCategory: "Coupe Carré",
		texture: "Raw",
		image: PCC_16_1_default
	},
	{
		id: "PCC4",
		code: "PCC4",
		name: "Raw Hair Closure 2x6",
		desc: "Couleur ginger élégante avec texture fluide.",
		price: 85e3,
		subCategory: "Coupe Carré",
		texture: "Indian",
		image: PCC_17_1_default
	},
	{
		id: "PCC5",
		code: "PCC5",
		name: "Frange Closure 5x5",
		desc: "Frange tendance avec finition très naturelle.",
		price: 57e3,
		subCategory: "Coupe Carré",
		texture: "Malaysian",
		image: PCC_18_1_default
	},
	{
		id: "PCC6",
		code: "PCC6",
		name: "Raw Hair Closure 2x6",
		desc: "Texture premium avec coloration brown sophistiquée.",
		price: 9e4,
		subCategory: "Coupe Carré",
		texture: "Peruvian",
		image: PCC_19_1_default
	},
	{
		id: "PCC7",
		code: "PCC7",
		name: "Frange",
		desc: "Coupe courte pratique avec frange légère.",
		price: 37e3,
		subCategory: "Coupe Carré",
		texture: "Malaysian",
		image: PCC_20_1_default
	},
	{
		id: "PCC8",
		code: "PCC8",
		name: "Plongeon",
		desc: "Coupe plongeante moderne au style féminin.",
		price: 57e3,
		subCategory: "Coupe Carré",
		texture: "Indian",
		image: PCC_21_1_default
	},
	{
		id: "PCC9",
		code: "PCC9",
		name: "Raw Hair",
		desc: "Raw hair brillant avec couleur intense.",
		price: 9e4,
		subCategory: "Coupe Carré",
		texture: "Raw",
		image: PCC_22_1_default
	}
];
var PERR_EM = [
	{
		id: "PEM1",
		code: "PEM1",
		name: "Pixie Curl",
		desc: "Boucles pixie volumineuses au rendu glamour.",
		price: 137e3,
		subCategory: "Effet Mouillé",
		texture: "Indian",
		image: PEM_13_1_default
	},
	{
		id: "PEM2",
		code: "PEM2",
		name: "Pixie Curl Closure 5x5",
		desc: "Closure naturelle avec boucles définies élégantes.",
		price: 117e3,
		subCategory: "Effet Mouillé",
		texture: "Vietnamese",
		image: PEM_30_1_default
	},
	{
		id: "PEM3",
		code: "PEM3",
		name: "Burmess Curl",
		desc: "Boucles profondes avec couleur bordeaux chic.",
		price: 117e3,
		subCategory: "Effet Mouillé",
		texture: "Brazilian",
		image: PEM_31_1_default
	},
	{
		id: "PEM4",
		code: "PEM4",
		name: "Burmess Curl",
		desc: "Texture souple avec volume harmonieux naturel. Promo limitée.",
		price: 58e3,
		oldPrice: 7e4,
		badge: "★ Limité",
		subCategory: "Effet Mouillé",
		texture: "Raw",
		image: PEM_32_1_default
	},
	{
		id: "PEM5",
		code: "PEM5",
		name: "Pixie Curl",
		desc: "Effet piano brillant avec boucles légères. Promo limitée.",
		price: 78e3,
		oldPrice: 87e3,
		badge: "★ Limité",
		subCategory: "Effet Mouillé",
		texture: "Indian",
		image: PEM_33_1_default
	},
	{
		id: "PEM6",
		code: "PEM6",
		name: "Burmess Curl",
		desc: "Boucles piano modernes et faciles à coiffer. Promo limitée.",
		price: 58e3,
		oldPrice: 7e4,
		badge: "★ Limité",
		subCategory: "Effet Mouillé",
		texture: "Malaysian",
		image: PEM_35_1_default
	},
	{
		id: "PEM7",
		code: "PEM7",
		name: "Burmess Curl Closure 5x4",
		desc: "Closure pratique avec texture curly naturelle.",
		price: 87e3,
		subCategory: "Effet Mouillé",
		texture: "Peruvian",
		image: PEM_44_1_default
	}
];
var PERR_LL = [
	{
		id: "PLL1",
		code: "PLL1",
		name: "Frange longue",
		desc: "Frange longue avec mouvement élégant naturel.",
		price: 62e3,
		fromPrice: true,
		subCategory: "Lisse Long",
		texture: "Virgin",
		image: PLL_23_1_default
	},
	{
		id: "PLL2",
		code: "PLL2",
		name: "Collection Hanriette",
		desc: "Modèle luxueux avec finition haut de gamme.",
		price: 115e3,
		fromPrice: true,
		subCategory: "Lisse Long",
		texture: "Brazilian",
		image: PLL_24_1_default
	},
	{
		id: "PLL3",
		code: "PLL3",
		name: "Raw Hair Closure 5x5",
		desc: "Longueur premium avec closure invisible naturelle.",
		price: 175e3,
		subCategory: "Lisse Long",
		texture: "Vietnamese",
		image: PLL_25_1_default
	},
	{
		id: "PLL4",
		code: "PLL4",
		name: "Raw Hair Closure 2x6",
		desc: "Texture raw hair douce et réaliste.",
		price: 165e3,
		subCategory: "Lisse Long",
		texture: "Indian",
		image: PLL_26_1_default
	},
	{
		id: "PLL5",
		code: "PLL5",
		name: "Raw Hair",
		desc: "Longue perruque brillante couleur bordeaux intense.",
		price: 175e3,
		subCategory: "Lisse Long",
		texture: "Raw",
		image: PLL_27_1_default
	},
	{
		id: "PLL6",
		code: "PLL6",
		name: "Raw Hair",
		desc: "Coloration brown chic avec texture fluide.",
		price: 175e3,
		subCategory: "Lisse Long",
		texture: "Virgin",
		image: PLL_28_1_default
	},
	{
		id: "PLL7",
		code: "PLL7",
		name: "Anastasie",
		desc: "Style glamour avec belle densité naturelle.",
		price: 137e3,
		subCategory: "Lisse Long",
		texture: "Peruvian",
		image: PLL_29_1_default
	},
	{
		id: "PLL8",
		code: "PLL8",
		name: "Collection Hanriette",
		desc: "Mélange piano élégant avec finition premium.",
		price: 207e3,
		subCategory: "Lisse Long",
		texture: "Indian",
		image: PLL_41_1_default
	},
	{
		id: "PLL9",
		code: "PLL9",
		name: "Raw Hair 6x6",
		desc: "Closure large avec rendu naturel impeccable.",
		price: 137e3,
		subCategory: "Lisse Long",
		texture: "Raw",
		image: PLL_42_1_default
	}
];
var PERR_CUT = [{
	id: "PC1",
	code: "PC1",
	name: "Coupe Catalina",
	desc: "Coupe courte colorée au style moderne.",
	price: 32e3,
	subCategory: "Cut",
	texture: "Malaysian",
	image: PC_39_1_default
}, {
	id: "PC2",
	code: "PC2",
	name: "Coupe Catalina",
	desc: "Coupe naturelle élégante facile à porter.",
	price: 32e3,
	subCategory: "Cut",
	texture: "Raw",
	image: PC_40_1_default
}];
var CATALOG_ITEMS = {
	coiffure: COIFFURE,
	perruques: [
		...PERR_BOUNCY,
		...PERR_CC,
		...PERR_EM,
		...PERR_LL,
		...PERR_CUT
	],
	meche: [],
	mariage: [
		{
			id: "M1",
			code: "M1",
			name: "Pack Diamant tout fourni",
			desc: "Mèches et coiffure incluses dans le pack.",
			price: 2e5,
			badge: "Best-seller",
			subCategory: "Mariage",
			image: M1_1_default
		},
		{
			id: "M2",
			code: "M2",
			name: "Pack Diamant tout fourni",
			desc: "Mèches et coiffure incluses dans le pack.",
			price: 2e5,
			subCategory: "Mariage",
			image: M2_1_default
		},
		{
			id: "M3",
			code: "M3",
			name: "Pack Diamant tout fourni",
			desc: "Mèches et coiffure incluses dans le pack.",
			price: 2e5,
			subCategory: "Mariage",
			image: M3_1_default
		},
		{
			id: "M4",
			code: "M4",
			name: "Pack Diamant tout fourni",
			desc: "Mèches et coiffure incluses dans le pack.",
			price: 2e5,
			subCategory: "Mariage",
			image: M4_1_default
		},
		{
			id: "M5",
			code: "M5",
			name: "Pack Diamant tout fourni",
			desc: "Mèches et coiffure incluses dans le pack.",
			price: 2e5,
			subCategory: "Mariage",
			image: M5_1_default
		},
		{
			id: "M6",
			code: "M6",
			name: "Pack Diamant tout fourni",
			desc: "Mèches et coiffure incluses dans le pack.",
			price: 2e5,
			subCategory: "Mariage",
			image: M6_1_default
		},
		{
			id: "M7",
			code: "M7",
			name: "Pack Diamant tout fourni",
			desc: "Mèches et coiffure incluses dans le pack.",
			price: 2e5,
			subCategory: "Mariage",
			image: M7_1_default
		},
		{
			id: "M8",
			code: "M8",
			name: "Pack Diamant tout fourni",
			desc: "Mèches et coiffure incluses dans le pack.",
			price: 2e5,
			subCategory: "Mariage",
			image: M8_1_default
		},
		{
			id: "M9",
			code: "M9",
			name: "Pack Diamant tout fourni",
			desc: "Mèches et coiffure incluses dans le pack.",
			price: 2e5,
			subCategory: "Mariage",
			image: M9_1_default
		},
		{
			id: "M10",
			code: "M10",
			name: "Pack Diamant tout fourni",
			desc: "Mèches et coiffure incluses dans le pack.",
			price: 2e5,
			subCategory: "Mariage",
			image: M10_1_default
		},
		{
			id: "M11",
			code: "M11",
			name: "Pack Diamant tout fourni",
			desc: "Mèches et coiffure incluses dans le pack.",
			price: 2e5,
			subCategory: "Mariage",
			image: M11_1_default
		},
		{
			id: "M12",
			code: "M12",
			name: "Pack Diamant tout fourni",
			desc: "Mèches et coiffure incluses dans le pack.",
			price: 2e5,
			subCategory: "Mariage",
			image: M12_1_default
		},
		{
			id: "M13",
			code: "M13",
			name: "Pack Diamant tout fourni",
			desc: "Mèches et coiffure incluses dans le pack.",
			price: 2e5,
			subCategory: "Mariage",
			image: M13_1_default
		},
		{
			id: "M14",
			code: "M14",
			name: "Pack Diamant tout fourni",
			desc: "Mèches et coiffure incluses dans le pack.",
			price: 2e5,
			subCategory: "Mariage",
			image: M14_1_default
		},
		{
			id: "M15",
			code: "M15",
			name: "Pack Diamant tout fourni",
			desc: "Mèches et coiffure incluses dans le pack.",
			price: 2e5,
			subCategory: "Mariage",
			image: M15_1_default
		},
		{
			id: "M16",
			code: "M16",
			name: "Pack Diamant tout fourni",
			desc: "Mèches et coiffure incluses dans le pack.",
			price: 2e5,
			subCategory: "Mariage",
			image: M16_1_default
		},
		{
			id: "M17",
			code: "M17",
			name: "Pack Diamant tout fourni",
			desc: "Mèches et coiffure incluses dans le pack.",
			price: 2e5,
			subCategory: "Mariage",
			image: M17_1_default
		},
		{
			id: "M18",
			code: "M18",
			name: "Pack Diamant tout fourni",
			desc: "Mèches et coiffure incluses dans le pack.",
			price: 2e5,
			subCategory: "Mariage",
			image: M18_1_default
		}
	],
	produits: [
		{
			id: "PR1",
			code: "PR1",
			name: "Jelly Spa",
			desc: "Soin relaxant hydratant pour mains et pieds.",
			price: 8e3,
			subCategory: "Produits",
			image: P_1_1_default
		},
		{
			id: "PR2",
			code: "PR2",
			name: "DR-Meinaier",
			desc: "Produit nourrissant pour cheveux fragilisés.",
			price: 12e3,
			subCategory: "Produits",
			badge: "Nouveau",
			image: P_2_1_default
		},
		{
			id: "PR3",
			code: "PR3",
			name: "Coffee Whitening Spa",
			desc: "Soin éclaircissant au parfum doux café.",
			price: 3e3,
			subCategory: "Produits",
			image: P_3_1_default
		},
		{
			id: "PR4",
			code: "PR4",
			name: "Lotion After Shave",
			desc: "Apaise efficacement la peau après rasage.",
			price: 2500,
			subCategory: "Produits",
			image: P_4_1_default
		},
		{
			id: "PR5",
			code: "PR5",
			name: "Argan Oil Protein",
			desc: "Répare cheveux secs avec protéines nourrissantes.",
			price: 7e3,
			subCategory: "Produits",
			image: P_5_1_default
		},
		{
			id: "PR6",
			code: "PR6",
			name: "Argan Oil",
			desc: "Huile capillaire hydratante et brillante naturelle.",
			price: 3e3,
			subCategory: "Produits",
			badge: "Best-seller",
			image: P_6_1_default
		},
		{
			id: "PR7",
			code: "PR7",
			name: "Fantasia Heat Protector",
			desc: "Protège les cheveux contre la chaleur.",
			price: 7e3,
			subCategory: "Produits",
			image: P_7_1_default
		},
		{
			id: "PR8",
			code: "PR8",
			name: "TRESemmé Protecting Heat",
			desc: "Spray protecteur avant utilisation d'appareils chauffants.",
			price: 12e3,
			subCategory: "Produits",
			image: P_8_1_default
		},
		{
			id: "PR9",
			code: "PR9",
			name: "Ebin",
			desc: "Fixation durable pour coiffures et lace.",
			price: 7e3,
			subCategory: "Produits",
			image: P_9_1_default
		},
		{
			id: "PR10",
			code: "PR10",
			name: "Mediana Leave-In Conditioning Milk",
			desc: "Lait capillaire hydratant sans rinçage quotidien.",
			price: 2e3,
			subCategory: "Produits",
			image: P_10_1_default
		},
		{
			id: "PR11",
			code: "PR11",
			name: "Super Hair Protector",
			desc: "Protection thermique légère pour tous cheveux.",
			price: 3e3,
			subCategory: "Produits",
			image: P_11_1_default
		},
		{
			id: "PR12",
			code: "PR12",
			name: "Kaqier",
			desc: "Produit coiffant pratique pour usage quotidien.",
			price: 1500,
			subCategory: "Produits",
			image: P_12_1_default
		},
		{
			id: "PR13",
			code: "PR13",
			name: "göt2b Hair Wax",
			desc: "Cire coiffante avec fixation longue durée.",
			price: 1e3,
			subCategory: "Produits",
			image: P_13_1_default
		},
		{
			id: "PR14",
			code: "PR14",
			name: "Kaqier",
			desc: "Produit coiffant léger au rendu naturel.",
			price: 1500,
			subCategory: "Produits",
			image: P_14_1_default
		},
		{
			id: "PR15",
			code: "PR15",
			name: "Olive Oil Lias Hair",
			desc: "Soin nourrissant enrichi à l'huile d'olive.",
			price: 1800,
			subCategory: "Produits",
			image: P_15_1_default
		},
		{
			id: "PR16",
			code: "PR16",
			name: "Braid Formula",
			desc: "Facilite les tresses et protège cheveux.",
			price: 7e3,
			subCategory: "Produits",
			image: P_16_1_default
		},
		{
			id: "PR17",
			code: "PR17",
			name: "Ukebay Lace Tint Mousse",
			desc: "Mousse lace tint au fini naturel.",
			price: 2500,
			subCategory: "Produits",
			image: P_17_1_default
		},
		{
			id: "PR18",
			code: "PR18",
			name: "Ouba A Sike",
			desc: "Produit capillaire nourrissant et adoucissant efficace.",
			price: 3500,
			subCategory: "Produits",
			image: P_18_1_default
		},
		{
			id: "PR19",
			code: "PR19",
			name: "Keratin",
			desc: "Soin réparateur enrichi en kératine protectrice.",
			price: 5e3,
			subCategory: "Produits",
			image: P_19_1_default
		},
		{
			id: "PR20",
			code: "PR20",
			name: "Beckon Honey Essence",
			desc: "Essence capillaire au miel hydratant intense.",
			price: 4e3,
			subCategory: "Produits",
			image: P_20_1_default
		},
		{
			id: "PR21",
			code: "PR21",
			name: "Skala Expert",
			desc: "Crème capillaire nourrissante multi-usages efficace.",
			price: 5e3,
			subCategory: "Produits",
			image: P_21_1_default
		},
		{
			id: "PR22",
			code: "PR22",
			name: "Dexe A Wash Black",
			desc: "Coloration noire rapide et pratique quotidienne.",
			price: 2e3,
			subCategory: "Produits",
			image: P_22_1_default
		},
		{
			id: "PR23",
			code: "PR23",
			name: "Dexe Black Hair Shampoo",
			desc: "Shampooing colorant noir au rendu naturel.",
			price: 4e3,
			subCategory: "Produits",
			image: P_23_1_default
		}
	],
	equipement: [
		{
			id: "EQ1",
			code: "EQ1",
			name: "Peigne chauffant",
			desc: "Lisse rapidement cheveux et perruques épaisses.",
			price: 1e4,
			fromPrice: true,
			subCategory: "Équipement",
			badge: "Best-seller",
			image: E_1_1_default
		},
		{
			id: "EQ2",
			code: "EQ2",
			name: "Fer à lisser",
			desc: "Appareil pratique pour cheveux parfaitement lisses.",
			price: 17e3,
			subCategory: "Équipement",
			image: E_2_1_default
		},
		{
			id: "EQ3",
			code: "EQ3",
			name: "Peigne chauffant",
			desc: "Chauffage rapide avec coiffage précis efficace.",
			price: 15e3,
			subCategory: "Équipement",
			image: E_3_1_default
		},
		{
			id: "EQ4",
			code: "EQ4",
			name: "Fer à boucler",
			desc: "Crée des boucles souples et durables.",
			price: 22e3,
			subCategory: "Équipement",
			image: E_4_1_default
		},
		{
			id: "EQ5",
			code: "EQ5",
			name: "Brosse à lisser",
			desc: "Brosse pratique pour lisser sans effort.",
			price: 3e3,
			subCategory: "Équipement",
			image: E_5_1_default
		},
		{
			id: "EQ6",
			code: "EQ6",
			name: "Kit de peignes",
			desc: "Ensemble complet pour coiffure quotidienne pratique.",
			price: 1500,
			subCategory: "Équipement",
			badge: "Nouveau",
			image: E_6_1_default
		},
		{
			id: "EQ7",
			code: "EQ7",
			name: "Brosse",
			desc: "Brosse légère adaptée à tous cheveux.",
			price: 750,
			subCategory: "Équipement",
			image: E_7_1_default
		},
		{
			id: "EQ8",
			code: "EQ8",
			name: "Brosse",
			desc: "Brosse résistante pour coiffage quotidien facile.",
			price: 1500,
			subCategory: "Équipement",
			image: E_8_1_default
		},
		{
			id: "EQ9",
			code: "EQ9",
			name: "Peigne pour perruque",
			desc: "Peigne spécial entretien délicat des perruques.",
			price: 1500,
			subCategory: "Équipement",
			image: E_9_1_default
		},
		{
			id: "EQ10",
			code: "EQ10",
			name: "Peigne à queue",
			desc: "Sépare facilement les mèches avec précision.",
			price: 500,
			subCategory: "Équipement",
			image: E_10_1_default
		},
		{
			id: "EQ11",
			code: "EQ11",
			name: "Peigne à brushing",
			desc: "Idéal pour brushing rapide et soigné quotidien.",
			price: 2e3,
			fromPrice: true,
			subCategory: "Équipement",
			image: E_11_1_default
		},
		{
			id: "EQ12",
			code: "EQ12",
			name: "Peigne à lame",
			desc: "Accessoire pratique pour coupes et finitions.",
			price: 1e3,
			subCategory: "Équipement",
			image: E_12_1_default
		},
		{
			id: "EQ13",
			code: "EQ13",
			name: "Pince à épiler",
			desc: "Retire facilement cheveux fins et baby hair.",
			price: 1e3,
			subCategory: "Équipement",
			image: E_13_1_default
		},
		{
			id: "EQ14",
			code: "EQ14",
			name: "Peigne à grandes dents",
			desc: "Démêle efficacement cheveux bouclés sans casser.",
			price: 300,
			subCategory: "Équipement",
			image: E_14_1_default
		},
		{
			id: "EQ15",
			code: "EQ15",
			name: "Water Sprayer",
			desc: "Vaporisateur pratique pour humidifier les cheveux.",
			price: 1500,
			subCategory: "Équipement",
			image: E_15_1_default
		},
		{
			id: "EQ16",
			code: "EQ16",
			name: "Barber Shop Sprayer",
			desc: "Spray professionnel pour coiffure et barbier.",
			price: 1500,
			subCategory: "Équipement",
			image: E_16_1_default
		},
		{
			id: "EQ17",
			code: "EQ17",
			name: "Brosse Dread",
			desc: "Brosse adaptée à l'entretien des dreadlocks.",
			price: 2500,
			subCategory: "Équipement",
			image: E_17_1_default
		},
		{
			id: "EQ18",
			code: "EQ18",
			name: "Dégraisseur",
			desc: "Nettoyage efficace des outils et surfaces.",
			price: 17500,
			subCategory: "Équipement",
			image: E_18_1_default
		},
		{
			id: "EQ19",
			code: "EQ19",
			name: "Masseur de cou",
			desc: "Appareil relaxant pour massages confortables quotidiens.",
			price: 12e4,
			subCategory: "Équipement",
			image: E_19_1_default
		},
		{
			id: "EQ20",
			code: "EQ20",
			name: "Kit de faux ongles",
			desc: "Kit complet pour pose d'ongles esthétique.",
			price: 5e3,
			subCategory: "Équipement",
			image: E_20_1_default
		},
		{
			id: "EQ21",
			code: "EQ21",
			name: "Gratte-tête",
			desc: "Accessoire relaxant pour massage du cuir chevelu.",
			price: 2500,
			subCategory: "Équipement",
			image: E_21_1_default
		}
	],
	promotion: [
		{
			id: "PROMO1",
			code: "PROMO1",
			name: "Bob Wigs Promotionnel",
			desc: "Carré chic aux reflets miel.",
			price: 37e3,
			oldPrice: 47e3,
			badge: "★ Limité",
			subCategory: "Promotion",
			image: promo_1_default
		},
		{
			id: "PROMO2",
			code: "PROMO2",
			name: "Bob Wigs Promotionnel",
			desc: "Dégradé élégant, style moderne tendance.",
			price: 37e3,
			oldPrice: 47e3,
			badge: "★ Limité",
			subCategory: "Promotion",
			image: promo_2_default
		},
		{
			id: "PROMO3",
			code: "PROMO3",
			name: "Bob Wigs Promotionnel",
			desc: "Coupe lisse avec contraste raffiné.",
			price: 37e3,
			oldPrice: 47e3,
			badge: "★ Limité",
			subCategory: "Promotion",
			image: promo_3_default
		},
		{
			id: "PROMO4",
			code: "PROMO4",
			name: "Bob Wigs Promotionnel",
			desc: "Tons chauds pour look lumineux.",
			price: 37e3,
			oldPrice: 47e3,
			badge: "★ Limité",
			subCategory: "Promotion",
			image: promo_4_default
		},
		{
			id: "PROMO5",
			code: "PROMO5",
			name: "Bob Wigs Promotionnel",
			desc: "Style glamour aux nuances cuivrées.",
			price: 37e3,
			oldPrice: 47e3,
			badge: "★ Limité",
			subCategory: "Promotion",
			image: promo_5_default
		},
		{
			id: "PROMO6",
			code: "PROMO6",
			name: "Bob Wigs Promotion",
			desc: "Mélange naturel avec touches caramel.",
			price: 37e3,
			oldPrice: 47e3,
			badge: "★ Limité",
			subCategory: "Promotion",
			image: promo_6_default
		},
		{
			id: "PROMO7",
			code: "PROMO7",
			name: "Bob Wigs Promotionnel",
			desc: "Brun profond, finition douce élégante.",
			price: 37e3,
			oldPrice: 47e3,
			badge: "★ Limité",
			subCategory: "Promotion",
			image: promo_7_default
		},
		{
			id: "PROMO8",
			code: "PROMO8",
			name: "Bob Wigs Promotionnel",
			desc: "Carré tendance au rendu naturel.",
			price: 37e3,
			oldPrice: 47e3,
			badge: "★ Limité",
			subCategory: "Promotion",
			image: promo_8_default
		},
		{
			id: "PROMO9",
			code: "PROMO9",
			name: "Bob Promotionnel",
			desc: "Bordeaux intense pour style audacieux.",
			price: 37e3,
			oldPrice: 47e3,
			badge: "★ Limité",
			subCategory: "Promotion",
			image: promo_9_default
		},
		{
			id: "PROMO10",
			code: "PROMO10",
			name: "Bob Wigs Promotionnel",
			desc: "Couleur vibrante avec allure sophistiquée.",
			price: 37e3,
			oldPrice: 47e3,
			badge: "★ Limité",
			subCategory: "Promotion",
			image: promo_10_default
		},
		{
			id: "PROMO11",
			code: "PROMO11",
			name: "Coupe Carré Frange",
			desc: "Coupe courte pratique avec frange légère.",
			price: 37e3,
			oldPrice: 47e3,
			badge: "★ Limité",
			subCategory: "Promotion",
			image: promo_11_default
		}
	]
};
function countFor(slug, singular, plural) {
	const n = CATALOG_ITEMS[slug]?.length ?? 0;
	return {
		count: n,
		countLabel: `${n} ${n > 1 ? plural ?? `${singular}s` : singular}`
	};
}
({ ...countFor("coiffure", "Création", "Créations") }), { ...countFor("perruques", "Création", "Créations") }, { ...countFor("mariage", "Création", "Créations") }, { ...countFor("produits", "Produit", "Produits") }, { ...countFor("equipement", "Équipement", "Équipements") }, { ...countFor("promotion", "Promo", "Promos") };
var TESTIMONIALS = [
	{
		name: "Laitifa Segda",
		text: "C'était super et magique à la fois",
		rating: 5
	},
	{
		name: "Venance Koffi",
		text: "Très bien",
		rating: 5
	},
	{
		name: "Sampawende Maelyse",
		text: "Perfect",
		rating: 5
	},
	{
		name: "Nana Yasmine Zoure",
		text: "C'est vraiment cool",
		rating: 5
	},
	{
		name: "Adèle Sawadogo",
		text: "C'est jolie dès 😍🥰",
		rating: 5
	},
	{
		name: "Eliane Koutiebou Silga",
		text: "Paaatiiiiii, très joli et moins cher ❤️",
		rating: 5
	}
];
//#endregion
//#region src/assets/icone/page-daccueil.svg
var page_daccueil_default = "data:image/svg+xml,%3c?xml%20version='1.0'%20standalone='no'?%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%2020010904//EN'%20'http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd'%3e%3csvg%20version='1.0'%20xmlns='http://www.w3.org/2000/svg'%20width='512.000000pt'%20height='512.000000pt'%20viewBox='0%200%20512.000000%20512.000000'%20preserveAspectRatio='xMidYMid%20meet'%3e%3cg%20transform='translate(0.000000,512.000000)%20scale(0.100000,-0.100000)'%20fill='%23000000'%20stroke='none'%3e%3cpath%20d='M1301%203682%20l-1301%20-1146%2024%20-30%20c12%20-17%2047%20-46%2077%20-64%2051%20-32%2058%20-33%20134%20-30%2069%204%2090%209%20151%2041%2053%2028%20329%20256%201140%20942%20588%20498%201072%20905%201076%20905%204%200%20450%20-397%20991%20-882%20558%20-500%201010%20-898%201043%20-918%20116%20-70%20251%20-97%20335%20-68%2051%2017%20104%2053%20128%2086%20l21%2030%20-832%20753%20c-458%20415%20-1024%20928%20-1259%201141%20l-427%20386%20-1301%20-1146z'/%3e%3cpath%20d='M4010%204005%20l0%20-304%20245%20-208%20c135%20-114%20250%20-209%20255%20-211%206%20-2%2010%20189%2010%20512%20l0%20516%20-255%200%20-255%200%200%20-305z'/%3e%3cpath%20d='M1642%203182%20l-941%20-787%200%20-1013%20c-1%20-1115%20-4%20-1058%2060%20-1081%2022%20-8%20231%20-11%20679%20-11%20l647%200%206%20412%20c4%20227%207%20483%207%20568%200%20136%202%20159%2020%20187%2040%2066%2051%2068%20385%2068%20165%200%20317%20-4%20337%20-8%2046%20-10%2096%20-51%20114%20-94%2011%20-26%2014%20-140%2014%20-578%20l0%20-545%20650%200%20c718%200%20692%20-2%20727%2063%2017%2030%2018%2098%2021%201027%20l2%20996%20-881%20784%20c-485%20432%20-888%20788%20-894%20792%20-8%205%20-364%20-287%20-953%20-780z'/%3e%3c/g%3e%3c/svg%3e";
//#endregion
//#region src/assets/icone/soutien-technique.svg
var soutien_technique_default = "/assets/soutien-technique-BSXbW0Kk.svg";
//#endregion
//#region src/assets/icone/galerie-dimages.svg
var galerie_dimages_default = "data:image/svg+xml,%3c?xml%20version='1.0'%20standalone='no'?%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%2020010904//EN'%20'http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd'%3e%3csvg%20version='1.0'%20xmlns='http://www.w3.org/2000/svg'%20width='512.000000pt'%20height='512.000000pt'%20viewBox='0%200%20512.000000%20512.000000'%20preserveAspectRatio='xMidYMid%20meet'%3e%3cg%20transform='translate(0.000000,512.000000)%20scale(0.100000,-0.100000)'%20fill='%23000000'%20stroke='none'%3e%3cpath%20d='M1253%204675%20c-174%20-47%20-317%20-182%20-376%20-354%20l-22%20-66%20-3%20-1215%20c-2%20-798%201%20-1242%207%20-1295%2013%20-95%2067%20-215%20130%20-287%2051%20-58%20136%20-115%20221%20-148%20l65%20-25%201683%20-3%20c1853%20-3%201745%20-6%201874%2059%20130%2066%20247%20220%20277%20367%208%2037%2011%20428%2011%201280%200%201358%203%201292%20-65%201421%20-60%20114%20-166%20207%20-290%20254%20l-60%2022%20-1700%202%20c-1438%202%20-1708%200%20-1752%20-12z%20m3372%20-419%20c69%20-29%2065%2021%2063%20-831%20l-3%20-769%20-352%20409%20c-238%20278%20-365%20419%20-395%20437%20-131%2080%20-285%2078%20-411%20-5%20-34%20-23%20-167%20-175%20-459%20-525%20l-411%20-493%20-152%20150%20c-191%20189%20-222%20206%20-370%20206%20-164%200%20-163%201%20-537%20-373%20l-318%20-317%200%201018%20c0%201125%20-4%201063%2063%201092%2048%2021%203231%2022%203282%201z'/%3e%3cpath%20d='M1790%204032%20c-73%20-24%20-125%20-59%20-183%20-121%20-155%20-166%20-149%20-420%2014%20-584%20246%20-246%20659%20-111%20719%20234%2024%20136%20-26%20275%20-134%20377%20-84%2078%20-148%20104%20-271%20109%20-68%202%20-104%20-1%20-145%20-15z'/%3e%3cpath%20d='M267%202325%20c-157%20-523%20-261%20-887%20-264%20-924%20-17%20-183%2097%20-385%20260%20-464%2031%20-15%20232%20-75%20445%20-132%20359%20-96%20808%20-216%202372%20-635%20333%20-90%20632%20-165%20665%20-167%20172%20-14%20354%2080%20442%20228%2020%2034%2069%20173%20133%20378%2056%20178%20104%20330%20107%20338%204%2011%20-257%2013%20-1578%2013%20-1527%200%20-1587%201%20-1678%2020%20-251%2052%20-474%20233%20-568%20463%20-69%20168%20-66%20122%20-72%20974%20l-6%20771%20-258%20-863z'/%3e%3c/g%3e%3c/svg%3e";
//#endregion
//#region src/assets/icone/catalogue.svg
var catalogue_default = "data:image/svg+xml,%3c?xml%20version='1.0'%20standalone='no'?%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%2020010904//EN'%20'http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd'%3e%3csvg%20version='1.0'%20xmlns='http://www.w3.org/2000/svg'%20width='512.000000pt'%20height='512.000000pt'%20viewBox='0%200%20512.000000%20512.000000'%20preserveAspectRatio='xMidYMid%20meet'%3e%3cg%20transform='translate(0.000000,512.000000)%20scale(0.100000,-0.100000)'%20fill='%23000000'%20stroke='none'%3e%3cpath%20d='M661%204500%20c-87%20-31%20-154%20-90%20-199%20-175%20l-27%20-50%200%20-1300%200%20-1300%2028%20-53%20c36%20-69%2097%20-128%20161%20-158%2036%20-16%20319%20-76%20938%20-199%20488%20-96%20891%20-175%20897%20-175%208%200%2011%20459%2011%201554%20l0%201554%20-412%2081%20c-227%2045%20-595%20117%20-818%20161%20-243%2048%20-428%2080%20-465%2080%20-33%20-1%20-84%20-9%20-114%20-20z%20m929%20-922%20c147%20-68%20230%20-209%20230%20-392%20l0%20-62%2055%20-23%20c70%20-29%20137%20-101%20156%20-168%2012%20-43%209%20-86%20-25%20-433%20-21%20-212%20-44%20-404%20-51%20-427%20-29%20-97%20-130%20-173%20-230%20-173%20-70%200%20-689%20145%20-732%20171%20-46%2029%20-98%2092%20-111%20137%20-18%2059%20-104%20833%20-97%20875%2016%20110%20111%20202%20221%20215%2041%204%2043%206%2063%2061%2041%20110%20122%20191%20234%20232%2076%2028%20212%2022%20287%20-13z'/%3e%3cpath%20d='M1352%203430%20c-45%20-19%20-91%20-62%20-111%20-104%20-12%20-23%20-21%20-47%20-21%20-53%200%20-5%2033%20-17%2073%20-26%2039%20-9%20137%20-32%20216%20-51%20l144%20-34%20-6%2065%20c-8%2080%20-42%20143%20-99%20180%20-32%2022%20-55%2028%20-107%2030%20-36%202%20-76%20-2%20-89%20-7z'/%3e%3cpath%20d='M992%203114%20c-45%20-31%20-45%20-33%203%20-449%2024%20-218%2049%20-404%2054%20-414%206%20-10%2016%20-22%2023%20-28%2015%20-13%20610%20-153%20648%20-153%2028%200%2065%2029%2074%2057%203%2010%2021%20182%2041%20382%2030%20297%2034%20369%2025%20392%20-12%2028%20-30%2039%20-30%2019%200%20-6%20-11%20-22%20-25%20-35%20-50%20-51%20-131%20-17%20-142%2060%20l-5%2040%20-222%2053%20c-121%2029%20-224%2053%20-228%2052%20-5%200%20-8%20-11%20-8%20-25%200%20-38%20-25%20-92%20-48%20-104%20-33%20-18%20-69%20-13%20-99%2013%20-26%2023%20-28%2029%20-25%2090%201%2036%20-1%2066%20-6%2066%20-4%200%20-18%20-7%20-30%20-16z'/%3e%3cpath%20d='M3462%204361%20c-441%20-87%20-804%20-160%20-807%20-163%20-3%20-3%20-4%20-440%20-3%20-973%20l3%20-967%2034%2047%20c128%20178%20361%20333%20589%20391%20499%20128%201012%20-118%201233%20-590%2067%20-145%20107%20-349%2095%20-496%20l-5%20-75%2024%2030%20c14%2017%2034%2054%2045%2083%2020%2053%2020%2073%2018%201340%20l-3%201287%20-27%2050%20c-35%2068%20-97%20128%20-166%20162%20-45%2022%20-71%2027%20-141%2030%20-76%202%20-177%20-16%20-889%20-156z%20m692%20-265%20c47%20-20%2093%20-63%20124%20-115%20l27%20-46%203%20-338%20c3%20-286%201%20-346%20-13%20-386%20-20%20-60%20-66%20-116%20-118%20-143%20-53%20-27%20-923%20-228%20-985%20-228%20-90%200%20-190%2068%20-229%20155%20-16%2035%20-18%2079%20-21%20352%20-4%20345%202%20397%2048%20462%2059%2081%2072%2085%20573%20203%20484%20113%20513%20117%20591%2084z'/%3e%3cpath%20d='M3600%203845%20c-480%20-112%20-472%20-109%20-485%20-178%20-4%20-18%20-5%20-162%20-3%20-320%20l3%20-289%2028%20-24%20c15%20-13%2039%20-24%2052%20-24%2033%200%20880%20197%20905%20210%2012%206%2025%2022%2030%2036%2013%2034%2013%20605%200%20639%20-6%2015%20-24%2032%20-45%2040%20-19%208%20-36%2015%20-37%2014%20-2%20-1%20-203%20-48%20-448%20-104z'/%3e%3cpath%20d='M3377%202545%20c-169%20-32%20-315%20-107%20-445%20-230%20-189%20-178%20-282%20-391%20-282%20-646%200%20-65%207%20-149%2015%20-187%20100%20-477%20565%20-787%201044%20-697%2085%2016%20195%2054%20247%2085%20l31%2018%20204%20-205%20c112%20-112%20223%20-216%20247%20-230%2036%20-21%2052%20-25%2098%20-21%2090%208%20144%2062%20152%20151%203%2038%20-1%2064%20-13%2088%20-10%2019%20-109%20126%20-221%20239%20l-203%20205%2031%2045%20c171%20249%20201%20600%2074%20875%20-113%20245%20-332%20429%20-591%20496%20-105%2027%20-283%2034%20-388%2014z%20m278%20-340%20c206%20-43%20378%20-212%20425%20-415%2021%20-91%2016%20-216%20-14%20-300%20-136%20-393%20-620%20-507%20-912%20-216%20-112%20112%20-164%20235%20-164%20389%200%20156%2052%20280%20165%20392%20137%20137%20312%20189%20500%20150z'/%3e%3c/g%3e%3c/svg%3e";
//#endregion
//#region src/assets/icone/contact.svg
var contact_default = "data:image/svg+xml,%3c?xml%20version='1.0'%20standalone='no'?%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%2020010904//EN'%20'http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd'%3e%3csvg%20version='1.0'%20xmlns='http://www.w3.org/2000/svg'%20width='512.000000pt'%20height='512.000000pt'%20viewBox='0%200%20512.000000%20512.000000'%20preserveAspectRatio='xMidYMid%20meet'%3e%3cg%20transform='translate(0.000000,512.000000)%20scale(0.100000,-0.100000)'%20fill='%23000000'%20stroke='none'%3e%3cpath%20d='M2389%204680%20c-448%20-76%20-800%20-424%20-880%20-870%20-18%20-101%20-15%20-296%206%20-394%2037%20-176%20114%20-334%20231%20-477%20152%20-186%20415%20-332%20660%20-368%2058%20-8%2058%20-9%20-37%20-10%20-300%20-4%20-579%20-68%20-847%20-196%20-633%20-303%20-1061%20-948%20-1089%20-1642%20-6%20-151%20-6%20-151%2021%20-197%2016%20-28%2043%20-55%2070%20-71%20l43%20-25%201989%200%20c1941%200%201990%201%202031%2020%2029%2013%2053%2034%2074%2067%20l31%2048%20-6%20155%20c-16%20460%20-209%20904%20-541%201249%20-363%20376%20-855%20585%20-1394%20592%20-95%201%20-95%202%20-37%2010%20161%2024%20352%20103%20481%20200%20190%20143%20324%20337%20389%20563%20174%20601%20-218%201231%20-834%201342%20-80%2014%20-286%2017%20-361%204z%20m301%20-210%20c326%20-52%20599%20-293%20690%20-610%2031%20-107%2038%20-289%2015%20-401%20-51%20-252%20-219%20-474%20-446%20-588%20-145%20-72%20-233%20-93%20-389%20-93%20-147%200%20-239%2020%20-367%2081%20-454%20218%20-622%20779%20-361%201210%20178%20294%20521%20454%20858%20401z%20m205%20-2131%20c732%20-63%201338%20-569%201525%20-1274%2029%20-108%2060%20-308%2060%20-386%20l0%20-39%20-1921%200%20-1922%200%207%2096%20c46%20618%20401%201150%20953%201428%20183%2092%20408%20157%20609%20175%20142%2012%20548%2013%20689%200z'/%3e%3c/g%3e%3c/svg%3e";
//#endregion
//#region src/assets/icone/profil.svg
var profil_default = "data:image/svg+xml,%3c?xml%20version='1.0'%20standalone='no'?%3e%3c!DOCTYPE%20svg%20PUBLIC%20'-//W3C//DTD%20SVG%2020010904//EN'%20'http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd'%3e%3csvg%20version='1.0'%20xmlns='http://www.w3.org/2000/svg'%20width='512.000000pt'%20height='512.000000pt'%20viewBox='0%200%20512.000000%20512.000000'%20preserveAspectRatio='xMidYMid%20meet'%3e%3cg%20transform='translate(0.000000,512.000000)%20scale(0.100000,-0.100000)'%20fill='%23000000'%20stroke='none'%3e%3cpath%20d='M2349%204835%20c-347%20-66%20-643%20-266%20-827%20-559%20-241%20-383%20-250%20-867%20-24%20-1260%20251%20-436%20748%20-676%201245%20-601%20480%2072%20880%20432%201002%20901%2089%20344%2030%20696%20-168%20992%20-171%20256%20-417%20428%20-726%20509%20-121%2032%20-380%2041%20-502%2018z%20m436%20-329%20c265%20-73%20480%20-254%20595%20-499%2060%20-128%2083%20-237%2083%20-387%20-1%20-133%20-18%20-219%20-67%20-340%20-101%20-252%20-339%20-459%20-611%20-532%20-115%20-31%20-336%20-30%20-450%201%20-274%2074%20-510%20279%20-611%20531%20-49%20121%20-66%20207%20-67%20340%20-1%20243%2081%20453%20242%20624%20132%20139%20299%20233%20481%20272%2087%2018%20323%2012%20405%20-10z'/%3e%3cpath%20d='M2385%202074%20c-16%20-2%20-73%20-9%20-125%20-15%20-295%20-33%20-638%20-151%20-887%20-307%20-357%20-221%20-617%20-537%20-732%20-889%20-71%20-214%20-92%20-463%20-46%20-525%2030%20-40%2086%20-68%20137%20-68%2093%200%20158%2081%20158%20196%200%20140%2058%20353%20133%20486%20165%20294%20443%20528%20791%20666%20593%20235%201304%20170%201811%20-166%20363%20-240%20576%20-578%20603%20-958%206%20-82%2014%20-120%2028%20-145%2061%20-104%20209%20-107%20269%20-4%2030%2051%2033%20133%209%20293%20-109%20737%20-827%201332%20-1722%201427%20-123%2013%20-348%2018%20-427%209z'/%3e%3c/g%3e%3c/svg%3e";
//#endregion
//#region src/components/AppShell.tsx
var NAV = [
	{
		to: "/",
		label: "Accueil",
		icon: page_daccueil_default,
		color: "var(--gold-deep)"
	},
	{
		to: "/services",
		label: "Services",
		icon: soutien_technique_default,
		color: "var(--crimson)"
	},
	{
		to: "/gallery",
		label: "Galerie",
		icon: galerie_dimages_default,
		color: "var(--gold)"
	},
	{
		to: "/catalog",
		label: "Catalogue",
		icon: catalogue_default,
		color: "var(--gold-deep)"
	},
	{
		to: "/contact",
		label: "Contact",
		icon: contact_default,
		color: "var(--crimson)"
	},
	{
		to: "/profile",
		label: "Profil",
		icon: profil_default,
		color: "var(--gold)"
	}
];
function WhatsAppIcon({ className = "", style }) {
	return /* @__PURE__ */ jsx("svg", {
		viewBox: "0 0 32 32",
		className,
		style,
		fill: "currentColor",
		"aria-hidden": "true",
		children: /* @__PURE__ */ jsx("path", { d: "M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.4-1.318.07-.245.27-1.318.27-1.477 0-.36-.158-.474-.443-.616-.317-.157-2.063-.946-2.213-.946zM16.272 25.6c-1.692 0-3.354-.46-4.81-1.318l-.345-.205-3.555.934.95-3.473-.223-.36a9.41 9.41 0 0 1-1.435-5.04c0-5.225 4.245-9.47 9.47-9.47s9.47 4.245 9.47 9.47-4.244 9.47-9.47 9.47zm0-20.804C9.984 4.796 4.88 9.9 4.88 16.188c0 2.022.53 4.022 1.535 5.78L4.8 27.764l5.96-1.55a11.353 11.353 0 0 0 5.512 1.394h.005c6.288 0 11.4-5.105 11.4-11.393 0-3.046-1.185-5.91-3.337-8.063a11.42 11.42 0 0 0-8.067-3.346z" })
	});
}
function AppShell({ children, title, subtitle, headerRight }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ jsxs("div", {
		className: "relative mx-auto min-h-screen max-w-md overflow-hidden",
		children: [
			/* @__PURE__ */ jsxs("div", {
				"aria-hidden": true,
				className: "pointer-events-none fixed inset-0 -z-10 mx-auto max-w-md",
				children: [/* @__PURE__ */ jsx("div", { className: "absolute -top-24 -left-16 h-72 w-72 rounded-full bg-[var(--gold-soft)] opacity-25 blur-3xl" }), /* @__PURE__ */ jsx("div", { className: "absolute bottom-10 left-1/4 h-60 w-60 rounded-full bg-[var(--gold-soft)] opacity-20 blur-3xl" })]
			}),
			/* @__PURE__ */ jsxs("header", {
				className: "sticky top-0 z-30 px-5 pt-5 pb-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "glass-strong flex items-center justify-between rounded-full px-4 py-2.5",
					children: [/* @__PURE__ */ jsxs(Link, {
						to: "/",
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ jsx("span", {
							className: "grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-white shadow-soft ring-1 ring-black/5",
							children: /* @__PURE__ */ jsx("img", {
								src: DESMOHAIR_default,
								alt: "Desmohair",
								className: "h-full w-full object-contain p-0.5"
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "leading-tight",
							children: [/* @__PURE__ */ jsx("p", {
								className: "font-display text-sm font-semibold uppercase tracking-[0.08em]",
								children: "Desmohair"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[10px] text-muted-foreground",
								children: "Parfait Design"
							})]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("a", {
							href: waLink(),
							target: "_blank",
							rel: "noreferrer",
							"aria-label": "WhatsApp",
							className: "relative grid h-10 w-10 place-items-center rounded-full transition-transform duration-200 hover:scale-110 active:scale-95",
							style: {
								background: "linear-gradient(180deg, oklch(1 0 0 / 0.85), oklch(1 0 0 / 0.55))",
								backdropFilter: "blur(18px) saturate(180%)",
								border: "1px solid oklch(1 0 0 / 0.85)",
								boxShadow: "0 8px 20px -10px rgba(37,211,102,0.55), inset 0 1px 0 oklch(1 0 0 / 0.8)"
							},
							children: /* @__PURE__ */ jsx(WhatsAppIcon, {
								className: "h-5 w-5",
								style: { color: "#25D366" }
							})
						}), headerRight]
					})]
				}), title && /* @__PURE__ */ jsxs("div", {
					className: "mt-5 px-1 animate-fade-up",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "font-display text-3xl font-semibold leading-tight",
						children: title
					}), subtitle && /* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: subtitle
					})]
				})]
			}),
			/* @__PURE__ */ jsx("main", {
				className: "px-4 pb-32",
				children
			}),
			/* @__PURE__ */ jsx("nav", {
				className: "fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 px-4 pb-4 pt-2",
				children: /* @__PURE__ */ jsx("div", {
					className: "glass-nav flex items-center justify-between rounded-full px-2 py-2",
					children: NAV.map(({ to, label, icon, color }) => /* @__PURE__ */ jsx(NavItem, {
						to,
						label,
						icon,
						color,
						pathname
					}, to))
				})
			})
		]
	});
}
function NavItem({ to, label, icon, color, pathname }) {
	const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
	return /* @__PURE__ */ jsxs(Link, {
		to,
		preload: "intent",
		className: "group relative flex flex-1 flex-col items-center gap-0.5 rounded-full px-1 py-1.5 transition-transform duration-200 hover:-translate-y-0.5 active:scale-95",
		children: [
			active && /* @__PURE__ */ jsx(motion.span, {
				initial: {
					opacity: 0,
					scale: .8
				},
				animate: {
					opacity: 1,
					scale: 1
				},
				className: "absolute inset-0 rounded-full",
				style: {
					background: "linear-gradient(180deg, oklch(1 0 0 / 0.9), oklch(1 0 0 / 0.6))",
					backdropFilter: "blur(18px) saturate(200%)",
					border: "1px solid oklch(1 0 0 / 0.95)",
					boxShadow: `0 10px 22px -10px oklch(0.78 0.1 85 / 0.5), inset 0 1px 0 oklch(1 0 0 / 0.85)`
				}
			}),
			/* @__PURE__ */ jsx(motion.span, {
				className: `relative grid h-7 w-7 place-items-center rounded-full transition-transform duration-300 ${active ? "animate-nav-pop" : "group-hover:scale-110"}`,
				whileHover: { scale: 1.15 },
				whileTap: { scale: .9 },
				children: /* @__PURE__ */ jsx("img", {
					src: icon,
					alt: "",
					className: "h-[18px] w-[18px] object-contain",
					style: {
						opacity: active ? 1 : .78,
						filter: active ? "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.18))" : "grayscale(0.15) brightness(0.9)"
					}
				})
			}),
			/* @__PURE__ */ jsx(motion.span, {
				className: "relative text-[9.5px] font-semibold uppercase tracking-[0.08em]",
				style: { color: active ? color : "oklch(0.5 0.015 60)" },
				whileHover: { y: -1 },
				children: label
			})
		]
	});
}
function GlassCard({ children, className = "" }) {
	return /* @__PURE__ */ jsx("div", {
		className: `glass rounded-[28px] ${className}`,
		children
	});
}
function SectionTitle({ title, action }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-5 mb-2 flex items-end justify-between px-1",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "font-display text-lg font-semibold",
			children: title
		}), action]
	});
}
//#endregion
//#region src/backend/client.ts
var supabaseUrl = "https://gjahsoafbclqpodnblnd.supabase.co";
var supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqYWhzb2FmYmNscXBvZG5ibG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NTkzOTEsImV4cCI6MjEwMDEzNTM5MX0.KehZbSzPBkTX7CMYnNGNEgxyeBrcJjG8hWpfaHqxpZQ";
console.log("URL utilisée :", supabaseUrl);
console.log("Clé utilisée :", "OK (présente)");
var supabase = createClient(supabaseUrl, supabaseAnonKey, { auth: {
	persistSession: true,
	autoRefreshToken: true
} });
var TABLES = {
	PROFILES: "profiles",
	GALLERY: "gallery",
	CATALOG: "catalog",
	SERVICES: "services",
	SALON_INFO: "salon_info",
	FAVORITES: "favorites",
	CAROUSEL_SLIDES: "carousel_slides",
	REVIEWS: "reviews",
	SAVED_PRODUCTS: "saved_products"
};
var BUCKETS = {
	GALLERY: "gallery",
	LOGO: "logo",
	BANNER: "banner",
	AVATAR: "avatars"
};
//#endregion
//#region src/backend/exceptions.ts
var ApiException = class ApiException extends Error {
	constructor(message) {
		super(message);
		this.name = "ApiException";
	}
	static fromError(error) {
		if (error instanceof ApiException) return error;
		const errorLower = (error instanceof Error ? error.message : String(error)).toLowerCase();
		if (errorLower.includes("invalid login credentials")) return new ApiException("Email ou mot de passe incorrect");
		if (errorLower.includes("user already registered")) return new ApiException("Un compte existe déjà avec cet email");
		if (errorLower.includes("password must be at least")) return new ApiException("Le mot de passe doit contenir au moins 6 caractères");
		if (errorLower.includes("rate limit")) return new ApiException("Trop de tentatives. Réessayez plus tard.");
		if (errorLower.includes("fetch") || errorLower.includes("network")) return new ApiException("Erreur réseau. Vérifiez votre connexion internet.");
		return new ApiException("Une erreur est survenue. Veuillez réessayer plus tard.");
	}
};
//#endregion
export { promo_1_default as C, Coupe_1_default as D, Coupe_5_default as E, promo_6_default as S, M1_1_default as T, waLinkFor as _, AppShell as a, P_1_1_default as b, WhatsAppIcon as c, LOCATION as d, SALONS as f, waLink as g, pickSalonFor as h, supabase as i, profil_default as l, TESTIMONIALS as m, BUCKETS as n, GlassCard as o, SOCIALS as p, TABLES as r, SectionTitle as s, ApiException as t, CATALOG_ITEMS as u, PB_34_1_default as v, M8_1_default as w, E_1_1_default as x, PB_1_1_default as y };
