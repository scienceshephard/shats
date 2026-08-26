import { PatientPage } from "@/components/shells";
import { Skeleton, SkeletonList } from "@/components/states";

/** Shaped like the doctor list it replaces, so the page does not jump. */
export default function Loading() {
  return (
    <PatientPage showGoNext={false}>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-4 h-9 w-4/5" />
      <Skeleton className="mt-3 h-4 w-3/5" />
      <SkeletonList rows={3} height={132} />
    </PatientPage>
  );
}
