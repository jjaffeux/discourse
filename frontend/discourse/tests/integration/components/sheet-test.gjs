import { blur, click, fillIn, render, settled } from "@ember/test-helpers";
import { module, test } from "qunit";
import DSheet from "discourse/float-kit/components/d-sheet";
import { setupRenderingTest } from "discourse/tests/helpers/component-test";
import { i18n } from "discourse-i18n";

module("Integration | Component | DSheet", function (hooks) {
  setupRenderingTest(hooks);

  test("default", async function (assert) {
    await render(
      <template>
        <DSheet.Root as |root|>
          <root.View class="my-view" as |view|>
            <view.Content
              class="BottomSheet-content ExampleBottomSheet-content"
            >
              test
            </view.Content>
          </root.View>
        </DSheet.Root>
      </template>
    );

    assert.dom("[data-d-sheet~='view']").doesNotExist();

    await click(".btn");

    // Wait for the animation to complete (5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 5000));

    assert.true(
      document
        .querySelector("[data-d-sheet~='content-wrapper']")
        .getBoundingClientRect().top < 0
    );

    // assert
    //   .dom("[data-d-sheet~='view']")
    //   .hasAttribute("--d-sheet-view-travel-axis", "994px");
    // assert
    //   .dom("[data-d-sheet~='view']")
    //   .hasAttribute("--d-sheet-view-cross-axis", "1326px");
    // assert
    //   .dom("[data-d-sheet~='view']")
    //   .hasAttribute("--d-sheet-content-travel-axis", "604.188px");
    // assert
    //   .dom("[data-d-sheet~='view']")
    //   .hasAttribute("--d-sheet-content-cross-axis", "700px");
    // assert
    //   .dom("[data-d-sheet~='view']")
    //   .hasAttribute("--d-sheet-front-spacer:", " 825.235px;");
    // assert
    //   .dom("[data-d-sheet~='view']")
    //   .hasAttribute("--d-sheet-back-spacer", "994px");
    // assert
    //   .dom("[data-d-sheet~='view']")
    //   .hasAttribute("--d-sheet-first-detent-size", "604.188px");
    // assert
    //   .dom("[data-d-sheet~='view']")
    //   .hasAttribute("--d-sheet-snap-accelarator", "221.047px");
  });
});
