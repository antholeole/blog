const marked = require("marked")
const fs = require("fs")

fs.mkdir("./out", () => { })
fs.readdirSync("./blog").forEach(file => {
    if (file === ".gitkeep") {
        return
    }

    const [fileName, filetype] = file.split(".");

    if (filetype == "md") {
        const md = fs.readFileSync(`./blog/${file}`, "utf-8")
        const html = marked.parse(md)
        const output = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="/index.css"><title>Anthony Oleinik - ${fileName}</title></head> <body>${html}</body></html>`

        fs.writeFileSync(`./out/${fileName}.html`, output)
    } else {
        fs.copyFileSync(`./blog/${file}`, `./out/${file}`)
    }
});