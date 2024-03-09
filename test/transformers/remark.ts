import type { Plugin } from "unified"
import { unified } from "unified"
import markdownPlugin from "remark-parse"
import remark2rehype from "remark-rehype"
import html from "rehype-stringify"

export const testRemarkPlugin = async (
    markdown: string,
    plugins: Plugin[],
): Promise<String> => {
    var processor = unified()
        .use(markdownPlugin)

    for (let plugin of plugins) {
        processor.use(plugin)
    }

    processor
        .use(remark2rehype)
        .use(html)

    let raw = await processor()
        .process(markdown)

    return String(raw)
}

export const printAstPlugin: Plugin<[]> = () => {
  function transform(tree: any) {
    console.log(tree.children)
    console.log("BLAH")
  }

  return transform;
};