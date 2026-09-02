import { redirect } from "next/navigation";

export default function CreateInspectionRedirect() {
  redirect("/quotations/inspections/create");
}
