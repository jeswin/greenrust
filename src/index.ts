/* This is the module for the p2p bot */
const libpeer = require("libpeer");

/* Some APP Specific Details */
const APP_ID = "BLABBEROMA";
const appDataStore = new AppDataStore();

async function init() {
  // Create a client. Param is in multiaddr format.
  const client = new libpeer.Client("/ip4/1.2.3.4/tcp/443/");

  // Make sure we have a stream to write into.
  // This is to write the users status messages and images
  await libpeer.ensureStreams([
    {
      name: "statusfeed",
      concatMessages: true,
      rotation: "size",
      rotationMaxSizeKB: 10,
      retain: true
    },
    { name: "images", concatMessages: false, encrypt: false, retain: false }
  ]);

  // Get a list of peers
  const peers = await libpeer.getPeers(APP_ID);

  for (const peer of peers) {
    // For a peer, get the last-synced msgid for statusfeed and images.
    const {
      streams: { statusfeed, images }
    } = await appDataStore.getPeerState(peer.id);

    // Read the peer's statusfeed
    peer.readStream(statusfeed.lastSynced, async (msg: string) => {
      writeToLocalDB(msg);
    });

    // Read the peer's blob stream
    peer.readStream(images.lastSynced, async (msg: string) => {
      writeImage(msg);
    });
  }
}

async function addPeer(peerUrl: string) {
  await libpeer.addPeer(peerUrl);
}

async function writeToLocalDB(data: string) {
  // Write to an sqlite database or something.
  // Table schemas are app specific.
  return;
}

async function writeImage(data: string) {
  // Write to a jpg or png file.
  return;
}

/*
  Show a UI.
  Read from sqlite.
  Display some images etc.
*/
async function startUI() {
  return "<div>Hello World....(content goes here)</div>";
}
