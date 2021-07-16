//@@viewOn:revision

//@@viewOff:revision
//@@viewOn:imports
import UU5 from "uu5g04";
import { useContext } from "uu5g04-hooks";
import Config from "../config/config";

//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "Context",
  //@@viewOff:statics
};

const ListContext = UU5.Common.Context.create();
ListContext.displayName = STATICS.displayName;
export default ListContext;

function useList() {
  return useContext(ListContext);
}

export { useList, ListContext };
