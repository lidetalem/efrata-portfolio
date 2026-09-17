import { ResourcePage } from "@/components/admin/resource-page";

export const dynamic = "force-dynamic";

export default function Page() {
  return <ResourcePage resource="knowledge" note="These entries are the only facts the AI assistant may use." />;
}
