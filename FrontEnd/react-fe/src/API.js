import axios from "axios";
import { BaseURL } from "./utils";

class API {

    async save_customer(data) {

        const response = await axios.post(`${BaseURL}/save-customer`, data)
        return response.data;
    }

    async customermaster_fetch() {

        const response = await axios.get(`${BaseURL}/customermaster_fetch`)

        return response.data;
    }


    async customerMasterEditFetch(id) {

        console.log("id is a vcominh", id);


        try {
            const response = await axios.get(`${BaseURL}/customerMasterEditFetch/${id}`);
            return response.data;

        }
        catch (error) {

            console.error('Error fetching assets data:', error);
            throw error; // Re-throw the error to be caught by the caller

        }

    }

    async customermaster_update(currentCustomer, onSuccess, onFailure) {
        try {
            console.log("currentCustomer.id",currentCustomer.id);
            
            await axios.put(`${BaseURL}/customermaster_update/${currentCustomer.id}`, currentCustomer)
                .then((response) => {
                    onSuccess(response);
                })
                .catch((error) => {
                    onFailure(error);
                });
        } catch (error) {
            console.error('Error updating customer:', error);
            if (onFailure) onFailure(error); // In case of other errors
        }
    }
    

}

export { API }