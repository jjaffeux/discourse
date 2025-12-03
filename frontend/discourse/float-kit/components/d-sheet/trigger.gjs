import DButton from "discourse/components/d-button";

const Trigger = <template>
  <DButton @action={{if @openSheet @openSheet @sheet.open}}>
    {{yield}}
  </DButton>
</template>;

export default Trigger;
