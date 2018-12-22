import computed from "ember-addons/ember-computed-decorators";
import Category from "discourse/models/category";
import { categoryBadgeHTML } from "discourse/helpers/category-link";
import renderTags from "discourse/lib/render-tags";

export default Ember.Component.extend({
  classNames: ["inline-categorization"],

  category: null,

  topic: null,

  showParent: true,

  tagName: "div",

  @computed("category", "parentCategory", "showParent")
  badgeForCategory(category, parentCategory, showParent) {
    return categoryBadgeHTML(category, {
      hideParent: !!parentCategory && !!showParent
    }).htmlSafe();
  },

  @computed("topic")
  badgeForTags(topic) {
    return renderTags(topic).htmlSafe();
  },

  @computed("parentCategoryid")
  parentCategory(parentCategoryId) {
    return Category.findById(parentCategoryId);
  },

  parentCategoryid: Ember.computed.alias("category.parent_category_id")
});
