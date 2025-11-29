/**
 * Root component for scroll container wrapper
 * @component DScrollRoot
 *
 * Following Silk's Scroll.Root (c1 element) exactly:
 * - Renders a wrapper div with `data-d-scroll="root"`
 * - Uses display: grid to constrain the child scrollable element
 * - Has overflow: hidden to clip content
 * - Makes direct children position: absolute to fill the grid cell
 *
 * This is the OUTER wrapper. DScrollView (c2) goes INSIDE this.
 *
 * @param {boolean} [asChild=false] - When true, merges with child element (Slot-like behavior)
 */

const DScrollRoot = <template>
  <div class="d-scroll-root" data-d-scroll="root" ...attributes>
    {{yield}}
  </div>
</template>;

export default DScrollRoot;
