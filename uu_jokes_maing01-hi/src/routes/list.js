//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useDataList } from "uu5g04-hooks";
import Config from "./config/config";
import Calls from "../calls";

//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "List",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

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
    const dataItemResult = useDataList({
      handlerMap: {
        load: Calls.listItem,
        createItem: Calls.createItem,
        update: Calls.updateItem,
        delete: Calls.deleteItem,
        setComplete: Calls.completeItem,
      },
      itemHandlerMap: {
        load: Calls.getItem,
        update: Calls.updateItem,
        delete: Calls.deleteItem,
      },
    });
    //@@viewOn:interface
    //@@viewOff:interface
    //useDataList
    let { call, viewState, data, error, state, handlerMap } = dataItemResult;
    console.log("dataItemResult, data", dataItemResult);
    console.log("handlerMap", handlerMap);
    console.log("data, data", data);
    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(props, STATICS);

    return currentNestingLevel ? (
      <div {...attrs}>
        <div>bla{STATICS.displayName}</div>

        <div> {JSON.stringify(data)}</div>
        {data?.map((item, i) =>
          // <JokeItem item={item} key={i} />

          JSON.stringify(data)
        )}
      </div>
    ) : null;
    //@@viewOff:render
  },
});

export default List;
