//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import { createVisualComponent, useDataList, useRef } from "uu5g04-hooks";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-app";
import Config from "./config/config.js";
import Calls from "../calls";
import ListLeft from "../bricks/list-left";
import ListModal from "../bricks/list-modal.js";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:static
  displayName: Config.TAG + "Left",
  //@@viewOff:static
};
const create_list_button = () => Config.Css.css`
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: left; 
  margin-left: 10px;
`;
export const Left = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private

    const dataListResult = useDataList({
      handlerMap: {
        load: Calls.listList,
        createItem: Calls.createList,
        update: Calls.updateList,
        delete: Calls.deleteList,
      },
      itemHandlerMap: {
        load: Calls.getList,
        update: Calls.updateList,
        delete: Calls.deleteList,
      },
    });

    let { call, viewState, data, error, state } = dataListResult;

    const listRef = useRef();

    function openDeleteConfirm(list, callback) {
      listRef.current.openDeleteConfirm(list, callback);
    }
    function openCreateModal() {
      listRef.current.openCreateModal(dataListResult.handlerMap.createItem);
    }
    function openUpdateModal(list, callback) {
      listRef.current.openUpdateModal(list, callback);
    }
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Plus4U5.App.Left
        {...props}
        logoProps={{
          backgroundColor: UU5.Environment.colors.blue.c700,
          backgroundColorTo: UU5.Environment.colors.blue.c500,
          title: "uuToDo",
        }}
        helpHref={null}
      >
        {() => {
          switch (state) {
            case "ready":
              return (
                <>
                  <Plus4U5.App.MenuTree
                    borderBottom
                    items={data?.map(({ data }) => {
                      return {
                        id: data.id,
                        content: (
                          <ListLeft
                            key={data.id}
                            id={data.id}
                            data={data}
                            openDeleteConfirm={openDeleteConfirm}
                            dataListResult={dataListResult}
                            openUpdateModal={openUpdateModal}
                          />
                        ),
                        href: `list?id=${data.id}`,
                      };
                    })}
                  />
                  <UU5.Bricks.Div className={create_list_button()}>
                    <UU5.Bricks.Button colorSchema="blue" bgStyle="transparent" onClick={openCreateModal}>
                      <UU5.Bricks.Icon icon="uu5-plus" />
                      Create list
                    </UU5.Bricks.Button>
                  </UU5.Bricks.Div>

                  <ListModal ref={listRef} />
                </>
              );
            case "error":
              return <UU5.Bricks.Error />;
            default:
              return <UU5.Bricks.Loading />;
          }
        }}
      </Plus4U5.App.Left>
    );
    //@@viewOff:render
  },
});

export default Left;
