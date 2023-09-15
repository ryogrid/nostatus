import { NostrEvent } from "nostr-fetch";
import { getFirstTagValue } from "../nostr";

export type UserProfile = {
  srcEventId: string;
  pubkey: string;
  displayName?: string;
  name?: string;
  nip05?: string;
  picture?: string;
};

export const UserProfile = {
  fromEvent(ev: NostrEvent): UserProfile {
    if (ev.kind !== 0) {
      console.error("invalid event kind: %O", ev);
      return { srcEventId: ev.id, pubkey: ev.pubkey };
    }
    try {
      const profile = JSON.parse(ev.content) as Record<string, string>; // TODO validate schema

      const res: UserProfile = { srcEventId: ev.id, pubkey: ev.pubkey };
      res.displayName = profile["display_name"] ?? profile["displayName"];
      res.name = profile["name"];
      res.nip05 = profile["nip05"];
      res.picture = profile["picture"];

      return res;
    } catch (err) {
      console.error("failed to parse content of kind 0:", err);
      return { srcEventId: ev.id, pubkey: ev.pubkey };
    }
  },
} as const;

export type StatusData = {
  srcEventId: string;
  content: string;
  linkUrl: string;
  createdAt: number;
  expiration: number | undefined;
};

export const StatusData = {
  fromEvent(ev: NostrEvent): StatusData {
    const content = ev.content.trim();
    const createdAt = ev.created_at;
    const linkUrl = getFirstTagValue(ev, "r");
    const expiration = (() => {
      const expStr = getFirstTagValue(ev, "expiration");
      if (expStr === "") {
        return undefined;
      }
      const exp = Number(expStr);
      return !isNaN(exp) ? exp : undefined;
    })();

    return { srcEventId: ev.id, content, linkUrl, createdAt, expiration };
  },
} as const;

export type AccountMetadata = {
  profile: UserProfile;
  followings: string[];
  readRelays: string[];
};

export type UserStatus = {
  pubkey: string;
  general?: StatusData | undefined;
  music?: StatusData | undefined;
};

export const UserStatus = {
  lastUpdateTime(us: UserStatus): number {
    return Math.max(us.general?.createdAt ?? 0, us.music?.createdAt ?? 0);
  },
  contentId(us: UserStatus): string {
    return `${us.general?.srcEventId ?? "general_undefined"}${us.music?.srcEventId ?? "music_undefined"}`;
  },
};
