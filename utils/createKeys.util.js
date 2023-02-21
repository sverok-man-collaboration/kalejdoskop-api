// @ts-nocheck
const crypto = require("crypto");

function key() {
  crypto.subtle
    .generateKey(
      {
        name: "HMAC",
        hash: { name: "SHA-256" },
      },
      true,
      ["sign", "verify"]
    )
    .then((key) => {
      crypto.subtle.exportKey("jwk", key).then((exported) => {
        console.log(`Random SHA-256 key: ${exported.k}`);
      });
    });
}

module.exports = { key };
