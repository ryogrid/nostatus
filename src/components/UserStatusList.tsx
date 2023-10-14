import { css } from "@shadow-panda/styled-system/css";
import { button } from "../styles/recipes";
import { useAtomValue } from "jotai";
import { VList } from "virtua";
import { myGeneralStatusAtom, updateMyStatus, pubkeysOrderByLastStatusUpdateTimeAtom } from "../states/nostr";
import { UserStatusCard } from "./UserStatusCard";
import { Input } from "./ui/input";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const UserStatusList: React.FC = () => {
  const orderedPubkeys = useAtomValue(pubkeysOrderByLastStatusUpdateTimeAtom);

  const ttlTable = {
    never: undefined,
    "10min": 10 * 60,
    "30min": 30 * 60,
    "1hr": 60 * 60,
    "4hr": 4 * 60 * 60,
    "8hr": 8 * 60 * 60,
    "1day": 24 * 60 * 60,
  } as const;

  const myGeneralStatus = useAtomValue(myGeneralStatusAtom);

  const initContent = myGeneralStatus?.content ?? "";
  const initLinkUrl = myGeneralStatus?.linkUrl ?? "";

  type TtlKey = keyof typeof ttlTable;

  const [content, setContent] = useState<string>(initContent);
  const [linkUrl, setLinkUrl] = useState<string>(initLinkUrl);
  const [ttlKey, setTtlKey] = useState<string>("never");

  const isDirty = content.trim() !== initContent || (initContent !== "" && linkUrl !== initLinkUrl);

  const handleClickUpdate = async () => {
    const ttl = ttlTable[ttlKey as TtlKey];
    await updateMyStatus({ content: content.trim(), linkUrl: linkUrl.trim(), ttl });
  };

  const { t } = useTranslation();

  return (
    <VList>
      {/* spacer above the top item */}
      <div className={css({ h: "2" })}></div>

      {/* submit form */}
      <center>
        <Input id="content" className={css({w: {base: "94%", sm: "600px"}})} type="text" value={content} onChange={(e) => setContent(e.target.value)} />
      </center>

      {/* spacer */}
      <div className={css({ h: "2" })}></div>

      {/* submit button */}
      <center>
        <button className={button()} disabled={!isDirty} onClick={handleClickUpdate}>
          {t("Submit")}
        </button>
      </center>

      {/* spacer */}
      <div className={css({ h: "5" })}></div>

      {/* main */}
      {orderedPubkeys.length !== 0 ? (
        orderedPubkeys.map((pubkey) => {
          return (
            <div
              key={pubkey}
              className={css({
                w: {
                  base: "94%", // width < 640px
                  sm: "600px",
                },
                mx: "auto",
                mb: "2",
              })}
            >
              <UserStatusCard pubkey={pubkey} />
            </div>
          );
        })
      ) : (
        <p className={css({ textAlign: "center" })}>Fetching...</p>
      )}

      {/* spacer below the bottom item */}
      <div className={css({ h: "4" })}></div>
    </VList>
  );
};
