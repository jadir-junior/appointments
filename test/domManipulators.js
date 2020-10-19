import ReactDOM from "react-dom";
import ReactTestUtils, { act } from "react-dom/test-utils";

export const createContainer = () => {
  const container = document.createElement("div");
  const element = (selector) => container.querySelector(selector);
  const form = (id) => element(`form[id="${id}"]`);
  const field = (formId, name) => form(formId).elements[name];
  const labelFor = (formElement) => element(`label[for="${formElement}"]`);
  const elements = (selector) => Array.from(container.querySelectorAll);
  const simulateEvent = (eventName) => (element, eventData) =>
    ReactTestUtils.Simulate[eventName](element, eventData);
  const simulateEventAndWait = (eventName) => async (element, eventData) =>
    await act(async () =>
      ReactTestUtils.Simulate[eventName](element, eventData)
    );

  return {
    render: (component) => ReactDOM.render(component, container),
    container,
    form,
    field,
    labelFor,
    element,
    click: simulateEvent("click"),
    change: simulateEvent("change"),
    submit: simulateEventAndWait("submit"),
  };
};

export const withEvent = (name, value) => ({
  target: { name, value },
});
