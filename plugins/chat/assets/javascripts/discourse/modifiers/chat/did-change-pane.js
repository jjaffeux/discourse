import { schedule } from "@ember/runloop";
import Modifier from "ember-modifier";
import { registerDestructor } from "@ember/destroyable";
import discourseDebounce from "discourse-common/lib/debounce";

const DATE_SEPARATOR_CLASS = ".chat-message-separator__date";

export default class ChatDidChangePane extends Modifier {
  constructor(owner, args) {
    super(owner, args);
    registerDestructor(this, (instance) => instance.cleanup());
  }

  modify(element) {
    this.element = element;

    schedule("afterRender", () => {
      this.intersectionObserver = new IntersectionObserver(
        ([event]) => {
          if (event.isIntersecting) {
            event.target.classList.remove("is-pinned");
          } else if (event.intersectionRatio > 0) {
            event.target.classList.add("is-pinned");
          }
        },
        { threshold: 1, root: this.element, rootMargin: "0px" }
      );

      this.mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            discourseDebounce(this, this.#computeSeparatorsPosition, 100);

            mutation.addedNodes.forEach((addedNode) => {
              if (
                addedNode.classList?.contains("chat-message-separator__date")
              ) {
                this.intersectionObserver.observe(
                  addedNode.querySelector(
                    ".chat-message-separator__date-text-container"
                  )
                );
              }
            });
          }
        });
      });
      const config = { subtree: true, childList: true };
      this.mutationObserver.observe(this.element, config);

      this.resizeObserver = new ResizeObserver(() => {
        discourseDebounce(this, this.#computeSeparatorsPosition, 100);
      });
      this.resizeObserver.observe(this.element);
    });
  }

  cleanup() {
    this.mutationObserver?.disconnect();
    this.resizeObserver?.disconnect();
  }

  #computeSeparatorsPosition() {
    schedule("afterRender", () => {
      const separators = this.element.querySelectorAll(DATE_SEPARATOR_CLASS);
      const scrollHeight = this.element.scrollHeight;

      separators.forEach((separator) => {
        separator.style.top = separator.nextElementSibling.offsetTop + "px";

        const nextSiblingSeparator = this.#getNextSibling(
          separator,
          DATE_SEPARATOR_CLASS
        );

        if (nextSiblingSeparator) {
          separator.style.bottom =
            scrollHeight - nextSiblingSeparator.offsetTop + "px";
        } else {
          separator.style.bottom = "0px";
        }
      });
    });
  }

  #getNextSibling(elem, selector) {
    let sibling = elem.nextElementSibling;

    while (sibling) {
      if (sibling.matches(selector)) {
        return sibling;
      }
      sibling = sibling.nextElementSibling;
    }
  }
}
