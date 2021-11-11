import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { readFileSync } from 'fs'
import { join } from 'path'
import { Layout } from '../../../components/layout/layout'
import { getBlogCategories, getCategoriesPosts } from '../../../helpers/get_posts'
import { Breadcrumb } from 'react-bootstrap'
import { IMeta } from '../../../helpers/types'
import Link from 'next/link'
import { postTitle } from '../../../helpers/post_title'
import { capitalizeWords } from '../../../helpers/capitalize_words'
import Script from 'next/script'
import ReactMarkdown from 'react-markdown'
import CodeBlock from '../../../components/layout/code'


const BlogPost = ({ post, meta, titleSlug, category }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const title = postTitle(titleSlug, meta.title)

  return (
    <Layout>
      <article className="w-100">
        <Breadcrumb>
        <Link href="/blog" passHref>
          <Breadcrumb.Item href="#">Blog</Breadcrumb.Item>
        </Link>
        <Link href={`/blog/${category}`} passHref>
          <Breadcrumb.Item href="#">{capitalizeWords(category)}</Breadcrumb.Item>
        </Link>
        <Link href={`/blog/${category}/${titleSlug}`} passHref>
          <Breadcrumb.Item href="#">{title}</Breadcrumb.Item>
        </Link>
        </Breadcrumb>
        <h1>{title}</h1>
        {meta.date && <sub>{meta.date}</sub>}
        <ReactMarkdown components={CodeBlock}>{post}</ReactMarkdown>
      </article>
    </Layout>
  )
}

export default BlogPost

export const getStaticProps: GetStaticProps<
  { post: string, category: string, titleSlug: string, meta: IMeta }
> = async ({ params }) => {
  const { category, title } = params as { category: string, title: string }

  return {
    props: {
      titleSlug: title,
      category,
      post: readFileSync(join(process.cwd(), 'public/blog', category, title, 'content.md')).toString(),
      meta: JSON.parse(readFileSync(join(process.cwd(), 'public/blog', category, title, 'meta.json')).toString())
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

