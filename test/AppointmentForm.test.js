import React from "react";
import ReactTestUtils from "react-dom/test-utils";
import { createContainer } from "./domManipulators";
import { AppointmentForm } from "../src/AppointmentForm";

describe("AppointmentForm", () => {
  let render, container;

  beforeEach(() => {
    ({ render, container } = createContainer());
  });

  const form = (id) => container.querySelector(`form[id="${id}"]`);

  const field = (name) => form("appointment").elements[name];

  const findOption = (dropdownNode, textContent) => {
    const options = Array.from(dropdownNode.childNodes);
    return options.find((option) => option.textContent === textContent);
  };

  const labelFor = (formElement) =>
    container.querySelector(`label[for="${formElement}"]`);

  it("renders a form", () => {
    render(<AppointmentForm />);
    expect(form("appointment")).not.toBeNull();
  });

  describe("service field", () => {
    it("renders as a select box", () => {
      render(<AppointmentForm />);
      expect(field("service")).not.toBeNull();
      expect(field("service").tagName).toEqual("SELECT");
    });

    it("initially has a blank value chosen", () => {
      render(<AppointmentForm />);
      const firstNode = field("service").childNodes[0];
      expect(firstNode.value).toEqual("");
      expect(firstNode.selected).toBeTruthy();
    });

    it("lists all salon services", () => {
      const selectableServices = ["Cut", "Blow-dry"];
      render(<AppointmentForm selectableServices={selectableServices} />);
      const optionNodes = Array.from(field("service").childNodes);
      const renderedServices = optionNodes.map((node) => node.textContent);
      expect(renderedServices).toEqual(
        expect.arrayContaining(selectableServices)
      );
    });

    it("pre-selects the existing value", () => {
      const services = ["Cut", "Blow-dry"];
      render(
        <AppointmentForm selectableServices={services} service="Blow-dry" />
      );
      const option = findOption(field("service"), "Blow-dry");
      expect(option.selected).toBeTruthy();
    });

    it("renders a label to select service field", () => {
      render(<AppointmentForm />);
      expect(labelFor("service")).not.toBeNull();
      expect(labelFor("service").textContent).toEqual("Service");
    });

    it("assigns an id that matches the label id the select service field", () => {
      render(<AppointmentForm />);
      expect(field("service").id).toEqual("service");
    });

    it("save existing value when submitted select service field", async () => {
      expect.hasAssertions();
      render(
        <AppointmentForm
          service="Blow-dry"
          onSubmit={(props) => expect(props["service"]).toEqual("Blow-dry")}
        />
      );
      await ReactTestUtils.Simulate.submit(form("appointment"));
    });

    it("saves new value when submitted select service field", async () => {
      expect.hasAssertions();
      render(
        <AppointmentForm
          service="Blow-dry"
          onSubmit={(props) => expect(props["service"]).toEqual("Cut")}
        />
      );
      await ReactTestUtils.Simulate.change(field("service"), {
        target: { value: "Cut" },
      });
      await ReactTestUtils.Simulate.submit(form("appointment"));
    });
  });
});
