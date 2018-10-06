const sync = require("libpeer");
const store = require("store");

const APP_ID = "BLABBEROMA";

async function init() {
  await sync.ensureStreams(["statusfeed"]);

  const peers = await sync.getPeers(APP_ID);
  
  for (const peer of peers) {
    const { data, blobs } = await store.getPeerState(peer.id);
    peer.readStream(data.statusfeed.lastSynced, async (msg: string) => {
      processData(msg);
    });
    peer.readBlobStream(blobs.statusfeed.lastSynced, async (msg: string) => {
      processData(msg);
    });
  }
}

async function processData(data: string) {
  return;
}

