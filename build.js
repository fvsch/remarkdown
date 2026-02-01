import { access, constants, writeFile } from "node:fs/promises"
import { join } from "node:path"
import * as prettier from "prettier"
import * as sass from "sass"

const sources = [
	["preset/remarkdown.scss", "dist/remarkdown.css"],
	["preset/remarkdown.attr.scss", "dist/remarkdown.attr.css"],
	["preset/remarkdown-zero.scss", "dist/remarkdown-zero.css"],
	["preset/remarkdown-zero.attr.scss", "dist/remarkdown-zero.attr.css"],
	["docs/demo.scss", "docs/demo.css"],
]

sources.forEach(buildStylesheet)

async function buildStylesheet([sourceFilename, outFilename]) {
	const sourceFile = join(import.meta.dirname, sourceFilename)
	const outFile = join(import.meta.dirname, outFilename)

	try {
		await access(sourceFile, constants.R_OK)
	} catch {
		console.error(`Missing file ${sourceFile}`)
		return
	}

	const compiled = await sass.compileAsync(sourceFile)
	const prettified = await prettier.format(compiled.css, {
		parser: "css",
	})
	await writeFile(outFile, prettified)
	console.log(`${sourceFilename} -> ${outFilename} (${prettified.length} B)`)
}
