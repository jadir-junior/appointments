import React from "react";
import { createContainer } from "./domManipulators";
import { CustomerForm } from "../src/CustomerForm";
import ReactTestUtils from "react-dom/test-utils";

describe("CustomerForm", () => {
  let render, container;

  const field = (name) => form("customer").elements[name];

  const form = (id) => container.querySelector(`form[id="${id}"]`);

  const labelFor = (formElement) =>
    container.querySelector(`label[for="${formElement}"]`);

  const expectToBeInputFieldOfTypeText = (formElement) => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual("INPUT");
    expect(formElement.type).toEqual("text");
  };

  const itRendersAsTextBox = (fieldName) =>
    it("renders as a text box", () => {
      render(<CustomerForm />);
      expectToBeInputFieldOfTypeText(field(fieldName));
    });

  const itIncludesTheExistingValue = (fieldName) =>
    it("includes the existing value", () => {
      render(<CustomerForm {...{ [fieldName]: "value" }} />);
      expect(field(fieldName).value).toEqual("value");
    });

  const itRendersALabel = (fieldName, value) =>
    it("renders a label", () => {
      render(<CustomerForm />);
      expect(labelFor(fieldName)).not.toBeNull();
      expect(labelFor(fieldName).textContent).toEqual(value);
    });

  const itAssignsAnIdThatMatchesTheLabelId = (fieldName) =>
    it("assigns an id that matches the label id", () => {
      render(<CustomerForm />);
      expect(field(fieldName).id).toEqual(fieldName);
    });

  const itSubmitsExistingValue = (fieldName, value) =>
    it("saves existing value when submitted", async () => {
      let submitArg;

      render(
        <CustomerForm
          {...{ [fieldName]: value }}
          onSubmit={(customer) => (submitArg = customer)}
        />
      );
      await ReactTestUtils.Simulate.submit(form("customer"));

      expect(submitArg[fieldName]).toEqual(value);
    });

  const itSubmitsNewValue = (fieldName, value) =>
    it("saves new value when submitted", async () => {
      expect.hasAssertions();
      render(
        <CustomerForm
          {...{ [fieldName]: "existingValue" }}
          onSubmit={(props) => expect(props[fieldName]).toEqual(value)}
        />
      );
      await ReactTestUtils.Simulate.change(field(fieldName), {
        target: { value: value, name: fieldName },
      });
      await ReactTestUtils.Simulate.submit(form("customer"));
    });

  beforeEach(() => {
    ({ render, container } = createContainer());
  });

  it("renders a form", () => {
    render(<CustomerForm />);
    expect(form("customer")).not.toBeNull();
  });

  describe("first name field", () => {
    itRendersAsTextBox("firstName");
    itIncludesTheExistingValue("firstName");
    itRendersALabel("firstName", "First name");
    itAssignsAnIdThatMatchesTheLabelId("firstName");
    itSubmitsExistingValue("firstName", "Ashley");
    itSubmitsNewValue("firstName", "Jamie");
  });

  describe("last name field", () => {
    itRendersAsTextBox("lastName");
    itIncludesTheExistingValue("lastName");
    itRendersALabel("lastName", "Last name");
    itAssignsAnIdThatMatchesTheLabelId("lastName");
    itSubmitsExistingValue("lastName", "Silva");
    itSubmitsNewValue("lastName", "Rodini");
  });

  describe("phone number field", () => {
    itRendersAsTextBox("phoneNumber");
    itIncludesTheExistingValue("phoneNumber");
    itRendersALabel("phoneNumber", "Phone number");
    itAssignsAnIdThatMatchesTheLabelId("phoneNumber");
    itSubmitsExistingValue("phoneNumber", "(11)99960-9710");
    itSubmitsNewValue("phoneNumber", "(11)4535-1133");
  });

  it("has a submit button", () => {
    render(<CustomerForm />);
    const submitButton = container.querySelector('input[type="submit"]');
    expect(submitButton).not.toBeNull();
  });
});
