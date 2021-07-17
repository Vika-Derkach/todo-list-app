//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useState } from "uu5g04-hooks";
import Config from "./config/config";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ItemList",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const ItemList = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    //@@viewOff:private

    const { data, dataItemResult, urlId } = props;
    const { handlerMap } = dataItemResult;

    const [text, setText] = useState(data.text);

    //@@viewOn:interface
    //@@viewOff:interface
    const handleItemDelete = async () => {
      await handlerMap.delete({ id: data.id });
    };
    const handleItemUpdate = async (values) => {
      await handlerMap.update({ ...values, id: data.id, listId: urlId });
    };

    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(props, STATICS);
    const [edit, setEtate] = useState(false);

    return currentNestingLevel ? (
      <div {...attrs}>
        <UU5.Forms.TextButton
          value={text}
          required
          size="m"
          onChange={(event) => setText(event.value)}
          buttons={[
            {
              icon: "plus4u5-trash-can",
              onClick: () => handleItemDelete(),
              colorSchema: "info",
            },

            {
              icon: "uu5-ok",
              onClick: () => handleItemUpdate({ ...data, text }),

              colorSchema: "info",
            },
          ]}
        />
      </div>
    ) : null;
    //@@viewOff:render
  },
});

export default ItemList;
