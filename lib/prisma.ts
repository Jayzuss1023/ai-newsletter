import dns from "node:dns";
import { MongoClient, MongoClientOptions } from "mongodb";

// Node's SRV resolver (used by mongodb+srv) often times out on macOS
// even when A-record lookups succeed. Prefer public DNS and a seed list.
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

const ATLAS_HOST = process.env.ATLAS_HOST;
const ATLAS_SEEDS = [
  process.env.ATLAS_SEED_ONE,
  process.env.ATLAS_SEED_TWO,
  process.env.ATLAS_SEED_THREE,
];
const ATLAS_REPLICA_SET = "atlas-apn0lc-shard-0";

/**
 * Convert mongodb+srv:// to mongodb:// host list so the driver skips querySrv.
 */
function toDirectSeedUri(uri: string): string {
  if (!uri.startsWith("mongodb+srv://")) {
    return uri;
  }

  const withoutScheme = uri.slice("mongodb+srv://".length);
  const at = withoutScheme.lastIndexOf("@");
  const auth = at >= 0 ? withoutScheme.slice(0, at) : "";
  const hostPart = at >= 0 ? withoutScheme.slice(at + 1) : withoutScheme;
  const slash = hostPart.indexOf("/");
  const q = hostPart.indexOf("?");
  const hostEnd = slash !== -1 ? slash : q !== -1 ? q : hostPart.length;
  const hostname = hostPart.slice(0, hostEnd).split(":")[0];

  if (hostname !== ATLAS_HOST) {
    return uri;
  }

  const dbPath =
    slash !== -1 ? hostPart.slice(slash, q === -1 ? undefined : q) : "/";
  const query = q !== -1 ? hostPart.slice(q + 1) : "";
  const params = new URLSearchParams(query);
  params.set("tls", "true");
  if (!params.has("authSource")) {
    params.set("authSource", "admin");
  }
  if (!params.has("replicaSet")) {
    params.set("replicaSet", ATLAS_REPLICA_SET);
  }

  const authPrefix = auth ? `${auth}@` : "";
  return `mongodb://${authPrefix}${ATLAS_SEEDS.join(",")}${dbPath}?${params.toString()}`;
}

const rawUri = process.env.MONGODB_URI;
if (!rawUri) {
  throw new Error("Please add your MONGODB_URI to your .env.local file");
}
const uri = toDirectSeedUri(rawUri);

const options: MongoClientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  family: 4,
  retryReads: true,
};

let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function connectClient(): Promise<MongoClient> {
  const client = new MongoClient(uri, options);
  return client.connect().catch((error) => {
    // Do not keep a rejected connect() on global — HMR would replay it forever.
    global._mongoClientPromise = undefined;
    throw error;
  });
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = connectClient();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = connectClient();
}

export default clientPromise;
