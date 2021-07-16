//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponentWithRef, useRef, useImperativeHandle } from "uu5g04-hooks";
import Config from "./config/config";
import CreateListModalForm from "./forms/create-list-modal-form";
import DeleteListModalForm from "./forms/delete-list-modal-form";
import UpdateListModalForm from "./forms/update-list-modal-form";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ListModal",
  //@@viewOff:statics
};

export const ListModal = createVisualComponentWithRef({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props, ref) {
    //@@viewOn:private
    //@@viewOff:private
    //@@viewOn:hooks
    const modalRef = useRef();
    //@@viewOn:interface
    //@@viewOff:interface

    useImperativeHandle(ref, () => ({
      openDeleteConfirm: (list, callback) => {
        modalRef.current.open({
          header: list.name,
          content: <DeleteListModalForm list={list} callback={callback} closeCallback={modalRef.current.close} />,
          // className: main(),
        });
      },
      openCreateModal: (callback) => {
        modalRef.current.open({
          header: <UU5.Bricks.Header content="Create joke from " level="4" />,
          content: <CreateListModalForm callback={callback} closeCallback={modalRef.current.close} />,
          // className: main(),
        });
      },
      openUpdateModal: (list, callback) => {
        modalRef.current.open({
          header: <UU5.Bricks.Header content="Update joke " level="4" />,
          content: <UpdateListModalForm list={list} callback={callback} closeCallback={modalRef.current.close} />,
          // className: main(),
        });
      },
      // close: () => {
      //   modalRef.current.close();
      // },
    }));
    //@@viewOff:hooks

    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return <UU5.Bricks.Modal ref_={modalRef} />;
    //@@viewOff:render
  },
});

export default ListModal;
