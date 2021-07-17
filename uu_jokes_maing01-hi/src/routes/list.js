//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useDataList, useEffect, useState } from "uu5g04-hooks";
import Config from "./config/config";
import Calls from "../calls";
import ItemList from "../bricks/item-list";

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

    const url = UU5.Common.Url.parse(window.location.href);
    const urlId = url._parameters.id;

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
      initialDtoIn: {
        // listId: "60e7350bca31812058d50866",
        listId: urlId,
      },
    });

    //@@viewOn:interface
    //@@viewOff:interface

    let { call, viewState, data, error, state, handlerMap, initialDtoIn } = dataItemResult;

    //@@viewOn:interface
    //@@viewOff:interface\

    ///////////
    useEffect(() => {
      handlerMap.load;
    }, [urlId]);
    /////////////
    const [text, setText] = useState("");
    const handleItemCreate = async (values) => {
      await handlerMap.createItem({ ...values, listId: urlId });

      setText("");
    };
    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(props, STATICS);

    return currentNestingLevel ? (
      <div {...attrs}>
        {/* <div>bla{STATICS.displayName}</div> */}
        {/* <div>{JSON.stringify(data)}</div> */}
        <UU5.Forms.TextButton
          placeholder="Add to do..."
          // feedback="success"
          // message="success message"
          // required
          value={text}
          size="xl"
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
          // return JSON.stringify(data);
          return <ItemList data={data} dataItemResult={dataItemResult} urlId={urlId} />;

          // id: data.id,
          // content: data.name,
          // href: `list?id=${data.id}`,
        })}

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
