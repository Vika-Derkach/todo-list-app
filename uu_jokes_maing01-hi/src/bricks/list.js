//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useCallback, useState } from "uu5g04-hooks";
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

const list_box = () => Config.Css.css`
display: flex;
align-items: center;

width: 100%
`;
const list_veiw = () => Config.Css.css`
margin-bottom: 10px;
border-radius: 5%;
`;
const list_button = () => Config.Css.css`
width: 10%
`;
const list_text = () => Config.Css.css`
width: 80%
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
    const [name, setName] = useState(data.name);
    const [edit, setEdit] = useState(false);

    const handleListDelete = useCallback((item) => {
      openDeleteConfirm(data, handlerMap.delete);
      // closeDetail();
    }, []);
    // const handleListUpdate = useCallback((item) => {
    //   openUpdateModal(data, handlerMap.update);

    //   // closeDetail();
    // }, []);
    const handleListUpdate = async (values) => {
      await handlerMap.update({ ...values, id: data.id });
      setEdit(!edit);
    };
    // console.log("data", data);
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
                onClick: () => handleListDelete(),
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
          <UU5.Bricks.Div className={list_veiw()}>
            <UU5.Bricks.Box bgStyle="filled" className={list_box()} colorSchema="white">
              <UU5.Bricks.Div className={list_text()}>
                {" "}
                <UU5.Bricks.Text>{name}</UU5.Bricks.Text>
              </UU5.Bricks.Div>

              <UU5.Bricks.Div className={list_button()}>
                {" "}
                <UU5.Bricks.Button onClick={() => setEdit(true)}>
                  <UU5.Bricks.Icon icon="mdi-pencil" />
                </UU5.Bricks.Button>
              </UU5.Bricks.Div>
            </UU5.Bricks.Box>
          </UU5.Bricks.Div>
        </div>
      ) : null;
    }

    // return currentNestingLevel ? (
    //   <div {...attrs}>
    //     {UU5.Utils.Content.getChildren(props.children, props, STATICS)}
    //     {/* <div>{data.name}</div> */}
    //     {/* <pre>
    //       <code> {JSON.stringify(data, null, 4)}</code>
    //     </pre> */}
    //     <UU5.Bricks.Div className={list()}>
    //       <UU5.Bricks.Text> {data.name}</UU5.Bricks.Text>

    //       {/* <UU5.Bricks.Div>
    //         <UU5.Bricks.Button colorSchema="red" onClick={handleListDelete}>
    //           <UU5.Bricks.Icon icon="fa-trash" />
    //         </UU5.Bricks.Button>

    //         <UU5.Bricks.Button colorSchema="yellow" text="Edit" onClick={handleListUpdate}>
    //           <UU5.Bricks.Icon icon="mdi-pencil" />
    //         </UU5.Bricks.Button>
    //       </UU5.Bricks.Div> */}
    //     </UU5.Bricks.Div>
    //   </div>
    // ) : null;

    //@@viewOff:render
  },
});

export default List;
