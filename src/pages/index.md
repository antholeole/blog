---
title: Anthony Oleinik
description: Anthony Olenik's Personal Website
layout: ../components/Layout.astro
---

# Anthony Oleinik

![image](/images/me.jpg)

Technology Enthusiast, C++ Enjoyer, and Software Craftsman (I'd like to think!).

Currently working on distributed systems at Google. 

## Employment History
### Google. July 2023-Current
**RTDB - San Francisco. (L3 July 2023-Oct 2024. L4 Oct 2024-Current.)**

SWE supporting ~30 million concurrents across multiple regions on a team of 6. Our main goal was to reduce the engineer time required for day-to-day maintenance; estimated 14 SWE day/month toil savings.

- Migrated 10+ services to a Kubernetes from a (Linux) VM based architecture, modernizing development workflows practices and operational efficiency. 
- Led the design and implementation of a  CI/CD pipeline with canary rollouts and rollbacks, deploying to over 500 nodes while maintaining 99.95% uptime. Manual time spent deploying decreased from days to minutes.
- Led engineer onboarding to on-call; taught on-call processes and helped with ramp up tasks. Main POC for new engineers. Wrote various playbooks for processes such as rolling forward and rolling back.
- Mitigated and root caused production failures for multiple production incidents including DOS attacks, often affecting large percentages (20%+)  of traffic. Utilized tools like metrics and logging to root cause and repair when required.
- Attended syncs with dedicated support staff to provide support from core engineering  where required.
- Leveraged C++ to build a large-scale data reconciliation job that compared over half a petabyte of customer data with 5 day SLO on reconciliation of corrupted data. Built, deployed, and operated a repair job that establishes consensus on 5-way replicated RocksDB cluster and repaired data by choosing the majority view. Maintained and monitored the operation of the service.
- Inherited, maintained and extended an autofailover service that ingested server data (BigQuery) and detected unhealthy servers. Created a healing process to reinstate servers back in-rotation. 
- Tools and technologies used: Kubernetes (GKE), C++,  GCP, Terraform, Bazel, Grafana / Prometheus, Google Firestore (NoSQL), Helm, Docker.

### Google. Intern. Summer 2022
**Flutter - San Francisco**
- Implemented a magnifying glass in Google's UI framework, Flutter.

### Amazon. Intern. Summer 2021
**Consumer Trust and Protection Services Division - Seattle, Remote**
- Built serverless order abuse / fraud detection rules engine that sorts through millions of customer orders, applying filtering and sorting rules. Vets the most potentially abusive orders based on auditors provided ruleset for easier consumption by internal auditors. Launched to production August 2021.
- Designed system architecture, then reviewed with team approval. Presented project + design on behalf of team to a large audience of developers, architects and business partners.
- Tools and technologies used: AWS Glue + AWS Crawlers, Lambda (Python), Step Functions, AWS CDK, IAM, ECS (Java - Spring / Guice) + Fargate, Git, Amazon pipelines (Internal Amazon CI/CD)

### DAIS Technologies. Intern. Summer 2020
**Software Engineer Intern for PL Claims Division - Chicago, Remote**
- Worked on React + Springboot wizard to help customers file jewelry insurance claims for a F500 company. 
- Rewrote frontend testing suite, to standardize and increase testing coverage.
- Implemented ~20 Jira tickets over a three-month period with ~90% test coverage.
- Utilized Docker + AWS for containerized deployments of SpringBoot applications. 
- Facilitated hermetic build processes by dockerizing the development workflow, to equalize the production and local development environment.
- Tools and technologies used: React (JS), Springboot, Jira, Github,  AWS, Docker

## Projects
- I tend to try to be a good open source citizen, at the very least opening issues and PR's for bugs I find while using software.
- [My nix-based dotfile configuration](https://github.com/antholeole/nixconfig): fully reproduceable home-manager configuration for personal devices. I maintain these meticulously.
- [My kubernetes home server](https://github.com/antholeole/home-server): I run my home server on kubernetes, using NixOS. Currently one node but always scouring ebay for a good deal to expand the cluster.
- [Advent Of Code](https://github.com/antholeole/advent-of-code-2024-cpp): Advent of code. I take the whole year to do it, so this years might not be done yet.
- [Contributor to DGS](https://github.com/Netflix/dgs-framework/pulls?q=is%3Apr+sort%3Aupdated-desc+is%3Aclosed+author%3Aantholeole), Netflix's graphQL server framework
- [Flutter contributor](https://github.com/flutter/flutter/pulls?q=is%3Apr+sort%3Aupdated-desc+author%3Aantholeole+is%3Aclosed): Leveraged low-level Skia API to implement a text editing magnifying glass feature for text editing accessibility, the #8 highest user-upvoted text editing issue in the top-20 most starred github repo of all time, Google’s UI framework, Flutter. Shipped this highly requested feature to millions of global users.

