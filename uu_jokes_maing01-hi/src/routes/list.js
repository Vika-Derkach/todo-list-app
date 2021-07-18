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
      if (show) {
        return data?.map(({ data }) => {
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
        return <div>there is no completed things</div>;
      } else {
        return <div></div>;
      }
    };

    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(props, STATICS);

    return currentNestingLevel ? (
      <div {...attrs}>
        <UU5.Bricks.Div className={item_list()}>
          {/* <div>bla{STATICS.displayName}</div> */}
          {/* <div>{JSON.stringify(data)}</div> */}
          <UU5.Forms.TextButton
            actionOnEnter={true}
            placeholder="Add to do..."
            // feedback="success"
            // message="success message"
            // required
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
            // return JSON.stringify(data);

            // id: data.id,
            // content: data.name,
            // href: `list?id=${data.id}`,
          })}
          <UU5.Bricks.Button className={showCompletedItemsBtn()} colorSchema="green" onClick={() => setShow(!show)}>
            {textButtonComplete}
          </UU5.Bricks.Button>
          {CompleteItem()}
        </UU5.Bricks.Div>
        {() => {
          switch (state) {
            case "error":
              return <UU5.Common.Error errorData={errorData} />;
            case "ready":
              return (
                <>
                  {/* {data?.map(({ data }) => {
                    return JSON.stringify(data);
                    // id: data.id,
                    // content: data.name,

                    // href: `list?id=${data.id}`,
                  })} */}
                  {/* <div>dsfsdfs</div>
                  {data?.map(
                    ({ data }) => {
                      return JSON.stringify(data[0].text);
                      // id: data.id,
                      // content: data.name,

                      // href: `list?id=${data.id}`,
                    }
                    // <JokeItem item={item} key={i} />

                    // JSON.stringify(data)
                  )}
                  <div>{JSON.stringify(data)}</div>
                  <Plus4U5.App.MenuTree
                    borderBottom
                    // NOTE Item "id" equals to useCase so that item gets automatically selected when route changes (see spa-autheticated.js).
                    items={data?.map(
                      ({ data }) => {
                        return {
                          id: data.id,
                          // content: data.name,
                          content: JSON.stringify(data.text),
                          // href: `list?id=${data.id}`,
                        };
                      }
                      // <JokeItem item={item} key={i} />

                      // JSON.stringify(data)
                    )}
                  /> */}
                </>
              );

            case "pending":
              return <Plus4U5.App.Loading />;
            default:
              break;
          }
        }}
      </div>
    ) : null;
    //@@viewOff:render
  },
});

export default List;
