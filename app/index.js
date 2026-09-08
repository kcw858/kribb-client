// @ts-nocheck
import "@babel/polyfill";

import React from "react";
import { render } from "react-dom";

import { App, TabletApp } from "./components/App";

import { configure } from "mobx";
import AccountStore from "./store/global/AccountStore";
import MonitorStore from "./store/global/MonitorStore";
import AlertStore from "./store/global/AlertStore";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEn from "./translations/translation.en";
import translationKo from "./translations/translation.ko";

i18n.use(initReactI18next).init({
	resources: {
		en: {
			translation: translationEn,
		},
		ko: {
			translation: translationKo,
		},
	},
	lng: "ko",
	fallbackLng: "ko",
	debug: false,
	keySeparator: false,
	interpolation: { escapeValue: false },
});

configure({
	enforceActions: "never",
});

AccountStore.checkIsLockLoop();
// AlertStore.getAlertListLoop();
MonitorStore.getMonitorListLoop();
AlertStore.getAlertCurrentLoop();

render(<App />, document.querySelector("#root"));
