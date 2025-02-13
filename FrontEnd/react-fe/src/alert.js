import Swal from "sweetalert2";
import {API} from "./API";
import './alert.css';


export async function generateEInvoiceAlert(form_data, navigate, payment_type) {
  const api = new API();

  try {
    const { value: formValues } = await Swal.fire({
      title: "Are you sure you want to generate the e-invoice?",
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
        data: form_data
      };

      const url = payment_type == 'advance' ? `/landingpage/dispatch/advance/${form_data.order_header_id}` : `/landingpage/dispatch/credit/${form_data.order_header_id}`;
        
      const response = await api.generateEInvoice(data);

      if (response === "success") {
        Swal.fire("Success!", "E-Invoice generated successfully!", "success")
        .then(() => {
          navigate(url);
        });
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

export async function cancelOrder(order_header_id) {
  const api = new API();

  try {
    const { value: formValues } = await Swal.fire({
      title: "Are you sure you want to cancel the order and e-invoice?",
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
      };

      const response = await api.cancel_order(data);



      if (response === "success") {
        Swal.fire("Success!", "Order and E-Invoice cancelled successfully!", "success").then(() => {
          window.location.reload();
        });
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

export function alertWarning(text) {
  Swal.fire({
    icon: 'warning',
    title: 'Warning!',
    text: text,
    confirmButtonText: 'OK',
    customClass: {
      popup: 'custom-alert-popup',
      icon: 'custom-alert-icon',
      title: 'custom-alert-title',
      confirmButton: 'custom-alert-button',
    },
    buttonsStyling: false,
  });
}


export function alertSuccess(successMessage, navigate, navigationComponent) {
  Swal.fire({
    icon: 'success',
    title: 'Success!',
    text: successMessage,
    confirmButtonText: 'OK',
    customClass: {
      popup: 'custom-success-popup',
      icon: 'custom-success-icon',
      title: 'custom-success-title',
      confirmButton: 'custom-success-button',
    },
    buttonsStyling: false,
  });
}

export function alertError(text) {
  Swal.fire({
    icon: 'error',
    title: 'Error!',
    text: text,
    confirmButtonText: 'OK',
    customClass: {
      popup: 'custom-alert-popup',
      icon: 'custom-alert-icon',
      title: 'custom-alert-title',
      confirmButton: 'custom-alert-button',
    },
    buttonsStyling: false,
  });
}



    

