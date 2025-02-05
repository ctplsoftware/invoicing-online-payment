

import Swal from "sweetalert2";
import {API} from "./API";





export default async function cancelEInvoiceAlert(order_header_id, irn) {
  const api = new API();

  try {
    const { value: formValues } = await Swal.fire({
      title: "Are you sure you want to cancel the e-invoice?",
      html:
        '<input id="swal-username" class="swal2-input" placeholder="Username">' +
        '<input id="swal-password" type="password" class="swal2-input" placeholder="Password">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Submit",
      customClass: {
        confirmButton: "custom-confirm-btn", 
        cancelButton: "custom-cancel-btn",
      },
      preConfirm: function () {
        const username = document.getElementById("swal-username").value;
        const password = document.getElementById("swal-password").value;

        if (!username || !password) {
          Swal.showValidationMessage("Both fields are required!");
          return false;
        }

        return { username, password };
      }
    });

    if (formValues) {
      const data = {
        username: formValues.username,
        password: formValues.password,
        order_header_id: order_header_id,
        irn: irn
      };

      const response = await api.cancelEInvoice(data);



      if (response === "success") {
        Swal.fire("Success!", "E-Invoice and order cancelled successfully!", "success");
      } 
      else if(response == 'Invalid Credentials'){
        Swal.fire("Error!", "Invalid Credentials", "error");

      }
      else {
        Swal.fire("Error!", "Please try again.", "error");
      }
    }
  } catch (error) {
    console.error("Error:", error);
    Swal.fire("Error!", "Something went wrong!", "error");
  }
}

    

