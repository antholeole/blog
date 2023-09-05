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
        fs.writeFileSync(`./out/${fileName}.html`, marked.parse(md))
    } else {
        fs.copyFileSync(`./blog/${file}`, `./out/${file}`)
    }
});