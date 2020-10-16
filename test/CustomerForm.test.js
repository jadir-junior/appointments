import React from "react";
import { createContainer } from "./domManipulators";
import { CustomerForm } from "../src/CustomerForm";

describe("CustomerForm", () => {
  let render, container;

  beforeEach(() => {
    ({ render, container } = createContainer());
  });

  const form = (id) => container.querySelector(`form[id="${id}"]`);

  it("renders a form", () => {
    render(<CustomerForm />);
    expect(form("customer")).not.toBeNull();
  });

  it("renders the first name field as a text box", () => {
    render(<CustomerForm />);
    const field = form("customer").elements.firstName;
    expect(field).not.toBeNull();
    expect(field.tagName).toEqual("INPUT");
    expect(field.type).toEqual("text");
  });
});
