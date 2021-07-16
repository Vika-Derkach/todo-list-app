import UU5 from "uu5g04";
import UuJokes from "uu_jokes_maing01-hi";

const { shallow } = UU5.Test.Tools;

describe(`UuJokes.Context.ListContext`, () => {
  it(`default props`, () => {
    const wrapper = shallow(<UuJokes.Context.ListContext />);
    expect(wrapper).toMatchSnapshot();
  });
});
