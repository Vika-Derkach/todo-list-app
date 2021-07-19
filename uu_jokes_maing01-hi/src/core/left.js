//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import { createVisualComponent, useDataList, useEffect, useRef } from "uu5g04-hooks";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-app";

import Config from "./config/config.js";
import Lsi from "../config/lsi.js";
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
text-align: center; 

`;
export const Left = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    //@@viewOff:private
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
    // const getListItem = async () => await Calls.listItem();

    //@@viewOn:interface

    //@@viewOff:interface
    //useDataList
    let { call, viewState, data, error, state } = dataListResult;

    // if (data) {
    //   Calls.listItem({ listId: data[0].data.id }).then((fsdfs) => {
    //     console.log({ fsdfs });
    //   });
    // }

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
    // useEffect(() => {
    //   call();
    // }, []);
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
            // case "error":
            //   return <UU5.Common.Error errorData={errorData} />;
            // case "pending":
            //   return <Plus4U5.App.Loading />;
            case "ready":
              return (
                <>
                  <Plus4U5.App.MenuTree
                    borderBottom
                    // NOTE Item "id" equals to useCase so that item gets automatically selected when route changes (see spa-autheticated.js).
                    items={data?.map(({ data }) => {
                      return {
                        id: data.id,
                        // content: data.name,
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
                      Create
                    </UU5.Bricks.Button>
                  </UU5.Bricks.Div>

                  <ListModal ref={listRef} />
                </>
              );
            case "pendingNoData":
              return <Plus4U5.App.Loading />;
            default:
              return <Plus4U5.Bricks.Error />;
          }
        }}
        {/* {data?.map((item, i) =>
          // <JokeItem item={item} key={i} />

          JSON.stringify(data)
        )} */}
      </Plus4U5.App.Left>
    );
    //@@viewOff:render
  },
});

export default Left;
