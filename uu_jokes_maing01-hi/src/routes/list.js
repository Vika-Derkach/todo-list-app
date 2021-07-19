//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useDataList, useEffect, useState } from "uu5g04-hooks";
import Config from "./config/config";
import Calls from "../calls";
import ItemList from "../bricks/item-list";
import ItemListCompleted from "../bricks/item-list-completed";

//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "List",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};
const create_button = () => Config.Css.css`
  margin-bottom: 20px;
`;
const item_list = () => Config.Css.css`
  padding: 2%;
  background-color: rgba(1,42,74,255);
`;
const showCompletedItemsBtn = () => Config.Css.css`
  margin-bottom: 20px;
  border-radius: 5px;
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

    const url = UU5.Common.Url.parse(window.location.href);
    const urlId = url._parameters.id;

    const dataItemResult = useDataList({
      handlerMap: {
        load: Calls.listItem,
        createItem: Calls.createItem,
        update: Calls.updateItem,
        delete: Calls.deleteItem,
        completeItem: Calls.completeItem,
      },
      itemHandlerMap: {
        load: Calls.getItem,
        update: Calls.updateItem,
        delete: Calls.deleteItem,
      },
      initialDtoIn: {
        listId: urlId,
      },
    });

    //@@viewOn:interface
    //@@viewOff:interface

    let { call, viewState, data, error, state, handlerMap, initialDtoIn } = dataItemResult;
    const [show, setShow] = useState(false);
    useEffect(() => {
      if (typeof handlerMap.load === "function") {
        handlerMap.load({ listId: urlId });
      }
    }, [urlId]);
    //@@viewOn:interface
    //@@viewOff:interface

    const [text, setText] = useState("");
    const handleItemCreate = async (values) => {
      await handlerMap.createItem({ ...values, listId: urlId });
      setText("");
    };

    let textButtonComplete = show ? "Hide completed items" : "Show completed items";

    const CompleteItem = () => {
      if (show && data?.length >= 0) {
        return data?.map(({ data }) => {
          console.log("data", data);
          if (data.completed) {
            return (
              <ItemListCompleted
                key={data.id + "-Completed"}
                data={data}
                dataItemResult={dataItemResult}
                urlId={urlId}
              />
            );
          }
        });
      } else if (data?.length <= 0) {
        return (
          <UU5.Bricks.Div>
            <UU5.Bricks.Box borderRadius="8px" colorSchema="grey">
              <UU5.Bricks.Div>
                {" "}
                <UU5.Bricks.Text>There is no completed things</UU5.Bricks.Text>
              </UU5.Bricks.Div>
            </UU5.Bricks.Box>
          </UU5.Bricks.Div>
        );
      } else {
        return <div></div>;
      }
    };

    //@@viewOn:render

    let someFunc = () => {
      switch (state) {
        case "ready":
          return (
            <UU5.Bricks.Div className={item_list()}>
              <UU5.Forms.TextButton
                actionOnEnter={true}
                placeholder="Add to do..."
                value={text}
                size="m"
                className={create_button()}
                onChange={(event) => setText(event.value)}
                buttons={[
                  {
                    icon: "uu5-ok",
                    onClick: () => handleItemCreate({ ...data, text }),
                    colorSchema: "grey",
                  },
                ]}
              />

              {data?.map(({ data }) => {
                if (!data.completed) {
                  return <ItemList key={data.id} data={data} dataItemResult={dataItemResult} urlId={urlId} />;
                }
              })}
              <UU5.Bricks.Button className={showCompletedItemsBtn()} colorSchema="blue" onClick={() => setShow(!show)}>
                {textButtonComplete}
              </UU5.Bricks.Button>
              {CompleteItem()}
            </UU5.Bricks.Div>
          );

        case "error":
          return <UU5.Bricks.Error />;
        default:
          return <Plus4U5.App.Loading />;
      }
    };

    return (
      <div>
        <UU5.Bricks.Div>{someFunc()}</UU5.Bricks.Div>
      </div>
    );
    //@@viewOff:render
  },
});

export default List;
