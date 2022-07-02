import { platform } from 'os'
import { Accordion } from 'react-bootstrap'
import { Layout } from '../../components/layout/layout'
import { DmTestimonial } from '../../components/resume/testimonial/dm_testimonial'
import { MediumTestimonial } from '../../components/resume/testimonial/medium_testimonial'
import { YoutubeTestimonial } from '../../components/resume/testimonial/youtube_testimonial'

const Resume = () => {
    return <Layout>
        <h2>Anthony{'\''}s Resume</h2>
        <ul>
            <li><a href="https://docs.google.com/document/d/1ItpihRe3mluA8HYJxQgpoTlDwZ4R3GfQcEmMwioKCeQ/edit?usp=sharing">1 Page Resume</a></li>
            <li><a href="https://www.linkedin.com/in/anthony-oleinik/">Linkedin</a></li>
            <li><a href="https://github.com/antholeole">GitHub</a></li>
            <li><a href="https://www.youtube.com/channel/UCvJ5P5wul44NbZeH_qJTdJw">Youtube</a></li>
            <li><a href="https://anth-oleinik.medium.com/">Medium.com</a> (Blogging Platform)</li>
        </ul>
        <Accordion defaultActiveKey="1">
            <Accordion.Item eventKey="0">
                <Accordion.Header>Work Experience</Accordion.Header>
                <Accordion.Body>
                    <h3>Amazon</h3>
                    <small>Summer 2021</small>
                    <br />
                    <small>
                        Software Engineer Intern
                        Order Abuse / Fraud Detection Rules Engine
                    </small>
                    <br />
                    <small>
                        Consumer Trust and Protection Services Division - Seattle, Remote
                    </small>
                    <hr />
                    <p>
                        Built serverless rules engine that sorts through millions of customer orders, applying filtering and sorting rules. Vets the most potentially abusive orders based on auditors provided ruleset for easier consumption by internal auditors. Launched to production August 2021.
                    </p>
                    <ul>
                        <li>Designed system architecture, then reviewed with team approval. Presented project + design on behalf of team to a large audience of developers, architects and business partners.</li>
                        <li>Communicated in a Scrum setup with daily stand-ups and bi-weekly demos. </li>
                    </ul>
                    <b>Tools and technologies used:</b> AWS Glue + AWS Crawlers, Lambda (Python), Step Functions, AWS CDK, IAM, ECS (Java - Spring / Guice) + Fargate, Git, Amazon pipelines (Internal Amazon CI/CD)
                    <hr />
                    <h3>DAIS Technologies</h3>
                    <small>Summer 2020</small>
                    <br />
                    <small>
                        Software Engineer Intern
                    </small>
                    <br />
                    <small>
                        Chicago, Remote
                    </small>
                    <hr />
                    <p>
                        Part of a team of developers working on a React + Springboot wizard to help customers file jewelry insurance claims.
                    </p>
                    <ul>
                        <li>Rewrote frontend testing suite, to standardize and increase testing coverage.</li>
                        <li>Implemented ~20 Jira tickets over a three-month period with ~90% test coverage.</li>
                        <li>Daily standups, bi-weekly feature demos to senior management.</li>
                    </ul>
                    <b>Tools and technologies used:</b> React (JS), Springboot, Jira, Github,  AWS
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
                <Accordion.Header>Testimonials</Accordion.Header>
                <Accordion.Body>
                    <DmTestimonial
                        username={'Runlong Zhang'}
                        date={new Date('04/14/2022')}                   
                    >  
                    hey, i just want to say, i really appreciate you responding to my message so quickly and offering really good help definitely one of the best teammates i{'\''}ve had
                    </DmTestimonial>
                    <YoutubeTestimonial
                        username={'Nathaniel Woodbury'}
                        date={new Date('3/1/21')}
                        via={{
                            href: 'https://www.youtube.com/watch?v=XjkB_O_rRgc&lc=Ugz_plZivIiszeZyAjp4AaABAg',
                            platform: 'Youtube Comments'
                        }}
                        likes={4}
                    >
                        <p>
                            Oh my god thank you so much, this quality of content for free is so incredible, especially considering rust videos are so rare. Thank you so much!
                        </p>
                        <br />
                        <p>
                            How long have you been working with rust? Your clarity and understanding for it is so high and the code you write is very clean. This video had such incredible explanations and was so clear!
                        </p>
                    </YoutubeTestimonial>
                    <MediumTestimonial username={'Azalea Kemp'} likes={1} date={new Date('2/1/21')} via={{
                        href: 'https://levelup.gitconnected.com/how-to-keep-your-footer-at-the-bottom-of-the-page-the-easy-way-20aa3bcd621f',
                        platform: 'Medium.com'
                    }}>
                        <p>
                            just want to say this post was extremely helpful! Like StackOverflow, but with a proper (and well broken down) explanation! Looking forward to reading more of your writing :)
                        </p>
                    </MediumTestimonial>
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
                <Accordion.Header>Skills</Accordion.Header>
                <Accordion.Body>
                    <h3>Programming:</h3>
                    <ul>
                        <li>Languages: Python, Java, Rust, TS/JS</li>
                        <li>
                            Web Services: Proficient in AWS. Experience in (non-exhaustively): SNS, EC2, ECS, Glue, Lambda, Step fns, RDS, IAM
                        </li>
                        <li>
                            Concepts: Fullstack web dev, mobile development, serverless development, scalable architecture
                        </li>
                        <li>
                            Database: Postgres, MySQL
                        </li>
                        <li>
                            Others: Parallelization + Concurrency, GraphQL, React, Spring
                        </li>
                    </ul>
                    <hr />
                    <h3>Technical Communication:</h3>
                        <ul>
                            <li> Post on a medium blog about tech (https://anth-oleinik.medium.com/).</li>
                            <li>Top 50 writer in tech, Top 500 writer on entire Medium platform.</li>
                            <li>Consistent writer for top programming publications.</li>
                            <li>~604,000 views and ~2,000 likes across 20 articles since Nov, 2020.</li>
                        </ul> 
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    </Layout>
}

export default Resume