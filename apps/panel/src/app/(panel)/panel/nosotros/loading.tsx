import { IMAGE_SLOTS } from "@mb/shared";
import { AboutSkeleton } from "@/components/ui/skeletons";

const PHOTOS = IMAGE_SLOTS.filter((slot) => slot.group === "nosotros");

export default function Loading() {
  return <AboutSkeleton photo={PHOTOS[0]?.recommended ?? [4, 3]} photos={PHOTOS.length} />;
}
