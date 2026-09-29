"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/states";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-xl">
        <ErrorState
          title="Something went wrong"
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={() => retry()}>Try again</Button>
              <ButtonLink href="/" variant="outline">
                Go to home
              </ButtonLink>
            </div>
          }
        >
          This page hit an unexpected error. Your inputs were never sent anywhere, so nothing was lost on our side.
          Try again, or reload the page.
          {error.digest ? <span className="mt-2 block text-xs text-subtle">Reference: {error.digest}</span> : null}
        </ErrorState>
      </div>
    </div>
  );
}
