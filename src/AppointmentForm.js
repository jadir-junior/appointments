import React, { useState } from "react";

export const AppointmentForm = ({ selectableServices, service, onSubmit }) => {
  const [appointment, setAppointment] = useState({ service });

  const handleOnChange = ({ target }) => {
    setAppointment({
      ...appointment,
      service: target.value,
    });
  };

  return (
    <form id="appointment" onSubmit={() => onSubmit(appointment)}>
      <label htmlFor="service">Service</label>
      <select
        name="service"
        value={service}
        onChange={handleOnChange}
        id="service"
        readOnly
      >
        <option></option>
        {selectableServices.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
    </form>
  );
};

AppointmentForm.defaultProps = {
  selectableServices: [
    "Cut",
    "Blow-dry",
    "Cut & color",
    "Beard trim",
    "Cut & beard trim",
    "Extensions",
  ],
};
