import { css } from "../../styled-system/css";
import { circle, hstack, vstack } from "../../styled-system/patterns";
import { UserProfile, UserStatus } from "../nostr";

type UserStatusCardProps = {
  profile: UserProfile;
  status: UserStatus;
};

export const UserStatusCard: React.FC<UserStatusCardProps> = ({
  profile,
  status,
}) => {
  return (
    <div
      className={vstack({
        px: "4",
        pt: "4",
        pb: "3",
        alignItems: "start",
        gap: "2.5",
        lineHeight: "snug",
        border: "1px solid gray",
        rounded: "md",
      })}
    >
      <div>
        {/* status */}
        <p
          className={css({
            textStyle: "main-status",
          })}
        >
          {status.general?.content || "no status"}
        </p>

        {/* now playing  */}
        {status.music && status.music.content && (
          <div
            className={css({
              textStyle: "now-playing",
              color: "slate.600",
              _before: {
                content: "'♫'",
                mr: "1",
              },
            })}
          >
            {status.music.content}
          </div>
        )}
      </div>

      {/* profile */}
      <div className={hstack({ gap: "1" })}>
        <img
          className={circle({
            size: "5",
            maxWidth: "none",
            objectFit: "cover",
          })}
          src={profile.picture}
          alt="avatar"
        />
        <div
          className={hstack({
            gap: "1",
            alignItems: "baseline",
          })}
        >
          {profile.displayName && (
            <p className={css({ textStyle: "display-name" })}>
              {profile.displayName}
            </p>
          )}
          <p className={css({ textStyle: "name", color: "gray.400" })}>
            @{profile.name ?? "???"}
          </p>
        </div>
      </div>
    </div>
  );
};