import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import parse, { HTMLReactParserOptions } from 'html-react-parser'
import { marked } from 'marked'
import { contentHandler } from '../../../helpers/html_to_dom'
import { Layout } from '../../../components/layout/layout'
import { getBlogCategories, getCategoriesPosts } from '../../../helpers/get_posts'


const BlogPost = ({ post }: InferGetStaticPropsType<typeof getStaticProps>) => {
  

  return (
    <Layout>
      <article className="w-100">
      {contentHandler(post)}
        </article>
    </Layout>
  )
}

export default BlogPost

export const getStaticProps: GetStaticProps<{ post: string }> = async ({ params })  => {
  const { category, title } = params as { category: string, title: string }

  console.log(category, title)

  return {
    props: {
      post: marked(readFileSync(join(process.cwd(), 'public/blog', category, title, 'content.md')).toString())
    },
  }
}

export const getStaticPaths: GetStaticPaths = () => {
  const categories = getBlogCategories()
  
  const paths = categories.flatMap((category) => getCategoriesPosts(category).map((title) => ({
    params: {
      category,
      title
    }
  })))

  return {
    paths,
    fallback: false
  }
}

