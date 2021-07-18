import Config from "../config/config";
const item_crossed_text = () => Config.Css.css`
text-decoration: line-through;
width: 78%;
color: grey;
`;
const item_noncrossed_text = () => Config.Css.css`
text-decoration: none;
width: 78%;
`;
const item_box = () => Config.Css.css`
display: flex;
align-items: center;

width: 100%
`;
const item_veiw = () => Config.Css.css`
margin-bottom: 10px;
border-radius: 5%;
`;
const item_button = () => Config.Css.css`
width: 10%;
`;
const item_checkbox = () => Config.Css.css`
width: 5%;
`;
export default {
  item_crossed_text,
  item_noncrossed_text,
  item_box,
  item_veiw,
  item_button,
  item_checkbox,
};
