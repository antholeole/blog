import type { Plugin } from 'unified'
import type { Node, Parent } from 'unist'
import type { Text } from 'mdast'
import { visit } from 'unist-util-visit'


export const remarkAside: Plugin<any> = () => {
    return (tree: Node) => {
        let sidenoteNum = 1
        visit(tree, 'paragraph', (paragraphNode: Parent) => {
            const modifiedChildren = []
            for (let child of paragraphNode.children) {
                if (child.type !== 'text') {
                    modifiedChildren.push(child)
                    continue
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

                        // if we just entered a paren:
                        // 1. we should add a label for where this sidenote is going.
                        // 2. we should push the previous text as a text span.
                        if (parenDepth === 1) {
                            // remove the space
                            if (currentSpan.at(-1) === " ") {
                                currentSpan = currentSpan.slice(0, -1)
                            }

                            textParts.push({
                                type: "text",
                                value: currentSpan
                            })

                            // add the label
                            textParts.push({
                                type: "element",
                                data: {
                                    hName: "label",
                                    hProperties: {
                                        className: ["margin-toggle", "sidenote-number"],
                                        for: `sn-${sidenoteNum}`
                                    }
                                }
                            })

                            // add the toggle
                            textParts.push({
                                type: "element",
                                data: {
                                    hName: "input",
                                    hProperties: {
                                        className: ["margin-toggle"],
                                        for: `sn-${sidenoteNum}`,
                                        type: "checkbox",
                                        id: `sn-${sidenoteNum}`
                                    }
                                }
                            })

                            sidenoteNum++
                            currentSpan = ""
                        } else {
                            currentSpan += char
                        }
                    } else if (char === ")") {
                        parenDepth--
                        if (parenDepth === 0) {
                            textParts.push({
                                type: "element",
                                children: [{ type: "text", value: currentSpan }],
                                data: {
                                    hName: "span",
                                    hProperties: {
                                        className: ["sidenote"]
                                    }
                                }
                            })

                            // re-add the space
                            currentSpan = ""
                        } else {
                            currentSpan += char
                        }
                    } else {
                        currentSpan += char
                    }
                }

                textParts.push({ type: "text", value: currentSpan })

                modifiedChildren.push(textParts)
            }

            paragraphNode.children = modifiedChildren.flat()
        })
    }
};

