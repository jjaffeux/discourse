import Component from "@glimmer/component";
import DSheet from "discourse/float-kit/components/d-sheet";
import DSheetWithDetent from "discourse/float-kit/components/d-sheet-with-detent";
import DSheetWithStackingExports from "discourse/float-kit/components/d-sheet-with-stacking";
import DToast from "discourse/float-kit/components/d-toast";
import StyleguideComponent from "discourse/plugins/styleguide/discourse/components/styleguide/component";
import StyleguideExample from "discourse/plugins/styleguide/discourse/components/styleguide-example";

const { DSheetWithStacking, DSheetWithStackingStack } =
  DSheetWithStackingExports;

export default class Sheets extends Component {
  <template>
    <StyleguideExample @title="Sheets">
      <StyleguideComponent @tag="bottom">
        <:sample>
          <DSheet.Root as |root|>
            <root.Trigger>
              Bottom sheet
            </root.Trigger>
            <root.Portal>
              <root.View class="my-view" as |view|>
                <view.Backdrop />
                <view.Content
                  class="BottomSheet-content ExampleBottomSheet-content"
                >
                  test
                </view.Content>
              </root.View>
            </root.Portal>
          </DSheet.Root>
        </:sample>
      </StyleguideComponent>

      <StyleguideComponent @tag="with-detent">
        <:sample>
          <DSheetWithDetent.Root as |root|>
            <root.Trigger>
              Sheet with 66vh detent
            </root.Trigger>
            <root.Portal>
              <root.View as |view|>
                <view.Backdrop />
                <view.Content>
                  <root.Handle />
                  <root.ScrollRoot>
                    <root.ScrollView>
                      <root.ScrollContent>
                        <div class="sheet-with-detent-example-content">
                          <h3>Sheet with Detent</h3>
                          <p>
                            This sheet starts at 66vh and expands to full height
                            when you drag past the detent or click the handle.
                          </p>
                          <p>
                            Current state:
                            {{if
                              root.reachedLastDetent
                              "Full height"
                              "66vh detent"
                            }}
                          </p>
                          <p>
                            The handle action changes based on the current
                            detent:
                          </p>
                          <ul>
                            <li>At 66vh: clicking the handle expands to full
                              height</li>
                            <li>At full height: clicking the handle dismisses
                              the sheet</li>
                          </ul>
                          <p>
                            Scroll is disabled until full height is reached, so
                            dragging expands the sheet instead of scrolling
                            content.
                          </p>
                        </div>
                      </root.ScrollContent>
                    </root.ScrollView>
                  </root.ScrollRoot>
                </view.Content>
              </root.View>
            </root.Portal>
          </DSheetWithDetent.Root>
        </:sample>
      </StyleguideComponent>

      <StyleguideComponent @tag="toast">
        <:sample>
          <DToast.Root as |toast|>
            <toast.Trigger>
              Show Toast
            </toast.Trigger>
            <toast.Portal>
              <toast.View as |view|>
                <view.Content>
                  <div class="ExampleToast-root">
                    <div class="ExampleToast-illustration"></div>
                    <toast.Title class="ExampleToast-title">
                      Message from David
                    </toast.Title>
                    <toast.Description class="ExampleToast-description">
                      Im moving next week
                    </toast.Description>
                  </div>
                </view.Content>
              </toast.View>
            </toast.Portal>
          </DToast.Root>
        </:sample>
      </StyleguideComponent>

      <StyleguideComponent @tag="with-stacking">
        <:sample>
          <DSheetWithStackingStack.Root @asChild={{true}}>
            <DSheetWithStacking.Root as |root|>
              <root.Trigger>
                Sheet with Stacking
              </root.Trigger>
              <root.Portal>
                <root.View as |view|>
                  <view.Backdrop />
                  <view.Content>
                    <div class="sheet-with-stacking-example-content">
                      <h3>Sheet with Stacking</h3>
                      <p>
                        This sheet demonstrates stacking behavior. When you open
                        a nested sheet, this one animates to create depth.
                      </p>
                      <p>
                        Current placement:
                        {{root.contentPlacement}}
                      </p>

                      <DSheetWithStacking.Root as |nested|>
                        <nested.Trigger>
                          Open Nested Sheet
                        </nested.Trigger>
                        <nested.Portal>
                          <nested.View as |nestedView|>
                            <nestedView.Backdrop />
                            <nestedView.Content>
                              <div class="sheet-with-stacking-example-content">
                                <h3>Nested Sheet</h3>
                                <p>
                                  This is the nested sheet.
                                </p>
                              </div>
                            </nestedView.Content>
                          </nested.View>
                        </nested.Portal>
                      </DSheetWithStacking.Root>
                    </div>
                  </view.Content>
                </root.View>
              </root.Portal>
            </DSheetWithStacking.Root>
          </DSheetWithStackingStack.Root>
        </:sample>
      </StyleguideComponent>
    </StyleguideExample>
  </template>
}
