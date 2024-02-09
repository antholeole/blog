const marked = require("marked")
const fs = require("fs")

fs.mkdir("./out", () => { })

const staticPath = "./static/"
const outPath = "./out/"

const genOutput = (fileName, html) => {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="/index.css"><title>Anthony Oleinik - ${fileName}</title></head> <body><article>${html}</article></body></html>`
}

const fileToMd = (input) => {
    const [path, file] = input.split(staticPath)
    console.log(path, file, input)
    const [fileName, filetype] = file.split(".")

    if (filetype == "md") {
        const md = fs.readFileSync(`${staticPath}/${file}`, "utf-8")
        const html = marked.parse(md)

        const output = genOutput(fileName, html)

        fs.writeFileSync(`${outPath}/${path}/${fileName}.html`, output)
    } else {
        fs.copyFileSync(`${staticPath}${path}/${file}`, `${outPath}${path}/${file}`)
    }
}

const traverseBlog = (path) => {
    fs.readdirSync(path).forEach(fsItem => {
        const fq = `${path}/${fsItem}`
        const isDir = fs.lstatSync(fq).isDirectory()

        if (isDir) {
            const dir = `${outPath}${fq}`.replace(staticPath, "")
            fs.mkdirSync(dir, () => {})
            traverseBlog(fq)
        } else {
            fileToMd(fq)
        }
    });
}

try {
    fs.rmdirSync(outPath, {recursive: true, force: true})
} catch (e) {}
fs.mkdirSync(outPath, () => {})

traverseBlog("./static")

