import Component from "@glimmer/component";
import DMenu from "float-kit/components/d-menu";

export default class MoreMenu extends Component {
  <template>
    <DMenu @icon="ellipsis-h">
      <:content>
        test
      </:content>
    </DMenu>
  </template>
}
