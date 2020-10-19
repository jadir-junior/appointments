import React from "react";
import ReactDOM from "react-dom";
import { AppointmentsDayView } from "./AppointmentDayView";
import { CustomerForm } from "./CustomerForm";
import { AppointmentForm } from "./AppointmentForm";
import { sampleAppointments } from "./sampleData";

import { sampleAvailableTimeSlots } from "./sampleData";

ReactDOM.render(
  <AppointmentForm availableTimeSlots={sampleAvailableTimeSlots} />,
  document.getElementById("root")
);
