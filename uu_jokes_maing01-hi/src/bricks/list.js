//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useCallback } from "uu5g04-hooks";
import Config from "./config/config";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "List",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};
const list = () => Config.Css.css`
display: flex;
justify-content: space-evenly;
align-items: center;
margin: 5px;
`;
export const List = createVisualComponent({
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
    const { data, dataListResult, openDeleteConfirm, openUpdateModal } = props;
    const { handlerMap, itemHandlerMap } = dataListResult;

    const handleListDelete = useCallback((item) => {
      openDeleteConfirm(data, handlerMap.delete);
      // closeDetail();
    }, []);
    const handleListUpdate = useCallback((item) => {
      openUpdateModal(data, handlerMap.update);
      // closeDetail();
    }, []);
    // console.log("data", data);
    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(props, STATICS);

    return currentNestingLevel ? (
      <div {...attrs}>
        {UU5.Utils.Content.getChildren(props.children, props, STATICS)}
        {/* <div>{data.name}</div> */}
        {/* <pre>
          <code> {JSON.stringify(data, null, 4)}</code>
        </pre> */}
        <UU5.Bricks.Div className={list()}>
          <UU5.Bricks.Text> {data.name}</UU5.Bricks.Text>

          <UU5.Bricks.Div>
            <UU5.Bricks.Button colorSchema="red" onClick={handleListDelete}>
              <UU5.Bricks.Icon icon="fa-trash" />
            </UU5.Bricks.Button>

            <UU5.Bricks.Button colorSchema="yellow" text="Edit" onClick={handleListUpdate}>
              <UU5.Bricks.Icon icon="mdi-pencil" />
            </UU5.Bricks.Button>
          </UU5.Bricks.Div>
        </UU5.Bricks.Div>
      </div>
    ) : null;
    //@@viewOff:render
  },
});

export default List;
