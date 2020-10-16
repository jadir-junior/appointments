import React from "react";
import { createContainer } from "./domManipulators";
import { CustomerForm } from "../src/CustomerForm";

describe("CustomerForm", () => {
  let render, container;

  beforeEach(() => {
    ({ render, container } = createContainer());
  });

  it("renders a form", () => {
    render(<CustomerForm />);
    expect(container.querySelector('form[id="customer"]')).not.toBeNull();
  });
});
