// remark-highlight.js
import { visit } from 'unist-util-visit'

export default function remarkHighlight() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      const regex = /==([^=]+)==/g
      const matches = [...node.value.matchAll(regex)]

      if (matches.length === 0) return

      const children = []
      let lastIndex = 0

      for (const match of matches) {
        const [fullMatch, text] = match
        const start = match.index
        const end = start + fullMatch.length

        if (start > lastIndex) {
          children.push({ type: 'text', value: node.value.slice(lastIndex, start) })
        }

        children.push({
          type: 'html',
          value: `<mark>${text}</mark>`,
        })

        lastIndex = end
      }

      if (lastIndex < node.value.length) {
        children.push({ type: 'text', value: node.value.slice(lastIndex) })
      }

      parent.children.splice(index, 1, ...children)
    })
  }
}
