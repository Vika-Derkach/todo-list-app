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
    //@@viewOn:hooks
    const modalRef = useRef();
    //@@viewOff:hooks

    //@@viewOn:interface
    useImperativeHandle(ref, () => ({
      openDeleteConfirm: (list, callback) => {
        modalRef.current.open({
          header: <></>,
          content: <DeleteListModalForm list={list} callback={callback} closeCallback={modalRef.current.close} />,
        });
      },
      openCreateModal: (callback) => {
        modalRef.current.open({
          header: <UU5.Bricks.Header content="Create joke from " level="4" />,
          content: <CreateListModalForm callback={callback} closeCallback={modalRef.current.close} />,
        });
      },
      openUpdateModal: (list, callback) => {
        modalRef.current.open({
          header: <UU5.Bricks.Header content="Update joke " level="4" />,
          content: <UpdateListModalForm list={list} callback={callback} closeCallback={modalRef.current.close} />,
        });
      },
    }));
    //@@viewOff:interface

    //@@viewOn:render
    return <UU5.Bricks.Modal ref_={modalRef} />;
    //@@viewOff:render
  },
});

export default ListModal;
