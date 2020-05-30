import { createHmac, timingSafeEqual } from "crypto";
import { WEBHOOK_SECRET } from "../app/config";

export default function verifyPayload(
  signature: string,
  payload: string
): boolean {
  const reqSignature = Buffer.from(signature);
  const HMAC = createHmac("sha1", Buffer.from(WEBHOOK_SECRET));
  const genSignature = Buffer.from(
    "sha1=" + HMAC.update(payload).digest("hex")
  );
  if (genSignature.length !== reqSignature.length) {
    return false;
  } else {
    return timingSafeEqual(reqSignature, genSignature);
  }
}
