# Automerge Repo Sync Server

A very simple [automerge][automerge]-[repo][automerge-repo] synchronization
server. It pairs with the websocket client protocol found in
`@automerge/automerge-repo-network-websocket`.

The server differs from the official sync server:
- It is tweaked to work with [`Bun`][bun].
- It uses Bun [websockets][websocket] as the network layer.
- It uses Bun [sqlite][sqlite] as the storage layer.

The server is an unsecured [Bun.serve][bunserve] app. To run it as a public
sync server it is recommended to place it behind a reverse proxy like nginx,
or use a service like [Fly][fly].

## Running the sync server

```sh
bun install
bun start # bun src/index.ts
```

The server is configured with environment variables:

- `PORT` - the port to listen for websocket connections on, defaults to `3030`.
- `HOSTNAME` - the hostname to bind to, defaults to `localhost`.
- `DATABASE` - the sqlite file to store saved documents in, default to `:memory:`.

## Docker

A `Dockerfile` is provided. It compiles the server and then runs it. It is
tested to work with [Fly][fly], so you can deploy it with `fly deploy`.

## Contributors

Originally written by @pvh.

Ported to Bun by @marionauta.

[automerge]: https://automerge.org
[automerge-repo]: https://github.com/automerge/automerge-repo
[bun]: https://bun.sh/
[bunserve]: https://bun.sh/docs/api/http
[websocket]: https://github.com/marionauta/automerge-repo-network-websocket-bun
[sqlite]: https://github.com/marionauta/automerge-repo-storage-bun-sqlite
[fly]: https://fly.io
