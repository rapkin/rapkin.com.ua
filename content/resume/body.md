<div class="resume-header">
    <a href='/assets/img/photo.jpg' target='_blank' data-no-swup>
        <img class='avatar-photo' width='140' height='140' alt='My photo' src='/assets/optimized-img/preview_photo.jpg'>
    </a>
    <div>
        <h1>Mikola Parfenyuck</h1>
        <h2>Senior Full-Stack Engineer | AI Integration | Cloud Architecture</h2>
        <p>
            <strong>Lviv, Ukraine</strong> • Currently at <a href="https://livegistics.com/">Livegistics</a>
        </p>
    </div>
</div>

### What I can do for your team:
- Ship full-stack features independently from day one
- Design complex database architectures and keep data integrity across messy real-world integrations
- Own third-party integrations end to end, plus the monitoring that lets everyone else debug them
- Take AI/ML from idea to production - not demos, but systems people rely on daily
- Find the real bottleneck - cut our web app's initial JS payload 35%, killed the queries behind CPU saturation
- Build secure, compliant infrastructure (SOC 2)
- Multiply output with AI agents run in parallel under a spec-driven process, backed by real tests

**Let's talk:** [mikola.parfenyuck@gmail.com](mailto:mikola.parfenyuck@gmail.com) • [GitHub](https://github.com/rapkin) • [LinkedIn](https://www.linkedin.com/in/mikola-parfenyuck/)


## Summary

