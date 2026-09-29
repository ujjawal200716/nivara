import { LoadingScreen } from "../LoadingScreen";

export default function DashboardLoading() {
  return (
    <LoadingScreen
      fullScreen={true}
      subtitle="AI SOCIETY COMMAND CENTER"
      message="Synchronizing executive triage workspace..."
    />
  );
}
