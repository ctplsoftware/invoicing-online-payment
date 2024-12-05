
import '../customer_module/customerdashboard.css'
import React, { useState, useEffect } from "react";


const CustomerDashboard = () => {

    const [time, setTime] = useState(new Date());
    const [temperature, setTemperature] = useState(null);

    // Update time every second
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Fetch temperature (mocked for simplicity)
    useEffect(() => {


        // Replace with a real API call for temperature if needed
        setTemperature("25°C"); // Example static value
    }, []);

    // Format time and month
    const formattedTime = time.toLocaleTimeString();
    const formattedMonth = time.toLocaleString("default", { month: "long" });

    const styles = {

        box: {
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            width: "200px",
            marginRight: '38px',
            height: '116px',
            marginTop: '20px',
            boxShadow: 'rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset'

        },
        time: {
            fontSize: "24px",
            fontWeight: "bold",
            margin: "1px 0",

        },
        month: {
            fontSize: "18px",
            margin: "6px 0",
        },
        temp: {
            fontSize: "16px",
            color: "#555",
        },
    };



    return (
        <>


            <div className="dashboard-start">

                <h3 className="header-name">Welcome back, Vicky!</h3>

                <div className='time-temp' style={styles.box}>
                    <h2 style={styles.time}>{formattedTime}</h2>
                    <p style={styles.month}>{formattedMonth}</p>
                    <p style={styles.temp}>{temperature}</p>
                </div>

            </div>



            <div className='master-cards'>

                <div class="card">
                    <div class="tools">
                        <div class="circle">
                            <span class="red box"></span>
                        </div>
                        <div class="circle">
                            <span class="yellow box"></span>
                        </div>
                        <div class="circle">
                            <span class="green box"></span>
                        </div>
                    </div>
                    <div class="card__content">

                    </div>
                </div>

                <div class="card">
                    <div class="tools">
                        <div class="circle">
                            <span class="red box"></span>
                        </div>
                        <div class="circle">
                            <span class="yellow box"></span>
                        </div>
                        <div class="circle">
                            <span class="green box"></span>
                        </div>
                    </div>
                    <div class="card__content">
                    </div>
                </div>

                <div class="card">
                    <div class="tools">
                        <div class="circle">
                            <span class="red box"></span>
                        </div>
                        <div class="circle">
                            <span class="yellow box"></span>
                        </div>
                        <div class="circle">
                            <span class="green box"></span>
                        </div>
                    </div>
                    <div class="card__content">
                    </div>
                </div>

            </div>




        </>



    )

}
export default CustomerDashboard