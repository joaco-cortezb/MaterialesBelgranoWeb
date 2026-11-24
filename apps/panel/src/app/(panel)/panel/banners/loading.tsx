import { BANNER_KEYS, BANNER_MOBILE_SIZE, BANNER_SIZE } from "@mb/shared";
import { BannersSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
  return <BannersSkeleton desktop={BANNER_SIZE} mobile={BANNER_MOBILE_SIZE} cards={BANNER_KEYS.length} />;
}
