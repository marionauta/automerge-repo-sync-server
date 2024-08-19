import os from "os";
import { type PeerId, Repo, type RepoConfig } from "@automerge/automerge-repo";
import { BunWSServerAdapter } from "automerge-repo-network-websocket-bun";
import { BunSqliteStorageAdapter } from "automerge-repo-storage-bun-sqlite";

export class Server {
  constructor() {
    const DATABASE = process.env["DATABASE"] ?? ":memory:";
    const PORT = parseInt(process.env["PORT"] ?? "3030", 10);

    const hostname = os.hostname();
    const peerId = `sync-server-${hostname}` as PeerId;

    const socketAdapter = new BunWSServerAdapter();

    const config: RepoConfig = {
      peerId,
      network: [socketAdapter],
      storage: new BunSqliteStorageAdapter(DATABASE),
      // Since this is a server, we don't share generously — meaning we only
      // sync documents they already know about and can ask for by ID.
      sharePolicy: async () => false,
    };
    const repo = new Repo(config);

    const server = Bun.serve({
      hostname: "0.0.0.0",
      port: PORT,
      fetch(request, server) {
        if (
          request.headers.get("upgrade") === "websocket" &&
          server.upgrade(request)
        ) {
          return;
        }
        return new Response("Running");
      },
      websocket: socketAdapter,
    });
    console.log(
      `Listening on ${server.url} with PeerId ${repo.networkSubsystem.peerId}`,
    );
  }
}
