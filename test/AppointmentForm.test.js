import React from "react";
import ReactTestUtils from "react-dom/test-utils";
import { createContainer } from "./domManipulators";
import { AppointmentForm } from "../src/AppointmentForm";
import { render } from "react-dom";

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

  const timeSloteTable = () => container.querySelector("table#time-slots");

  const startsAtField = (index) =>
    container.querySelectorAll(`input[name="startsAt"]`)[index];

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

  describe("time slot table", () => {
    it("renders a table for time slots", () => {
      render(<AppointmentForm />);
      expect(timeSloteTable()).not.toBeNull();
    });

    it("renders a time slot for every half an hour between open and closes times", () => {
      render(<AppointmentForm salonOpensAt={9} salonClosesAt={11} />);
      const timesOfDay = timeSloteTable().querySelectorAll("tbody >* th");
      expect(timesOfDay).toHaveLength(4);
      expect(timesOfDay[0].textContent).toEqual("09:00");
      expect(timesOfDay[1].textContent).toEqual("09:30");
      expect(timesOfDay[3].textContent).toEqual("10:30");
    });

    it("renders an empty cell at the start of the header row", () => {
      render(<AppointmentForm />);
      const headerRow = timeSloteTable().querySelector("thead > tr");
      expect(headerRow.firstChild.textContent).toEqual("");
    });

    it("renders a week of available dates", () => {
      const today = new Date(2018, 11, 1);
      render(<AppointmentForm today={today} />);
      const dates = timeSloteTable().querySelectorAll(
        "thead >* th:not(:first-child)"
      );
      expect(dates).toHaveLength(7);
      expect(dates[0].textContent).toEqual("Sat 01");
      expect(dates[1].textContent).toEqual("Sun 02");
      expect(dates[6].textContent).toEqual("Fri 07");
    });

    it("renders a radio button for each time slot", () => {
      const today = new Date();
      const availableTimeSlots = [
        { startsAt: today.setHours(9, 0, 0, 0) },
        { startsAt: today.setHours(9, 30, 0, 0) },
      ];
      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
        />
      );
      const cells = timeSloteTable().querySelectorAll("td");
      expect(cells[0].querySelector('input[type="radio"]')).not.toBeNull();
      expect(cells[7].querySelector('input[type="radio"]')).not.toBeNull();
    });

    it("does not render radio buttons for unavailable time slots", () => {
      render(<AppointmentForm availableTimeSlots={[]} />);
      const timesOfDay = timeSloteTable().querySelectorAll("input");
      expect(timesOfDay).toHaveLength(0);
    });

    it("sets radio button values to the index of the corresponding appointment", () => {
      const today = new Date();
      const availableTimeSlots = [
        { startsAt: today.setHours(9, 0, 0, 0) },
        { startsAt: today.setHours(9, 30, 0, 0) },
      ];
      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
        />
      );
      expect(startsAtField(0).value).toEqual(
        availableTimeSlots[0].startsAt.toString()
      );
      expect(startsAtField(1).value).toEqual(
        availableTimeSlots[1].startsAt.toString()
      );
    });
  });
});
