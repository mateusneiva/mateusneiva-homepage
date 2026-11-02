---
title: 'AI and the new reality of software development'
description: 'How AI changed the way software is built, how hard it was for me to adapt, and why tests, CI/CD, and documentation are no longer optional.'
date: '2026-11-02'
tags: ['ai', 'development', 'career']
draft: false
---

## I was skeptical

For a long time, I looked at AI in software development with suspicion. I have always been skeptical, and a good part of that came from a legitimate place: code that looks right and is not, confident answers about things that do not exist, the feeling that writing code by hand was exactly the part that built reasoning.

I was not entirely wrong. But I was not seeing the whole picture either.

## The market went somewhere else

What moved me was not an argument, it was the path the market took. The tools became good enough to enter the routine of teams and personal projects, and the way of working started to change around me. At some point it became clear that staying out was not a neutral position: it was falling behind.

So I went after the lost ground. I had to learn a different way of working from scratch, and it was not comfortable.

## A reference who went back to study

When the subject was AI, my reference was Fabio Akita. I followed what he said about it, mainly on his blog, [Akita on Rails](https://akitaonrails.com), where he publishes often. So seeing him recently do an intensive with AIs weighed more than any article or demo.

It was the push I was missing. If someone I trusted to think about the subject was studying it intensely, I could no longer just watch. My knowledge of the subject was already getting dated. I decided to catch up: understand the current state of the field and try the latest AI tools, instead of judging them by impressions from before.

## Adapting was hard

It was really hard. Not only learning the tools, but changing habits: writing less code by hand and more instructions, context, and criteria; reviewing more than typing; distrusting what looks finished; accepting that production speed stopped being the bottleneck.

It was also hard to leave part of my identity behind. I liked writing every line, and now the work is deciding what should exist, describing it well, checking it, and correcting course. It is a different skill, and it is learned by making mistakes.

## This is the new reality

I no longer see this as a passing trend. AI is already part of how software is made, and the emerging standard is a single one: **more code being written, in less time**.

And that is the point that changed my mind the most. When more code is written, faster, what remains as the limit is the ability to guarantee that the code is right. Without that, speed only produces more problems, and faster.

## What stopped being optional

Some practices many people treated as "ideal, when there is time" are no longer optional. Today, to me, leaving them out makes no sense:

- **Automated tests.** They tell you, in seconds, whether a change broke something. With code generated in volume, they are the main safety net.
- **CI/CD.** Lint, types, tests, and build running on every change, always the same way, without depending on memory or goodwill.
- **Documentation.** Project rules, decisions, and context written down serve people and also the tools, which work better when they know the conventions and the limits.
- **Strict typing and lint.** They reject, before review, the most common and cheapest class of error to avoid.
- **Careful review.** Whoever decides what goes in is still the one who signs the change.

In my most recent projects, this became routine: a file with the project's rules, a roadmap to work one task at a time, tests that do not depend on the network, and CI that blocks whatever does not pass. None of it is new, but it used to be easier to ignore. Now, ignoring it is expensive.

## An example: Licht

[Licht Launcher](/en/projects/licht-launcher) shows this well in practice. It is an unofficial Minecraft Java launcher for Windows and Linux, built with Tauri, Rust, and React, with separate profiles, mod loaders (Fabric, Quilt, Forge, and NeoForge), and modpacks from Modrinth and CurseForge. It is a project with a large surface: version formats from 1.5.2 to 26.x, Forge installers, Microsoft sign-in, verified downloads. That scope is what made the practices above impossible to skip.

I used AI throughout its development, and the repository history tells what changed in pace and method.

- **Rules before code.** The first commit, on October 8, 2026, was a guidelines document and a roadmap, not code. Each task becomes a branch and a small pull request, with tests and CI checks as the gate.
- **Pace.** The first version shipped on October 11, three days later, and by October 17 there were six published versions.
- **Milestones, not just volume.** The roadmap organizes the work into phases and milestones: game execution on Windows, then Microsoft sign-in, then mod loaders and modpacks.

That volume is only sustainable because there is structure around it. Without tests, CI, and written rules, the same pace would turn into piled-up problems.

## AGENTS.md: the rules AI reads

Licht has an `AGENTS.md` file at its root, a format that several AI tools recognize. It is where the project's rules are written for them, and it is one of the practices that changed my experience the most. Without that file, every conversation starts from scratch and the AI decides on its own whatever it does not know. With it, the context and the limits travel with the project.

In Licht, it defines things like:

- **Context:** what the project is, the technologies, and the folder structure.
- **How to work:** present a short plan before writing code and wait for approval; ask when there is a decision, such as a new dependency or an architecture change; one task per branch and per pull request; write nothing beyond what the task asks.
- **Architecture:** the logic lives in the Rust core, the Tauri layer is thin, and the interface has no Minecraft rules; shared types are generated, not copied by hand.
- **Interface:** use only the design system's components and tokens, with no loose styles.
- **Quality:** which checks must pass before opening a PR, and that no test may depend on the network.
- **Domain rules:** verify the SHA1 of everything downloaded and keep tokens in the system keyring, never in logs.

This matters for four reasons. **Consistency:** the AI follows the same conventions I would. **Safety:** rules like verifying hashes and protecting tokens stop depending on someone remembering them in every request. **Control:** the plan before the code keeps me as the one who decides, and the AI as the one who executes. **Continuity:** any new tool that reads the file starts from the same point.

It is documentation that serves people and machines, so it is worth treating like code: version it, review it, and update it when a rule changes.

## Where I am now

I still have reservations, and I think that is healthy: AI makes mistakes, and whoever uses it needs to recognize when it does. But I stopped believing the choice was between using it and not using it. The question that makes sense today is how to use it well, and that involves more engineering, not less.

I keep learning, and sharing this here is part of the process. If you are also in the middle of this adaptation, know that the discomfort is normal. What helped me was treating it as a new craft to learn, with patience and with good practices alongside.
