//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useState } from "uu5g04-hooks";
import Config from "./config/config";
import Css from "../bricks/styles/item-list.css";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ItemList",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

let item_text;
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
    const [edit, setEdit] = useState(false);
    const [complete, setComplete] = useState(data.completed);

    //@@viewOn:interface
    //@@viewOff:interface
    const handleItemDelete = async () => {
      setEdit(!edit);
      await handlerMap.delete({ id: data.id });
      // setEdit(!edit);
    };
    const handleItemUpdate = async (values) => {
      await handlerMap.update({ ...values, id: data.id, listId: urlId });
      setEdit(!edit);
    };
    const handleItemComplete = async () => {
      await handlerMap.completeItem({ id: data.id, completed: !complete });
      setComplete(!complete);
    };
    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(props, STATICS);

    item_text = complete ? Css.item_crossed_text() : Css.item_noncrossed_text();

    if (edit) {
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
    } else {
      return currentNestingLevel ? (
        <div {...attrs}>
          <UU5.Bricks.Div className={Css.item_veiw()}>
            <UU5.Bricks.Box borderRadius="8px" className={Css.item_box()} colorSchema="grey">
              <UU5.Bricks.Div className={Css.item_checkbox()}>
                <UU5.Forms.Checkbox
                  value={complete}
                  size="s"
                  onChange={() => handleItemComplete()}
                  labelPosition="center"
                />
              </UU5.Bricks.Div>
              <UU5.Bricks.Div className={item_text}>
                {" "}
                <UU5.Bricks.Text>{text}</UU5.Bricks.Text>
              </UU5.Bricks.Div>
              <UU5.Bricks.Div className={Css.item_button()}>
                {" "}
                <UU5.Bricks.Button onClick={() => setEdit(true)}>
                  <UU5.Bricks.Icon icon="mdi-pencil" />
                </UU5.Bricks.Button>
              </UU5.Bricks.Div>
            </UU5.Bricks.Box>
          </UU5.Bricks.Div>
        </div>
      ) : null;
    }

    //@@viewOff:render
  },
});

export default ItemList;
