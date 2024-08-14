import os from "os";
import express from "express";
import { WebSocketServer } from "ws";
import { type PeerId, Repo, type RepoConfig } from "@automerge/automerge-repo";
import { NodeWSServerAdapter } from "@automerge/automerge-repo-network-websocket";
import Database from "better-sqlite3";
import { BetterSqlite3StorageAdapter } from "@marionauta/automerge-repo-better-sqlite3";

export class Server {
  #socket: WebSocketServer;

  #server: ReturnType<import("express").Express["listen"]>;

  #readyResolvers: ((value: unknown) => void)[] = [];

  #isReady = false;

  #repo: Repo;

  constructor() {
    const DATABASE = process.env.DATABASE ?? "documents.db";
    const db = new Database(DATABASE);
    // db.pragma("journal_mode = WAL");

    this.#socket = new WebSocketServer({ noServer: true });

    const PORT = parseInt(process.env.PORT ?? "3030", 10);
    const app = express();
    app.use(express.static("public"));

    const hostname = os.hostname();
    const peerId = `sync-server-${hostname}` as PeerId;

    const config: RepoConfig = {
      peerId,
      // @ts-ignore deal with this later
      network: [new NodeWSServerAdapter(this.#socket)],
      storage: new BetterSqlite3StorageAdapter(db),
      /** @ts-ignore @type {(import("@automerge/automerge-repo").PeerId)}  */
      // Since this is a server, we don't share generously — meaning we only sync documents they already
      // know about and can ask for by ID.
      sharePolicy: async () => false,
    };
    this.#repo = new Repo(config);

    app.get("/", (req, res) => {
      res.send(`👍 ${peerId} running`);
    });

    this.#server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Listening on port ${PORT}`);
      this.#isReady = true;
      this.#readyResolvers.forEach((resolve) => resolve(true));
    });

    this.#server.on("upgrade", (request, socket, head) => {
      this.#socket.handleUpgrade(request, socket, head, (socket) => {
        this.#socket.emit("connection", socket, request);
      });
    });
  }

  async ready() {
    if (this.#isReady) {
      return true;
    }

    return new Promise((resolve) => {
      this.#readyResolvers.push(resolve);
    });
  }

  close() {
    this.#socket.close();
    this.#server.close();
  }
}
