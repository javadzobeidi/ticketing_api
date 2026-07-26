import { apiServices } from "@/src/apis";
import { useQuery } from "@tanstack/react-query";
import { AppointmentUserConversationPage } from "./appointment_conversation"
import { LoadingScreen } from "@/src/components/loading_screen";
import { useParams } from "react-router-dom";

export default function AppointmentUserConversation({ params }: { params: { id: string } }) {
  const { id } = useParams<{ id: string }>();
  
const {
  data: appointment,
isLoading,
    isError,
    isFetching,
    error,
}= useQuery({
  queryKey: ["conversations", id],
  queryFn: () => apiServices.appointment.getConversations(id), // Use non-null assertion if confident
  enabled: !!id && id !== '', // More explicit check
});


if (isLoading || isFetching) {
  return <LoadingScreen />
}


  return (
    <div>
      <AppointmentUserConversationPage data={appointment} />
    </div>
  );
}