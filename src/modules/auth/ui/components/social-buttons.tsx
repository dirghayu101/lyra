import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { FaGithub, FaGoogle } from "react-icons/fa";

type Props = {
  pending: boolean;
  setError: (val: string | null) => void;
  setPending: (val: boolean) => void;
};

export const SocialButtons = ({ pending, setError, setPending }: Props) => {
  const onSocial = (provider: "github" | "google") => {
    setError(null);
    setPending(true);

    authClient.signIn.social(
      {
        provider: provider,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setPending(false);
        },
        onError: (context) => {
          setPending(false);
          setError(context.error?.message || "Authentication failed");
        },
      }
    );
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={pending}
        onClick={() => onSocial("google")}
        aria-label="Sign in with Google"
      >
        <FaGoogle />
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={pending}
        onClick={() => onSocial("github")}
        aria-label="Sign in with GitHub"
      >
        <FaGithub />
      </Button>
    </div>
  );
};
