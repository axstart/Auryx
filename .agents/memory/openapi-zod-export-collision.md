---
name: OpenAPI Zod export collisions
description: Orval can emit the same operation body name in generated API schemas and generated reusable types.
---

When an OpenAPI request body schema name matches a generated reusable type name, the shared Zod package can fail on wildcard re-exports. Prefer explicit type re-exports from the generated types entrypoint when this occurs.

**Why:** Orval generates operation validators and reusable type declarations into separate modules, but the package entrypoint exposes both.

**How to apply:** After changing OpenAPI request bodies, run library typecheck and resolve duplicate exports at the package boundary rather than editing generated files.