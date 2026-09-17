import { ResourcePage } from "@/components/admin/resource-page";

export const dynamic = "force-dynamic";

export default function Page() {
  return <ResourcePage resource="media" note="Attach images and videos to a project by entering the project ID shown in the Projects list." />;
}
