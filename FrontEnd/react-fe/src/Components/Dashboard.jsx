import TaskOperations from "./TaskOperations";
import UserPermissionForm from "./UserPermissionForm";
import UserRoleForm from "./UserRoleForm";

const Dashboard = () => {
    return ( 
        <div className="dashboard">
            <UserPermissionForm/>
            {/* <UserRoleForm/> */}
            <TaskOperations/>
            
        </div>
     );
}
 
export default Dashboard;