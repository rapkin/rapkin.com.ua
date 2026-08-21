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

Senior full-stack engineer with 10+ years of development experience, at [Livegistics](https://livegistics.com/) since 2021. I take features from database schema to deployment, and I end up owning the parts nobody volunteers for: integrations with other companies' enterprise systems, the reliability work that keeps them honest, and the tooling that lets the rest of the team work on them too. Ph.D. candidate researching contextual dialogue generation with neural networks.

**Let's talk:** [mikola.parfenyuck@gmail.com](mailto:mikola.parfenyuck@gmail.com) • [GitHub](https://github.com/rapkin) • [LinkedIn](https://www.linkedin.com/in/%D0%BC%D0%B8%D0%BA%D0%BE%D0%BB%D0%B0-%D0%BF%D0%B0%D1%80%D1%84%D0%B5%D0%BD%D1%8E%D0%BA-a98b661a9/)


## Skills

__Front-end__: TypeScript, React, Next.js, Radix UI, Tailwind CSS, React Query, Mobx, Redux, Material UI

__Back-end__: Node.js, Python, Hono, TSOA, Swagger/OpenAPI, Prisma, Drizzle ORM, PostgreSQL, MongoDB, Redis, Firestore, Ory

__DevOps & Cloud__: Docker, GCP, Cloud Run, Kubernetes, GitHub Actions, NX monorepo, SOC 2

__Observability & Performance__: Grafana, Sentry, structured logging, query and index optimization, incident response

__AI & ML__: Gemini, Vertex AI, prompt engineering, document extraction with human review, parallel coding agents, spec-driven development, MCP, neural networks

__Testing & other__: Playwright, Jest, unit/integration/e2e, GIS, UX/UI, English (C2 by EFSET)


## Jobs

__Livegistics__ - (Sep 2021 - present) **Senior Full-Stack Developer**

- **Integrations.** I own the external integration layer end to end - a provider-agnostic framework wired to six outside systems, from modern APIs to legacy Microsoft-era ERPs. The connectors are the easy half; the hard half is the sync engine under them: entity matching, renames and conflicts, queued pushes, scheduled reconciliation, retry and backfill. It used to be a black box only I could read - now the team runs it off monitoring timelines, per-provider status and searchable logs. I'm still first responder for production incidents.
- **AI document extraction.** Drivers photograph paper tickets, the system pulls out structured fields, people review only the edge cases. I built the pipeline, picked and tuned the models, and wrote the review UI. Provider-agnostic by design; currently Gemini and Vertex AI.
- **Data.** A 104-model Prisma/PostgreSQL schema, evolved through 157 migrations without breaking existing customers.
- **Performance.** Cut web First Load JS by ~35%. Killed N+1 queries, fixed batch-job memory exhaustion with streaming, added indexes to clear CPU saturation and sync timeouts, and cut CI time by restructuring the job tree so parallel workers reuse one cached Docker build instead of each rebuilding it.
- **Infrastructure and compliance.** GCP on Docker, Cloud Run and Kubernetes. I own the engineering side of SOC 2, plus Ory authentication across web and mobile.
- **How the team works.** I set up our AI-assisted practice: an engineering constitution, agent instruction docs, a spec-driven workflow wired into issue tracking, MCP servers so agents read the real codebase, and guardrails so they can't commit or reach secrets. I usually have several agents running in parallel across worktrees; ~2,400 automated tests and code review keep it honest.

__EOS Data Analytics__ - (Jul 2020 - Aug 2023) **Software Developer and Computer Vision Scientist**

Computer vision for satellite imagery: ML pipelines for geospatial data and analysis tools for earth observation.

Python, PyTorch, TensorFlow, NumPy, Pandas, QGIS, React, TypeScript, MongoDB.

__Ultimatefintech__ - (Mar 2019 - Jan 2021) **Lead Front-End Developer**

Led frontend for the Virtual Vision event platform and iFX EXPO International 2020 - 3D scenes, real-time features, and a lot of interactive UI.

TypeScript, React, Next.js, Vue.js, Nuxt.js, Mobx.

__Freelance__ - (Dec 2015 - Sep 2021) **Full-Stack Developer**

Web apps, APIs and databases for small clients, start to finish, including the client conversations.

JavaScript, TypeScript, React, Angular.js, MySQL, PostgreSQL, MongoDB.


## Education

The National University of Water and Environmental Engineering:

- _2020-present_ - Ph.D. candidate, Computer Science. Dissertation: contextual dialogue generation using neural networks
- _2018-2020_ - Master's, Applied Mathematics
- _2015-2018_ - Bachelor's, Applied Mathematics
- _2012-2015_ - Technical College NUWM, Applied Mathematics


## Open Source

**osm2geojson** - Python library for parsing OpenStreetMap and Overpass JSON. [GitHub →](https://github.com/rapkin/osm2geojson)

**gulp-bootstrap-configurator** - Gulp plugin for custom Bootstrap builds. [GitHub →](https://github.com/rapkin/gulp-bootstrap-configurator)


## Featured Work

<div class='post-item'>
    <a class='image-link' href='/assets/img/livegistics.png' target='_blank' data-no-swup>
        <img width='200' height='200' alt='Livegistics logo' src='/assets/optimized-img/preview_livegistics.png'>
    </a>
    <div>
        <h3>Livegistics: Enterprise Logistics Platform</h3>
        <p>
            The logistics platform I've worked on since 2021 - web and mobile. Everything in the job section above lives here.
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
            Built during Russia's invasion to connect donors abroad with vetted Ukrainian aid organizations. Bilingual, put together fast, and it held up.
            <br/><br/>
            Next.js, React, TypeScript, Styled Components.
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
            A conference platform with 3D venues, live chat and video streaming. I built the whole frontend - MobX State Tree for state, Three.js for the scenes.
            <br/><br/>
            Next.js, React, TypeScript, mobx-state-tree, Three.js, React Hook Form.
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
            Development and mobile optimization. Next.js, React, TypeScript.
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
            Full redesign and refactor, plus an interactive floor plan and a complicated registration flow. Nuxt.js, Vue.js, SCSS.
            <br/>
            No longer online; it was at https://ifxexpo.com/cyprus2020/.
        </p>
    </div>
</div>


## Beyond Work

When I'm not building production systems, you'll find me:
- Exploring geospatial data analysis and GIS technologies
- Studying neural network architectures and ML papers
- Creating philosophy and tech memes (seriously, check the [about page](/about/))
- Supporting Ukraine and open-source communities

---

*Remote from Lviv, Ukraine, with regular US time-zone overlap • Open to senior, staff, or lead roles • Full-time or contract*
