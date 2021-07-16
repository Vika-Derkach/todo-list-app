import UU5 from "uu5g04";
import UuJokes from "uu_jokes_maing01-hi";

const { shallow } = UU5.Test.Tools;

describe(`UuJokes.Bricks.ListModal`, () => {
  it(`default props`, () => {
    const wrapper = shallow(<UuJokes.Bricks.ListModal />);
    expect(wrapper).toMatchSnapshot();
  });
});
