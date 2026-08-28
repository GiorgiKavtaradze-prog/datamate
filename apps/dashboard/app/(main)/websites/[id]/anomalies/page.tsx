import { AnomaliesPageContent } from "./_components/anomalies-page-content";

export default function AnomaliesPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	return <AnomaliesPageContent params={params} />;
}
