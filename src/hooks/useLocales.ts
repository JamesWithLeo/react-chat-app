import { useTranslation } from "react-i18next";
import { useSettingsContext } from "../contexts/SettingsContext";
// config
import { allLangs, defaultLang } from "../config";

export default function useLocales() {
	const { i18n, t: translate } = useTranslation();

	const { onChangeDirectionByLang } = useSettingsContext();

	const langStorage = localStorage.getItem("i18nextLng");

	const currentLang =
		allLangs.find((_lang) => _lang.value === langStorage) || defaultLang;

	const handleChangeLanguage = (newlang: string) => {
		i18n.changeLanguage(newlang);
		onChangeDirectionByLang(newlang);
	};

	return {
		onChangeLang: handleChangeLanguage,
		translate: (
			text:
				| string
				| TemplateStringsArray
				| (string | TemplateStringsArray)[],
			options: string | undefined,
		) => translate(text, options),
		currentLang,
		allLangs,
	};
}
