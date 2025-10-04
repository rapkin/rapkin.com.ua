---
layout: layouts/post
---

![AI in development](/assets/img/ai-generated-meme.png)

*Or: What I learned maintaining osm2geojson while working full-time in a country at war*

## The 30-Minute Miracle

Yesterday, someone opened [issue #52](https://github.com/aspectumapp/osm2geojson/issues/52) in my osm2geojson library. A bug where closed OSM ways (like service roads) were being incorrectly converted to polygons. Clear problem, clear example, straightforward fix.

In the old days - say, 2022 - this would've been a 2+ hour affair: remind myself how the codebase works, set up the environment, run tests, debug, document, release. The kind of thing I'd put off for weeks because who has 2 hours for a "small" fix?

With modern AI? **30 minutes. Start to finish. Including setting up GitHub Actions for releases.**

*(For context: I'm using Claude Sonnet 4.5 in Cursor at the time of writing this. But the point isn't about a specific model - it's about whatever AI gives the best results at a given moment. Six months from now, it might be something else entirely.)*

This isn't a story about AI being "fast." It's about something more fundamental: AI made me care about my open source project again.

## The Evolution: From Toys to Tools to Teammates

I've been playing with LLMs since the early ChatGPT days. GPT-3 was when I started using it professionally - daily, for real work. But it was... temperamental. Hallucinations. Rabbit holes of confident wrongness. You had to babysit it constantly.

Every new version brought improvements. But there were two real quality shifts for me:

**First shift: GPT-4** - "This is useful"

**Second shift: GPT-5 and Sonnet 4.5** - "I can actually pair program with this"

That second shift is subtle but profound. It's not about being smarter or faster. It's about *reliability building trust*. Less bullshit. More self-discipline. Fewer hallucinations. The compound interest of these small improvements pays off greatly.

## The Philosophical Shift: Coding for AI Continuation

Here's what nobody talks about: **AI changes what you build and how you think about building it.**

I find myself asking new questions:
- How do I structure this so AI can continue my work?
- When AI gets better, will it understand why we chose this "temporary" solution?
- Am I documenting decisions or just implementation details?

It's changing my code style, architecture, processes. I'm not just writing code for humans anymore. I'm writing code for a future where AI might need to maintain it. Or extend it. Or explain it to another developer.

Is this good? I don't know yet. But it's happening.

## The Tension: Productivity vs Cognitive Overload

Sometimes AI feels like an assistant with instant responses. But sometimes it generates code or text that's genuinely new to me - something I can learn from, improve myself with.

This is **both fascinating and overwhelming.**

I'm human. I have limited time. I don't want to wade through walls of generated text to understand a complex implementation. There's a real risk here: **what happens when you can't trust the solution but don't have time to verify it?**

I've adapted with "isolation" techniques - testing (which is usually simpler than the code itself), code review, verification. But this brings us to one of the biggest challenges facing developers today:

**Code review of AI-generated slop.**

Someone has to review it. Someone has to understand it. Someone has to take responsibility for it. That someone is still the developer.

## The Role Shift: From Implementer to Decision-Maker

AI hasn't replaced developers. It's revealed what developers actually do.

The responsibility for every decision is still on the developer. Initial code review is still on the developer. Product vision? Developer (or in collaboration with product team). User needs? Developer knows better, or asks CS/Product.

**The developer's role has changed, but now we can see more clearly the real value of each developer's intellectual property.**

You're not valuable because you can write a for-loop. You're valuable because you can decide *which* for-loop to write, *why*, and *when*.

Developer = decision maker at the technical level.

## The Personal Reality: War, Work, and Open Source

Let me be honest about something.

A few years ago, I was actively developing osm2geojson. I was younger. I had more time. I had different circumstances.

Now? I work full-time at a US startup. I live in Ukraine during war. I have responsibilities. **I don't have 2-hour blocks to fix "small" bugs in old projects.**

Before AI, osm2geojson would have slowly died. Not because I stopped caring, but because I couldn't afford to care.

With AI? I fixed that issue in 30 minutes. Updated the release process. Shipped it. The project lives again.

This isn't just about productivity. **It's about sustainability.** AI makes solo open source maintenance actually possible, even when life gets complicated.

## The Future: What It Means to Build

I'm working on a side project - a system that generates entire research repositories. Code, papers, LaTeX PDFs, instructions, datasets, everything. Using AI to create infrastructure for AI-assisted research.

It's meta. It's weird. It's also completely natural.

Because the question isn't "Can AI code?" anymore. The question is: **"What do we build when the constraint isn't implementation speed?"**

When you can go from idea to working prototype in hours instead of weeks, what changes? What becomes possible? What becomes important?

I think we're about to find out.

## Conclusion: The Compound Interest of Trust

The real story isn't that AI fixed a bug in 30 minutes.

It's that I trust it enough to maintain my open source projects again.  
It's that I'm designing systems differently because AI might need to understand them.  
It's that the role of "developer" is becoming clearer: decision-maker, reviewer, architect of intent.

We're in a transition period. The tools are getting better faster than we can adapt. There are real challenges - cognitive overload, code review, trust, verification. These aren't solved problems.

But for the first time in years, I looked at that osm2geojson issue and thought: "I can handle this."

That's not nothing.

That's everything.

---

_P.S. This entire article was written with AI assistance. The irony is not lost on me. The ideas are mine. The structure is mine. The execution is collaborative. That's the point._
