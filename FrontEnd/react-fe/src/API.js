import axios from "axios";
import { BaseURL } from "./utils.js";
import apiClient from "./AxiosInterceptor/interceptor.js"; // Import your interceptor

class API {
  // Customer_master

  async save_customer(data) {
    const response = await apiClient.post(`${BaseURL}/save-customer`, data);
    return response.data;
  }

  async customermaster_fetch() {
    const response = await apiClient.get(`${BaseURL}/customermaster_fetch`);

    return response.data;
  }

  async customerMasterEditFetch(id) {
    try {
      const response = await apiClient.get(
        `${BaseURL}/customerMasterEditFetch/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching assets data:", error);
      throw error; // Re-throw the error to be caught by the caller
    }
  }

  async customermaster_update(currentCustomer, onSuccess, onFailure) {
    try {
      await apiClient
        .put(
          `${BaseURL}/customermaster_update/${currentCustomer.id}`,
          currentCustomer
        )
        .then((response) => {
          onSuccess(response);
        })
        .catch((error) => {
          onFailure(error);
        });
    } catch (error) {
      console.error("Error updating customer:", error);
      if (onFailure) onFailure(error); // In case of other errors
    }
  }

  async part_master_Create(data) {
    const response = await apiClient.post(
      `${BaseURL}/part_master_Create`,
      data
    );
    return response.data;
  }

  async get_part_master() {
    const response = await apiClient.get(`${BaseURL}/get_part_master`);

    return response.data;
  }

  async editGet_part_master(id) {
    try {
      const response = await apiClient.get(
        `${BaseURL}/editGet_part_master/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching assets data:", error);
      throw error; // Re-throw the error to be caught by the caller
    }
  }

  async update_part_master(part_master, onSuccess, onFailure) {
    try {
      await apiClient
        .put(`${BaseURL}/update_part_master/${part_master.id}`, part_master)
        .then((response) => {
          onSuccess(response);
        })
        .catch((error) => {
          onFailure(error);
        });
    } catch (error) {
      console.error("Error updating customer:", error);
      if (onFailure) onFailure(error); // In case of other errors
    }
  }

  //Inward Transaction master

  async inwardTransactioncreate(data) {
    try {
      const response = await apiClient.post(
        `${BaseURL}/create_inwardTransaction`,
        data
      );

      return response.data;
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  }

  async fetch_inward_transaction() {
    const response = await apiClient.get(`${BaseURL}/fetch_inward_transaction`);

    return response.data;
  }

  async get_inward_transaction() {
    const response = await apiClient.get(`${BaseURL}/get-inward-transaction`);

    return response.data;
  }

  async get_inward_part_location_details(data) {
    try {
      const response = await apiClient.get(
        `${BaseURL}/get-inward-part-location-details`, {params: data}
      );

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async edit_inward_transaction(id) {
    try {
      const response = await apiClient.get(
        `${BaseURL}/edit_inward_transaction/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching assets data:", error);
      throw error; // Re-throw the error to be caught by the caller
    }
  }

  async update_inwardtransaction(inward_master, onSuccess, onFailure) {
    try {
      await apiClient
        .put(
          `${BaseURL}/update_inwardtransaction/${inward_master.id}`,
          inward_master
        )
        .then((response) => {
          onSuccess(response);
        })
        .catch((error) => {
          onFailure(error);
        });
    } catch (error) {
      console.error("Error updating customer:", error);
      if (onFailure) onFailure(error); // In case of other errors
    }
  }

  // User create
  async user_create(data) {
    try {
      console.log("datasss in api", data);

      const response = await apiClient.post(`${BaseURL}/user_create`, data);

      return response.data;
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  }

  async fetch_rolesdata() {
    const response = await apiClient.get(`${BaseURL}/rolesfetch`);

    return response.data;
  }

  async fetch_usermasterdata() {
    const response = await apiClient.get(`${BaseURL}/user-master-get`);

    return response.data;
  }

  async edit_usermaster_fetch(id) {
    try {
      const response = await apiClient.get(`${BaseURL}/edit_usermaster/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching assets data:", error);
      throw error; // Re-throw the error to be caught by the caller
    }
  }

  async update_usermaster(
    user_master,
    onSuccess = () => {},
    onFailure = () => {}
  ) {
    try {
      const response = await apiClient.put(
        `${BaseURL}/edit_usermaster_update/${user_master.id}`,
        user_master
      );

      if (typeof onSuccess === "function") {
        onSuccess(response); // Safely call onSuccess
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      if (typeof onFailure === "function") {
        onFailure(error); // Safely call onFailure
      }
    }
  }

  //Location master

  async createLocationMaster(data) {
    try {
      const response = await axios.post(`${BaseURL}/location-create`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  }

  async fetch_locationmasterdata() {
    const response = await axios.get(`${BaseURL}/locationmaster_list`);

    return response.data;
  }

  async edit_location_fetch(id) {
    try {
      const response = await axios.get(`${BaseURL}/locationmaster_edit/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching assets data:", error);
      throw error; // Re-throw the error to be caught by the caller
    }
  }

  async update_locationmaster(
    location_master,
    onSuccess = () => {},
    onFailure = () => {}
  ) {
    try {
      const response = await axios.put(
        `${BaseURL}/edit_locationmaster_update/${location_master.id}`,
        location_master
      );
      console.log("response...api", response.data);

      if (typeof onSuccess === "function") {
        onSuccess(response); // Safely call onSuccess
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      if (typeof onFailure === "function") {
        onFailure(error); // Safely call onFailure
      }
    }
  }

  // order_transaction data and header also

  async fetch_ordertransactiondata() {
    const response = await axios.get(`${BaseURL}/order-details-all`);

    return response.data;
  }

  async fetch_dispatchById(id) {
    try {
      const response = await axios.get(`${BaseURL}/order-details-get`, {
        params: { order_header_id: id },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching assets data:", error);
      throw error; // Re-throw the error to be caught by the caller
    }
  }

  async updateOrderHeaderDispatchStatus(data) {
    try {
      const response = await axios.put(
        `${BaseURL}/disptach-completed-update`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  }

  async updateOrderHeaderVerifyStatus(data) {
    try {
      const response = await axios.put(
        `${BaseURL}/verified-completed-update`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  }

  async update_dispatch_location(data) {
    try {
      const response = await axios.put(
        `${BaseURL}/dispatch-location-update`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  }

  async cancel_order(data){
    try {
      const response = await axios.put(
        `${BaseURL}/cancel-order`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating customer:", error);
    }

  }

  // E Invoice

  async get_einvoice_list() {
    
    const response = await apiClient.get(`${BaseURL}/einvoice-list`);
    return response.data;
  }

  async generateEInvoice(data) {
    try {
      const response = await axios.post(`${BaseURL}/einvoice-create`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  }

  async cancelEInvoice(data) {
    try {
      const response = await axios.post(`${BaseURL}/einvoice-cancel`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  }


//   Reports

  async get_order_list(data) {
    try {
      const response = await apiClient.get(
        `${BaseURL}/get-order-list`
      );

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async get_einvoice_order_list(data) {
    try {
      const response = await apiClient.get(
        `${BaseURL}/get-einvoice-order-list`
      );

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async get_order_list_filtered(data) {
    try {
      const response = await apiClient.get(
        `${BaseURL}/get-order-list`, {params: data}
      );

      return response.data;
    } catch (error) {
      console.error(error);
    }

  }





}

export { API };
