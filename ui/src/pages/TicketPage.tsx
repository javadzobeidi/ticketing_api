import { TicketConversation } from "@/src/components/ticket-conversation";

export default function TicketPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <div>
      <h1>Ticket Page</h1>
      <TicketConversation ticketId={id} />
    </div>
  );
}