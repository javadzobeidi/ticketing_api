import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import { DashboardLayout } from '@/src/pages/dashboard/dashboard-layout';
// @ts-ignore - JSX file without type declarations
import UsersPage from './pages/users';
import NewTicketPage from '@/src/pages/NewTicketPage';
import TicketPage from '@/src/pages/TicketPage';
import HomePage from '@/src/pages/HomePage';
import TicketListPage from '@/src/pages/TicketListPage';
import Login from './pages/Login';
import Register from './pages/register';
import AppointmentListPage from './pages/appointment_list/AppointmentListPage';
import ReserveAppointment from './pages/reserve_appointment';
import AppointmentDetailsPage from './pages/AppointmentDetailsPage';
import ManageAppointmentsPage from './pages/ManageAppointmentsPage';
import CreateAppointmentPage from './pages/appointment';
import TestPage from './pages/TestPage';
import DepartmentPage from './pages/department';
import BranchPage from './pages/branch';
import UserPage from './pages/user';
import { Toaster } from 'sonner';
import AppointmentList from './pages/appointment_list';
import AppointmentManageList from './pages/appointment_manage';
import AppointmentManagerDetailsPage from './pages/appointment_manage/appointment_details';
import AppointmentUserConversation from './pages/appointment_user_conversation';
import CreateTicket from './pages/create_ticket';
import TicketManageList from './pages/ticket_manage';
import TicketDetailsPage from './pages/ticket_manage/ticket_details';
import TicketUserList from './pages/ticket_user';
import TicketUserDetailsPage from './pages/ticket_user/ticket_details';
import ManagerTicketReportsPage from './pages/report_manager';
import LoginInMobile from './pages/LoginInMobile';
import MessageTemplatePage from './pages/message_template';

function App() {
  return (
     <Router>
       <Toaster expand={true} richColors  position="top-center" closeButton  /> 
      <Routes>
        {/* Login route OUTSIDE the layout */}
        <Route path="/login" element={<Login />} />
                <Route path="/login-mobile" element={<LoginInMobile />} />

        <Route path="/register" element={<Register />} />
        {/* All routes INSIDE DashboardLayout */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<HomePage />} />
          <Route path="reports" element={<ManagerTicketReportsPage />} />


          <Route path="test" element={<TestPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:userId" element={<UserPage />} />
          <Route path="units" element={<DepartmentPage />} />
          <Route path="branches" element={<BranchPage />} />
          <Route path="appointments" element={<AppointmentList />} />
          <Route path="appointments/reserve" element={<ReserveAppointment />} />
          <Route path="appointments/manager/:id" element={<AppointmentManagerDetailsPage />} />
           <Route path="tickets/manage/:id" element={<TicketDetailsPage />} />
          <Route path="appointments/conversation/:id" element={<AppointmentUserConversation />} />
          <Route path="create-appointment" element={<CreateAppointmentPage />} />
          <Route path="manage-appointments" element={<AppointmentManageList />} />
          <Route path="manage-tickets" element={<TicketManageList />} />
          <Route path="tickets" element={<TicketUserList />} />
          <Route path="tickets/new" element={<CreateTicket />} />
          <Route path="tickets/:id" element={<TicketUserDetailsPage />} />

          <Route path="messagetemplates" element={<MessageTemplatePage />} />
          
        </Route>
      </Routes>
    </Router>
  );
}


export default App;
