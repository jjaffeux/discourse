import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { fn } from "@ember/helper";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import { htmlSafe } from "@ember/template";
import DSheet from "discourse/float-kit/components/d-sheet";
import DSheetWithDetent from "discourse/float-kit/components/d-sheet-with-detent";
import DSheetWithKeyboard from "discourse/float-kit/components/d-sheet-with-keyboard";
import DSheetWithStackingExports from "discourse/float-kit/components/d-sheet-with-stacking";
import DToast from "discourse/float-kit/components/d-toast";
import StyleguideComponent from "discourse/plugins/styleguide/discourse/components/styleguide/component";
import StyleguideExample from "discourse/plugins/styleguide/discourse/components/styleguide-example";

const { DSheetWithStacking, DSheetWithStackingStack } =
  DSheetWithStackingExports;

export default class Sheets extends Component {
  // Form values for SheetWithKeyboard example
  @tracked formName = "TrailBlazer Runners";
  @tracked formBrand = "NatureStride";
  @tracked formType = "Footwear";
  @tracked formColor1 = "#d1a74c";
  @tracked formColor2 = "#7dd42c";
  @tracked formColor3 = "#ffffff";
  @tracked formPrice = "149";
  @tracked formDescription =
    "Experience unmatched comfort and performance with NatureStride's TrailBlazer Runners.";

  @action
  updateFormField(field, event) {
    this[field] = event.target.value;
  }

  colorStyle(color) {
    return htmlSafe(`--color: ${color}`);
  }
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
                  <root.ScrollView>
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
                        The handle action changes based on the current detent:
                      </p>
                      <ul>
                        <li>At 66vh: clicking the handle expands to full height</li>
                        <li>At full height: clicking the handle dismisses the
                          sheet</li>
                      </ul>
                      <p>
                        Scroll is disabled until full height is reached, so
                        dragging expands the sheet instead of scrolling content.
                      </p>
                    </div>
                  </root.ScrollView>
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

