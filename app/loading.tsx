import { PageLoading } from "@/components/states";

/** Shown while a route segment is still resolving on the server. */
export default function Loading() {
  return <PageLoading label="Getting your page ready" />;
}
