# Third-Party Notice: T-Rex Runner

This folder vendors code from:
- Project: `wayou/t-rex-runner`
- Source: https://github.com/wayou/t-rex-runner
- Commit: `5455bfa408ec6b707c7300ff194b7390733a766d`
- License: BSD-style (see `LICENSE`)

Security hardening applied for embedding:
- Served locally from this app (no runtime CDN dependency).
- Embedded inside a sandboxed iframe (`sandbox="allow-scripts"`).
- Audio decode/play path disabled in wrapper (`bootstrap.js`) to reduce payload/API surface.
- Replaced one `innerHTML` assignment with `textContent` in `index.js`.
