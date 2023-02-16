const fs = require("fs");

const COMPONENT_LIST = [
	"ContainedButtonPrimary",
	"ContainedButtonSecondary",
	"CtaButton",
	"NavLinks",
	"OutlinedButtonPrimary",
	"SymbolButton",
	"TextButton",
	"ImageWithText",
	"HorizontalCard",
	"VerticalCard",
	"VerticalCardOnCtaModal",
	"NumberInCircle",
	"SearchBar",
];

function writeToFile(componentName, extension, content) {
	fs.writeFile(componentName + extension, content, () => {});
	return 0;
}

function moveFile(componentName, extension) {
	fs.rename(
		componentName + extension,
		`${componentName}/${componentName}${extension}`,
		() => {}
	);
	return 0;
}

COMPONENT_LIST.forEach(componentName => {
	if (!fs.existsSync(componentName)) {
		fs.mkdirSync(componentName);
	}
	writeToFile(
		componentName,
		".js",
		`import styles from './${componentName}.module.sass';\n
export default function ${componentName}() {
    return <></>;
}`
	);
	writeToFile(componentName, ".module.sass", "");

	moveFile(componentName, ".js");
	moveFile(componentName, ".module.sass");

	return 0;
});
