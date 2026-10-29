# Knowledge base

Every `.md` file here (except this README) is loaded into the static site at build time, split into sections at each `## ` heading, and searched by the agents.

**All files are sample content for the demo. Replace them with APU's approved documents before real use.**

Front matter:

```markdown
---
title: Leave policy
audience: hr
owner: Human Resources
---
```

`audience` controls which agents may read a document: `general` (all agents), `it`, `hr`, `admissions`, `finance` or `admin`. The Institutional Knowledge Agent reads every audience.
