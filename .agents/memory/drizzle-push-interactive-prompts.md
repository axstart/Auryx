---
name: drizzle-kit push interactive prompts
description: How to get past drizzle-kit's interactive TUI confirmation prompts non-interactively.
---

`pnpm --filter @workspace/db run push` (drizzle-kit push) sometimes shows an interactive arrow-key confirmation prompt — e.g. when adding a new unique constraint to a table that already has rows ("truncate table?"). Plain `bash` piping (`printf '\n' | ... push`) does NOT work because it's a raw TUI reading a pty, not line-buffered stdin.

**Fix:** wrap the command with `script -qc "... push" /tmp/out.log` to allocate a pty, then pipe/printf into that. Example:

```
script -qc "printf '\r' | pnpm exec drizzle-kit push --config ./drizzle.config.ts" /tmp/drizzle_push.log
```

**Why:** without a pty, the TUI prompt just hangs waiting for real terminal input and the command never completes from a plain bash tool call.

**How to apply:** whenever a `db run push` hangs on a prompt instead of completing, use the `script -qc` wrapper instead of plain piping.
