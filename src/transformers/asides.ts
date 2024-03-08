import type { Plugin } from 'unified'
import type { Node, Parent } from 'unist'
import type { Text } from 'mdast'
import { visit } from 'unist-util-visit'


const parenRegexp = /\([^\)]+\)/
export const remarkAside: Plugin<any> = () => {
    return (tree: Node) => {
        visit(tree, 'paragraph', (paragraphNode: Parent) => {
            const replacementChildren = []
            for (let child of paragraphNode.children) {
                if (child.type !== 'text') {
                    return
                }

                const text = child as Text

                // we should track paren depth just in case we have a nested paren.
                // don't aside anything besides the outermost, though.
                let parenDepth = 0
                let currentSpan = ""
                const textParts = []
                for (let char of text.value) {
                    if (char === "(") {
                        parenDepth++

                        // if we just entered a paren, we should
                        // push the previous text as a text span.
                        if (parenDepth === 1) {
                            textParts.push({
                                type: "text",
                                value: currentSpan
                            })
                            currentSpan = ""
                        } else {
                            currentSpan += char
                        }
                    } else if (char === ")") {
                        parenDepth--
                        if (parenDepth === 0) {
                            textParts.push({
                                type: "element",
                                tagName: "span",
                                children: [{ type: "text", value: currentSpan }],
                            })

                            currentSpan = ""
                        } else {
                            currentSpan += char
                        }
                    } else {
                        currentSpan += char
                    }
                }

                textParts.push({ type: "text", value: currentSpan })

                // if it DOES equal one, we don't want to touch it.
                if (textParts.length !== 1) {
                    paragraphNode.type = "parent"
                    paragraphNode.children = textParts as any
                }
            }
        })
    }
};

