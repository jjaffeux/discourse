import Root from "./d-scroll/root";
import Trigger from "./d-scroll/trigger";

/**
 * DScroll - Scroll component following Silk's pattern
 *
 * A primitive component for building advanced scrolling experiences.
 * Provides extra features compared to normal scroll containers.
 *
 * Usage:
 * ```hbs
 * <DScroll.Root as |scroll|>
 *   <scroll.View @axis="y" @scrollGestureTrap={{hash yEnd=true}}>
 *     <scroll.Content>
 *       ...your content...
 *     </scroll.Content>
 *   </scroll.View>
 *
 *   <DScroll.Trigger
 *     @scroll={{scroll.scroll}}
 *     @action={{hash type="scroll-to" progress=0}}
 *   >
 *     Scroll to Top
 *   </DScroll.Trigger>
 * </DScroll.Root>
 * ```
 *
 * Imperative API (via yielded scroll object):
 * - scroll.scrollTo({ progress?, distance?, animationSettings? })
 * - scroll.scrollBy({ progress?, distance?, animationSettings? })
 * - scroll.getProgress() - Returns 0-1
 * - scroll.getDistance() - Returns pixels traveled
 * - scroll.getAvailableDistance() - Returns total scrollable distance
 */
const DScroll = {
  Root,
  Trigger,
};

export default DScroll;
