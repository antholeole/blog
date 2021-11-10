import { readdirSync,  } from 'fs'
import path from 'path'

const categoriesPath = path.join(process.cwd(), 'public/blog')

export const getBlogCategories = () => {
    return readdirSync(categoriesPath )
}

export const getCategoriesPosts = (category: string): string[] => {
    return readdirSync(path.join(categoriesPath, category)).filter((fileName) => fileName != 'index.md')
}