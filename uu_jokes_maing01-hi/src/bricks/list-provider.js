//@@viewOn:imports

import { createComponent, useDataList } from "uu5g04-hooks";
import Config from "./config/config";

import ListContext from "../context/list-context";
import Calls from "../calls";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ListProvider",
  //@@viewOff:statics
};

export const ListProvider = createComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private

    const dataListResult = useDataList({
      handlerMap: {
        load: Calls.listList,
        createItem: Calls.createList,
        update: Calls.updateList,
      },
      itemHandlerMap: {
        load: Calls.getList,
        update: Calls.updateList,
        delete: Calls.deleteList,
      },
    });
    //@@viewOff:private

    //@@viewOn:render
    return <ListContext.Provider value={dataListResult}>{props.children}</ListContext.Provider>;
    //@@viewOff:render
  },
});

export default ListProvider;
