import { subtle } from "crypto";

// Create random SHA-256 key
function SHAKey() {
  subtle
    .generateKey(
      {
        name: "HMAC",
        hash: { name: "SHA-256" },
      },
      true,
      ["sign", "verify"]
    )
    .then((key) => {
      subtle.exportKey("jwk", key).then((exported) => {
        console.log(`Random SHA-256 key: ${exported.k}`);
      });
    });
}

export { SHAKey };
