import { platform } from 'os'
import { Accordion } from 'react-bootstrap'
import { Layout } from '../../components/layout/layout'

const Resume = () => {
    return <Layout>
        <h2>Anthony{'\''}s Resume</h2>
        <ul>
            <li><a href="https://docs.google.com/document/d/1GtFB8PgPFZc9XhADliExEkF4Be4qtsBGYWVJ7DFhOcw/edit?usp=sharing">1 Page Resume</a></li>
            <li><a href="https://www.linkedin.com/in/anthony-oleinik/">Linkedin</a></li>
            <li><a href="https://github.com/antholeole">GitHub</a></li>
            <li><a href="https://www.youtube.com/channel/UCvJ5P5wul44NbZeH_qJTdJw">Youtube</a></li>
            <li><a href="https://anth-oleinik.medium.com/">Medium.com</a> (Blogging Platform)</li>
        </ul>
        <Accordion defaultActiveKey="1">
            <Accordion.Item eventKey="0">
                <Accordion.Header>Work Experience</Accordion.Header>
                <Accordion.Body>
                    <h3>Google</h3>
                    <small>Summer 2022</small>
                    <br />
                    <small>
                        Software Engineer Intern
                        Text Editing Magnifying Glass
                    </small>
                    <br />
                    <small>
                        Flutter Team - San Francisco
                    </small>
                    <hr />
                    <p>
                    Leveraged low-level Skia API to implement a text editing magnifying glass feature for text editing accessibility, the #8 highest user-upvoted text editing issue in the top-2o most starred github repo of all time, Google’s UI framework, Flutter. Shipped this highly requested feature to millions of global users.
                    </p>
                    <ul>
                        <li>Produced and championed design doc. Received team approval for user facing API and design details.</li>
                        <li>Landed Pull Requests that include expanding testing API’s,  platform fidelity details. Reviewed community contributions.</li>
                    </ul>
                    <b>Tools and technologies used:</b> Flutter, Dart
                    <hr />
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
            <Accordion.Item eventKey="2">
                <Accordion.Header>Skills</Accordion.Header>
                <Accordion.Body>
                    <h3>Programming:</h3>
                    <ul>
                        <li>Languages: Go, Python, Java, Rust, TS/JS</li>
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
                            Others: Parallelization + Concurrency, GraphQL, React, Spring, Containerization (Docker, Docker Compose)
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