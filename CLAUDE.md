# Deployment

**Production branch is `claude/solar-panel-calculator-oc1zW`** — this is what Vercel (frontend) and Railway (backend) actually deploy from. NOT `main`, and NOT `claude/website-indexing-audit-qf91rp` (that one only ever gets Preview deployments, confirmed from the Vercel Deployments log on 2026-10-14 — every single Production-badged deployment in that log sits on `claude/solar-panel-calcu...`, never on `main` or the website-indexing branch).

https://github.com/eliaszoleta/solarcalculator/tree/claude/solar-panel-calculator-oc1zW

**Always commit/merge finished work directly to this branch — that is what actually ships.** A fix pushed only to `claude/website-indexing-audit-qf91rp` or `main` looks done (builds clean, even gets its own Preview deployment) but never reaches real users. This caused a real live outage on 2026-10-14: a CORS fix was pushed to the wrong branch and the public calculator stayed broken for ~20 minutes after the fix was "shipped" because of this exact mistake.
