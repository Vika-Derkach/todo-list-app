import Config from "../config/config";
const list_box = () => Config.Css.css`
  display: flex;
  align-items: center;
  width: 100%
`;
const list_veiw = () => Config.Css.css`
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 5%;
`;
const list_button = () => Config.Css.css`
  width: 10%
`;
const list_text = () => Config.Css.css`
  width: 80%
`;
export default {
  list_box,
  list_veiw,
  list_button,
  list_text,
};
