import axios from "axios";
import { BaseURL } from "./utils";

class API {

    async save_customer(data) {
        
        const response = await axios.post(`${BaseURL}/save-customer`,data)
        return response.data;
    }

}

export { API }