      <StyleguideComponent @tag="with-keyboard">
        <:sample>
          <DSheetWithKeyboard.Root as |root|>
            <root.Trigger class="ExampleSheetWithKeyboard-presentTrigger">
              Sheet with Keyboard
            </root.Trigger>
            <root.Portal>
              <root.View as |view|>
                <view.Backdrop />
                <view.Content class="ExampleSheetWithKeyboard-content">
                  <div class="ExampleSheetWithKeyboard-header">
                    <root.Trigger
                      class="ExampleSheetWithKeyboard-cancelButton"
                      @action="dismiss"
                    >
                      Cancel
                    </root.Trigger>
                    <h2 class="ExampleSheetWithKeyboard-title">
                      Edit Product
                    </h2>
                    <root.Trigger
                      class="ExampleSheetWithKeyboard-saveButton"
                      @action="dismiss"
                    >
                      Save
                    </root.Trigger>
                  </div>
                  <root.ScrollView>
                    <div class="ExampleSheetWithKeyboard-info">
                      <h3 class="ExampleSheetWithKeyboard-details">
                        Product details
                      </h3>
                      <div class="ExampleSheetWithKeyboard-form">
                        <div class="ExampleSheetWithKeyboard-field">
                          <label
                            for="keyboard-name"
                            class="ExampleSheetWithKeyboard-label"
                          >
                            Name
                          </label>
                          <p class="ExampleSheetWithKeyboard-labelDescription">
                            The name displayed on the product's card.
                          </p>
                          <input
                            class="ExampleSheetWithKeyboard-input"
                            id="keyboard-name"
                            name="name"
                            type="text"
                            placeholder="Classic t-shirt"
                            value={{this.formName}}
                            {{on "input" (fn this.updateFormField "formName")}}
                          />
                        </div>
                        <div class="ExampleSheetWithKeyboard-field">
                          <label
                            for="keyboard-brand"
                            class="ExampleSheetWithKeyboard-label"
                          >
                            Brand
                          </label>
                          <p class="ExampleSheetWithKeyboard-labelDescription">
                            The brand of the product.
                          </p>
                          <input
                            class="ExampleSheetWithKeyboard-input"
                            id="keyboard-brand"
                            name="brand"
                            type="text"
                            placeholder="Acme"
                            value={{this.formBrand}}
                            {{on "input" (fn this.updateFormField "formBrand")}}
                          />
                        </div>
                        <div class="ExampleSheetWithKeyboard-field">
                          <label
                            for="keyboard-type"
                            class="ExampleSheetWithKeyboard-label"
                          >
                            Type
                          </label>
                          <p class="ExampleSheetWithKeyboard-labelDescription">
                            The type of the product (e.g. "t-shirt", "pants").
                          </p>
                          <input
                            class="ExampleSheetWithKeyboard-input"
                            id="keyboard-type"
                            name="type"
                            type="text"
                            placeholder="T-shirt"
                            value={{this.formType}}
                            {{on "input" (fn this.updateFormField "formType")}}
                          />
                        </div>
                        <div
                          class="ExampleSheetWithKeyboard-field fieldType-color"
                        >
                          <div class="ExampleSheetWithKeyboard-label">
                            Colors
                          </div>
                          <p class="ExampleSheetWithKeyboard-labelDescription">
                            The main colors of the product.
                          </p>
                          <div class="ExampleSheetWithKeyboard-colorInputs">
                            <div
                              class="ExampleSheetWithKeyboard-colorInputWrapper"
                            >
                              <input
                                class="ExampleSheetWithKeyboard-colorInput"
                                id="keyboard-color1"
                                name="color1"
                                type="color"
                                value={{this.formColor1}}
                                {{on
                                  "input"
                                  (fn this.updateFormField "formColor1")
                                }}
                              />
                              <div
                                class="ExampleSheetWithKeyboard-colorInputReplacement"
                                style={{this.colorStyle this.formColor1}}
                              ></div>
                            </div>
                            <div
                              class="ExampleSheetWithKeyboard-colorInputWrapper"
                            >
                              <input
                                class="ExampleSheetWithKeyboard-colorInput"
                                id="keyboard-color2"
                                name="color2"
                                type="color"
                                value={{this.formColor2}}
                                {{on
                                  "input"
                                  (fn this.updateFormField "formColor2")
                                }}
                              />
                              <div
                                class="ExampleSheetWithKeyboard-colorInputReplacement"
                                style={{this.colorStyle this.formColor2}}
                              ></div>
                            </div>
                            <div
                              class="ExampleSheetWithKeyboard-colorInputWrapper"
                            >
                              <input
                                class="ExampleSheetWithKeyboard-colorInput"
                                id="keyboard-color3"
                                name="color3"
                                type="color"
                                value={{this.formColor3}}
                                {{on
                                  "input"
                                  (fn this.updateFormField "formColor3")
                                }}
                              />
                              <div
                                class="ExampleSheetWithKeyboard-colorInputReplacement"
                                style={{this.colorStyle this.formColor3}}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div class="ExampleSheetWithKeyboard-field">
                          <label
                            for="keyboard-price"
                            class="ExampleSheetWithKeyboard-label"
                          >
                            Price
                          </label>
                          <p class="ExampleSheetWithKeyboard-labelDescription">
                            The price of the product (€).
                          </p>
                          <input
                            class="ExampleSheetWithKeyboard-input"
                            id="keyboard-price"
                            name="price"
                            type="number"
                            pattern="\d*"
                            placeholder="19"
                            value={{this.formPrice}}
                            {{on "input" (fn this.updateFormField "formPrice")}}
                          />
                        </div>
                        <div
                          class="ExampleSheetWithKeyboard-field fieldType-description"
                        >
                          <label
                            for="keyboard-description"
                            class="ExampleSheetWithKeyboard-label"
                          >
                            Description
                          </label>
                          <p class="ExampleSheetWithKeyboard-labelDescription">
                            The description that will shown on the product's
                            page.
                          </p>
                          <textarea
                            class="ExampleSheetWithKeyboard-textarea"
                            id="keyboard-description"
                            name="description"
                            rows="5"
                            placeholder="Soft and stylish t-shirt made from 100% organic cotton for all-day comfort."
                            {{on
                              "input"
                              (fn this.updateFormField "formDescription")
                            }}
                          >{{this.formDescription}}</textarea>
                        </div>
                      </div>
                    </div>
                  </root.ScrollView>
                </view.Content>
              </root.View>
            </root.Portal>
          </DSheetWithKeyboard.Root>
        </:sample>
      </StyleguideComponent>
    </StyleguideExample>
  </template>
}
