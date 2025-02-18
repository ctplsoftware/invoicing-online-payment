import axios from "axios";
import { BaseURL } from "./utils.js";
import apiClient from "./AxiosInterceptor/interceptor.js"; // Import your interceptor

class API {
  // Customer_master

  async save_customer(data) {
    const response = await apiClient.post(`/save-customer`, data);
    return response.data;
  }

  async customermaster_fetch() {
    const response = await apiClient.get(`/customermaster_fetch`);

    return response.data;
  }

  async customerMasterEditFetch(id) {
    try {
      const response = await apiClient.get(
        `/customerMasterEditFetch/${id}`
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
          `/customermaster_update/${currentCustomer.id}`,
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
      `/part_master_Create`,
      data
    );
    return response.data;
  }

  async get_part_master() {
    const response = await apiClient.get(`/get_part_master`);

    return response.data;
  }

  async editGet_part_master(id) {
    try {
      const response = await apiClient.get(
        `/editGet_part_master/${id}`
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
        .put(`/update_part_master/${part_master.id}`, part_master)
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
        `/create_inwardTransaction`,
        data
      );

      return response.data;
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  }

  async fetch_inward_transaction() {
    const response = await apiClient.get(`/fetch_inward_transaction`);

    return response.data;
  }

  async get_inward_transaction() {
    const response = await apiClient.get(`/get-inward-transaction`);

    return response.data;
  }

  async get_inward_part_location_details(data) {
    try {
      const response = await apiClient.get(
        `/get-inward-part-location-details`, {params: data}
      );

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async edit_inward_transaction(id) {
    try {
      const response = await apiClient.get(
        `/edit_inward_transaction/${id}`
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
          `/update_inwardtransaction/${inward_master.id}`,
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

      const response = await apiClient.post(`/user_create`, data);

      return response.data;
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  }

  async fetch_rolesdata() {
    const response = await apiClient.get(`/rolesfetch`);

    return response.data;
  }

  async fetch_usermasterdata() {
    const response = await apiClient.get(`/user-master-get`);

    return response.data;
  }

  async edit_usermaster_fetch(id) {
    try {
      const response = await apiClient.get(`/edit_usermaster/${id}`);
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
        `/edit_usermaster_update/${user_master.id}`,
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
      const response = await apiClient.post(`/location-create`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  }

  async fetch_locationmasterdata() {
    const response = await apiClient.get(`/locationmaster_list`);

    return response.data;
  }

  async edit_location_fetch(id) {
    try {
      const response = await apiClient.get(`/locationmaster_edit/${id}`);
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
      const response = await apiClient.put(
        `/edit_locationmaster_update/${location_master.id}`,
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
    const response = await apiClient.get(`/order-details-all`);

    return response.data;
  }

  async fetch_dispatchById(id) {
    try {
      const response = await apiClient.get(`/order-details-get`, {
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
      const response = await apiClient.put(
        `/disptach-completed-update`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  }

  async updateOrderHeaderVerifyStatus(data) {
    try {
      const response = await apiClient.put(
        `/verified-completed-update`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  }

  async update_dispatch_location(data) {
    try {
      const response = await apiClient.put(
        `/dispatch-location-update`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  }

  async cancel_order(data){
    try {
      const response = await apiClient.put(
        `/cancel-order`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating customer:", error);
    }

  }

  // E Invoice

  async get_einvoice_list() {
    
    const response = await apiClient.get(`/einvoice-list`);
    return response.data;
  }

  async generateEInvoice(data) {
    try {
      const response = await apiClient.post(`/einvoice-create`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  }

  async cancelEInvoice(data) {
    try {
      const response = await apiClient.post(`/einvoice-cancel`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  }


//   Reports

  async get_order_list(data) {
    try {
      const response = await apiClient.get(
        `/get-order-list`
      );

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async get_einvoice_order_list(data) {
    try {
      const response = await apiClient.get(
        `/get-einvoice-order-list`
      );

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async get_order_list_filtered(data) {
    try {
      const response = await apiClient.get(
        `/get-order-list`, {params: data}
      );

      return response.data;
    } catch (error) {
      console.error(error);
    }

  }

  async get_einvoice_details(data) {
    try {
      const response = await apiClient.get(
        `/einvoice-details-get`, {params: data}
      );

      return response.data;
    } catch (error) {
      console.error(error);
    }

  }





}

export { API };
