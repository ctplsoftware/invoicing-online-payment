import axios from "axios";
import { BaseURL } from "./utils";

class API {

    // Customer_master

    async save_customer(data) {

        const response = await axios.post(`${BaseURL}/save-customer`, data)
        return response.data;
    }

    async customermaster_fetch() {

        const response = await axios.get(`${BaseURL}/customermaster_fetch`)

        return response.data;
    }


    async customerMasterEditFetch(id) {
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
            console.log("currentCustomer.id", currentCustomer.id);

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

    // Part_master

    async part_master_Create(data) {

        const response = await axios.post(`${BaseURL}/part_master_Create`, data)
        return response.data;
    }


    async get_part_master() {

        const response = await axios.get(`${BaseURL}/get_part_master`)

        return response.data;
    }


    async editGet_part_master(id) {
        try {
            const response = await axios.get(`${BaseURL}/editGet_part_master/${id}`);
            return response.data;

        }
        catch (error) {

            console.error('Error fetching assets data:', error);
            throw error; // Re-throw the error to be caught by the caller

        }

    }

    async update_part_master(part_master, onSuccess, onFailure) {
        try {

            await axios.put(`${BaseURL}/update_part_master/${part_master.id}`, part_master)
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


    //Inward Transaction master

    async inwardTransactioncreate(data) {
        try {

            const response = await axios.post(`${BaseURL}/create_inwardTransaction`, data)

            return response.data;


        } catch (error) {
            console.error('Error updating customer:', error);

        }
    }


    async fetch_inward_transaction() {

        const response = await axios.get(`${BaseURL}/fetch_inward_transaction`)

        return response.data;
    }


    async edit_inward_transaction(id) {
        try {
            const response = await axios.get(`${BaseURL}/edit_inward_transaction/${id}`);
            return response.data;

        }
        catch (error) {

            console.error('Error fetching assets data:', error);
            throw error; // Re-throw the error to be caught by the caller

        }

    }

    async update_inwardtransaction(inward_master, onSuccess, onFailure) {
        try {

            await axios.put(`${BaseURL}/update_inwardtransaction/${inward_master.id}`, inward_master)
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



    // admin create 
    async admin_create(data) {
        try {
            console.log("datasss in api", data);

            const response = await axios.post(`${BaseURL}/admin_create`, data)

            return response.data;


        } catch (error) {
            console.error('Error updating customer:', error);

        }
    }

    async fetch_rolesdata() {

        const response = await axios.get(`${BaseURL}/rolesfetch`)

        return response.data;

    }

    async fetch_usermasterdata() {

        const response = await axios.get(`${BaseURL}/user-master-get`)

        return response.data;

    }


    async edit_usermaster_fetch(id) {
        try {
            const response = await axios.get(`${BaseURL}/edit_usermaster/${id}`);
            return response.data;

        }
        catch (error) {

            console.error('Error fetching assets data:', error);
            throw error; // Re-throw the error to be caught by the caller

        }

    }



    async update_usermaster(user_master, onSuccess = () => { }, onFailure = () => { }) {
        try {
            const response = await axios.put(`${BaseURL}/edit_usermaster_update/${user_master.id}`, user_master);
            console.log("response...api",response.data);

            if (typeof onSuccess === 'function') {
                onSuccess(response); // Safely call onSuccess
            }
        } catch (error) {
            console.error('Error updating customer:', error);
            if (typeof onFailure === 'function') {
                onFailure(error); // Safely call onFailure
            }
        }
    }













}

export { API }