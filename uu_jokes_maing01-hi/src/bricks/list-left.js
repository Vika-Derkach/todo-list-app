//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useState } from "uu5g04-hooks";
import Config from "./config/config";
import Calls from "../calls";
import Css from "../bricks/styles/list-left.css";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ListLeft",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const ListLeft = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    const { data, dataListResult, openDeleteConfirm, openUpdateModal } = props;
    const { handlerMap, itemHandlerMap } = dataListResult;

    //@viewOn:hooks
    const [name, setName] = useState(data.name);
    const [edit, setEdit] = useState(false);
    //@viewOff:hooks

    let itemListLength;

    Calls.listItem({ listId: data.id }).then((el) => {
      itemListLength = el.itemList.length;
    });
    //@@viewOn:private
    const handleListDeleteForce = (data) => {
      if (itemListLength <= 0) {
        handlerMap.delete({ id: data.id });
      } else {
        openDeleteConfirm(data, handlerMap.delete);
      }
    };

    const handleListUpdate = async (values) => {
      await handlerMap.update({ ...values, id: data.id });
      setEdit(!edit);
    };
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(props, STATICS);

    if (edit) {
      return currentNestingLevel ? (
        <div {...attrs}>
          <UU5.Forms.TextButton
            value={name}
            required
            size="s"
            onChange={(event) => setName(event.value)}
            buttons={[
              {
                icon: "plus4u5-trash-can",
                onClick: () => handleListDeleteForce(data),
                colorSchema: "info",
              },

              {
                icon: "uu5-ok",
                onClick: () => handleListUpdate({ ...data, name }),

                colorSchema: "grey",
              },
            ]}
          />
        </div>
      ) : null;
    } else {
      return currentNestingLevel ? (
        <div {...attrs}>
          <UU5.Bricks.Div className={Css.list_veiw()}>
            <UU5.Bricks.Div bgStyle="transparent" className={Css.list_box()}>
              <UU5.Bricks.Div className={Css.list_text()}>
                <UU5.Bricks.Text>{name}</UU5.Bricks.Text>
              </UU5.Bricks.Div>

              <UU5.Bricks.Div className={Css.list_button()}>
                <UU5.Bricks.Button colorSchema="blue" onClick={() => setEdit(true)}>
                  <UU5.Bricks.Icon icon="mdi-pencil" />
                </UU5.Bricks.Button>
              </UU5.Bricks.Div>
            </UU5.Bricks.Div>
          </UU5.Bricks.Div>
        </div>
      ) : null;
    }

    //@@viewOff:render
  },
});

export default ListLeft;
