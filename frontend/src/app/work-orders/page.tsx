import { redirect } from "next/navigation";

export default function WorkOrdersRedirect() {
  redirect("/quotations/orders");
}
