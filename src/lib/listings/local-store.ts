import { randomUUID } from "node:crypto";
import { access, constants, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { ACCEPTED_IMAGE_TYPES, parseListings, upsert, type ListingStore } from "./store";

const DATA_DIR = path.join(process.cwd(), "data");
const LISTINGS_FILE = path.join(DATA_DIR, "listings.json");
export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

async function read() {
  try {
    return parseListings(JSON.parse(await readFile(LISTINGS_FILE, "utf8")));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

/** Write via a temp file and rename, so a crash mid-write can never leave half a file. */
async function write(listings: unknown) {
  await mkdir(DATA_DIR, { recursive: true });
  const tmp = `${LISTINGS_FILE}.${randomUUID()}.tmp`;
  await writeFile(tmp, JSON.stringify(listings, null, 2) + "\n", "utf8");
  await rename(tmp, LISTINGS_FILE);
}

export const localStore: ListingStore = {
  kind: "local",

  list: read,

  async save(listing, previousSlug) {
    await write(upsert(await read(), listing, previousSlug));
  },

  async remove(slug) {
    await write((await read()).filter((l) => l.slug !== slug));
  },

  async uploadImage(file) {
    const ext = ACCEPTED_IMAGE_TYPES[file.type];
    const year = String(new Date().getFullYear());
    const dir = path.join(UPLOADS_DIR, year);
    await mkdir(dir, { recursive: true });
    const name = `${randomUUID()}.${ext}`;
    await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
    return `/media/${year}/${name}`;
  },

  async writable() {
    try {
      await mkdir(DATA_DIR, { recursive: true });
      await access(DATA_DIR, constants.W_OK);
      return true;
    } catch {
      return false;
    }
  },
};
