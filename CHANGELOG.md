# v0.3.0

- Refactor to use Bun instead of Node.
- Use a sqlite database instead of the file system as storage.
- Introduce `DATABASE` and `HOSTNAME` environment variables.
- Remove `DATA_DIR` environment variable.

# v0.2.3

- Correctly pass DATA_DIR to nodefs storage plugin

# v0.2.3

- Add DATA_DIR environment variable to control where the nodefs storage adapter
  stores its data

# v0.2.3

- Fix package.json so this can run using `npx automerge-repo-sync-server`

# v0.2.3

- Upgrade to @automerge/automerge-repo@1.0.13 and @automerge/automerge@2.1.6