**Senior Full-Stack Engineer** with 10+ years shipping production systems, at [Livegistics](https://livegistics.com/) since 2021. I own features end-to-end - database schema through frontend to cloud deployment - and tend to end up on the hard parts: integrations with other companies' enterprise systems, the reliability work that keeps them honest, and the tooling that lets the team work on them too. Ph.D. candidate researching contextual dialogue generation with neural networks - I study the technology I ship.


## Skills

__Front-end__: TypeScript, React, Next.js, Radix UI, Tailwind CSS, React Query (TanStack), Mobx, Redux, Material UI, Styled Components

__Back-end__: Node.js, Python, Hono, Express, TSOA, Swagger/OpenAPI, Prisma, Drizzle ORM, PostgreSQL, MongoDB, Redis, Firestore, Ory (authentication)

__DevOps & Cloud__: Docker, Google Cloud Platform (GCP), Cloud Run, Kubernetes, GitHub Actions (CI/CD pipeline optimization), NX monorepo, SOC 2 compliance

__Observability & Performance__: Grafana, Sentry, structured logging and audit trails, query and index optimization, profiling, incident response

__AI & ML__: LLM integration (Gemini, Vertex AI), document/ticket data extraction with human-in-the-loop review, prompt engineering, AI-assisted engineering (parallel coding agents, spec-driven development, MCP servers), neural networks, data science

__Other__: automated testing (unit, integration, e2e with Playwright and Jest), GIS, UX/UI, responsive web design, English (C2 by EFSET)


## Jobs

__Livegistics__ - (Sep 2021 - present) **Senior Full-Stack Developer**

Full-stack development across the entire logistics platform ecosystem. Key work:

- **AI Document Extraction:** Architected and shipped the production pipeline end-to-end - drivers photograph paper tickets, the system extracts structured fields, humans review only edge cases. Built on Gemini and Vertex AI with a provider-agnostic design; owned the pipeline architecture, model and prompt engineering, and the review UI
- **Third-Party Integration Platform:** Sole owner of the external integration layer - a provider-agnostic framework connecting six external systems (enterprise ERPs, industry data providers, partner platforms). Built the connectors and the sync engine under them: entity matching, rename and conflict resolution, queued pushes, scheduled reconciliation, retry and backfill
- **Database Architecture & Data Integrity:** Designed and evolved a 104-model Prisma/PostgreSQL schema; keep data correct between our platform and customers' enterprise systems, from modern APIs to legacy Microsoft-era stacks
- **Observability & Production Reliability:** Turned integrations from a 'black box only I could debug' into something the whole team operates - monitoring timelines, per-provider sync status, searchable structured logs, failure triage by outcome, credential-expiry detection, self-service verification UI. Primary responder for production incidents
- **Performance Engineering:** Cut web First Load JS ~35% with lazy loading and dependency surgery; eliminated N+1 queries; fixed batch-job memory exhaustion with streaming; added indexes to clear CPU saturation and sync timeouts; cut CI time with build caching and prebuilt images
- **Security & Compliance:** Own the engineering side of SOC 2 - infrastructure configuration, monitoring, access control - plus Ory authentication across web and mobile
- **Cloud Infrastructure:** Built and maintain GCP infrastructure with Docker, Cloud Run, and Kubernetes
- **Engineering Workflow:** Set up the team's AI-assisted development practice - engineering constitution, agent instruction docs, a spec-driven workflow (spec → plan → tasks → implement) wired into issue tracking, MCP servers for codebase-aware agents, and guardrails (no auto-commit, secrets isolation, mandatory review). I run several agents in parallel across worktrees; quality held by ~2,400 automated tests and code review
- **Modern UI:** Frontend modernization with Radix UI, Tailwind CSS, and React Query; React Native applications with shared business logic
- **Full Ownership:** Features go from database schema to frontend to deployment through my hands, end to end

Tech stack: TypeScript, React, Next.js, React Native, Radix UI, Tailwind CSS, React Query, Redux, Mobx, Material UI, Node.js, Hono, TSOA, Swagger, Prisma, Drizzle ORM, PostgreSQL, Firestore, Redis, Ory, Gemini, Vertex AI, Docker, GCP, Cloud Run, Kubernetes, Ansible, NX, GitHub Actions, Grafana, Sentry, Jest, Playwright.

__EOS Data Analytics__ - (Jul 2020 - Aug 2023) **Software Developer and Computer Vision Scientist**

Research and production development of computer vision systems for satellite imagery analysis. Built ML pipelines for geospatial data processing and analysis tools for earth observation applications.

Tech stack: Python, PyTorch, NumPy, Pandas, TensorFlow, QGIS, React, TypeScript, MongoDB.

__Ultimatefintech__ - (Mar 2019 - Jan 2021) **Lead Front-End Developer**

Led frontend development for multiple high-profile projects including Virtual Vision virtual event platform and iFX EXPO International 2020. Architected and built complex interactive experiences with 3D scenes, real-time features, and responsive design.

Tech stack: TypeScript, React, Next.js, Vue.js, Nuxt.js, Mobx.

__Freelance__ - (Dec 2015 - Sep 2021) **Full-Stack Developer**

Delivered complete web solutions for diverse clients across multiple industries. Built full-stack applications, APIs, and database systems while managing client relationships and project timelines.

Tech stack: JavaScript, TypeScript, React, Angular.js, MySQL, PostgreSQL, MongoDB.


## Education

- _2020-present_ - The National University of Water and Environmental Engineering, specialty: Computer Science, Ph.D. candidate. Dissertation research: contextual dialogue generation using neural networks
- _2018-2020_ - The National University of Water and Environmental Engineering, specialty: Applied Mathematics, Master's degree
- _2015-2018_ - The National University of Water and Environmental Engineering, specialty: Applied Mathematics, Bachelor's degree
- _2012-2015_ - Technical College NUWM, specialty: Applied Mathematics


## Open Source & Community Impact

**osm2geojson** - Python library for parsing OpenStreetMap and Overpass JSON data. Used by developers worldwide for geospatial data processing. [View on GitHub →](https://github.com/rapkin/osm2geojson)

**gulp-bootstrap-configurator** - Gulp plugin for custom Bootstrap builds, simplifying frontend tooling. [View on GitHub →](https://github.com/rapkin/gulp-bootstrap-configurator)


## Featured Work & Case Studies

<div class='post-item'>
    <a class='image-link' href='/assets/img/livegistics.png' target='_blank' data-no-swup>
        <img width='200' height='200' alt='Livegistics logo' src='/assets/optimized-img/preview_livegistics.png'>
    </a>
    <div>
        <h3>Livegistics: Enterprise Logistics Platform</h3>
        <p>
            A comprehensive logistics management platform handling complex workflows, sensitive data, and enterprise compliance requirements - web and mobile.
            My main work since 2021 and the home of everything described in the job section above: the AI ticket extraction pipeline, the integration layer that keeps data in sync with customers' enterprise systems, the SOC 2 infrastructure, and the data architecture modeling shipments, carriers, customers, and billing.
            <br/>
            <a class='visit-link' href='https://livegistics.com/' target='_blank' rel='noopener noreferrer'>Visit website</a>
        </p>
    </div>
</div>

<div class='post-item'>
    <a class='image-link' href='/assets/img/standforukraine.png' target='_blank' data-no-swup>
        <img width='200' height='200' alt='Stand For Ukraine website' src='/assets/optimized-img/preview_standforukraine.png'>
    </a>
    <div>
        <h3>Stand For Ukraine: Humanitarian Aid Platform</h3>
        <p>
            <strong>The Mission:</strong> Built during Russia's invasion of Ukraine to connect international donors with verified Ukrainian NPOs providing humanitarian aid.
            <br/><br/>
            <strong>Impact:</strong> Architected and developed a bilingual platform aggregating vetted organizations, making it easier for people worldwide to support Ukraine effectively. Deployed quickly under urgent circumstances while maintaining code quality and user experience.
            <br/><br/>
            <strong>Tech Stack:</strong> Next.js, React, TypeScript, Styled Components
            <br/>
            <a class='visit-link' href='https://standforukraine.com/' target='_blank' rel='noopener noreferrer'>Visit website</a>
            <a class='visit-link' href='https://github.com/StandForUkraine/site-source' target='_blank' rel='noopener noreferrer'>Source on GitHub</a>
        </p>
    </div>
</div>

<div class='post-item'>
    <a class='image-link' href='/assets/img/vr-event.png' target='_blank' data-no-swup>
        <img width='200' height='200' alt='Virtual event platform' src='/assets/optimized-img/preview_vr-event.png'>
    </a>
    <div>
        <h3>Virtual Event Platform with 3D Environments</h3>
        <p>
            <strong>The Challenge:</strong> Create an immersive virtual event platform with 3D environments, real-time chat, video streaming, and notifications.
            <br/><br/>
            <strong>My Role:</strong> Architected and built the entire frontend platform, implementing complex state management with MobX State Tree, 3D scene rendering with Three.js, real-time communication features, and form handling. Delivered a performant, engaging experience for virtual conference attendees.
            <br/><br/>
            <strong>Tech Stack:</strong> Next.js, React, TypeScript, Mobx (mobx-state-tree), Three.js, React Hook Form
        </p>
    </div>
</div>

<div class='post-item'>
    <a class='image-link' href='/assets/img/virtual_vision.png' target='_blank' data-no-swup>
        <img width='200' height='200' alt='Virtual Vision landing page' src='/assets/optimized-img/preview_virtual_vision.png'>
    </a>
    <div>
        <h3>Virtual Vision landing page</h3>
        <p>
            Development and optimization for mobile devices.
            <br/>
            Used: Next.js, React, TypeScript.
        </p>
    </div>
</div>

<div class='post-item'>
    <a class='image-link' href='/assets/img/ifxexpo.jpg' target='_blank' data-no-swup>
        <img width='200' height='200' alt='iFX EXPO website' src='/assets/optimized-img/preview_ifxexpo.jpg'>
    </a>
    <div>
        <h3>iFX EXPO International 2020 website</h3>
        <p>
            Full website redesign and codebase refactoring.
            Addressed various business challenges, added custom floor plan (interactive map), complex registration, and much more.
            <br/>
            Used: Nuxt.js, Vue.js, SCSS.
            <br/>
            The website is no longer online. The link was https://ifxexpo.com/cyprus2020/.
        </p>
    </div>
</div>


## How I Work

**Communication:** C2-level English proficiency. I explain complex technical decisions clearly, write documentation people actually use, and collaborate effectively across time zones.

**Adaptability:** Unfamiliar codebase, new technology, or context-switching between backend, frontend, and infrastructure - I navigate complexity systematically.

**Steady:** Responsible, calm, and consistent. I show up, do good work, and make the team better.

---

## Beyond Work

When I'm not building production systems, you'll find me:
- Exploring geospatial data analysis and GIS technologies
- Studying neural network architectures and ML papers
- Creating philosophy and tech memes (seriously, check the [about page](/about/))
- Supporting Ukraine and open-source communities

---

## Get in Touch

I'm always interested in connecting with startups solving hard problems. Whether you're scaling a platform, building AI-powered products, or wrestling complex data - let's talk.

**Email:** [mikola.parfenyuck@gmail.com](mailto:mikola.parfenyuck@gmail.com)  
**LinkedIn:** [linkedin.com/in/mikola-parfenyuck](https://www.linkedin.com/in/mikola-parfenyuck/)  
**GitHub:** [github.com/rapkin](https://github.com/rapkin)  
**Blog:** [rapkin.com.ua](https://rapkin.com.ua) (you're here!)

*Remote from Lviv, Ukraine, with regular US time-zone overlap • Open to senior, staff, or lead roles • Full-time or contract • US & EU startups welcome*
