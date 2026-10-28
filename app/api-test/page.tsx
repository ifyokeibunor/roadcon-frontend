import RequestConsole from "@/components/RequestConsole";

export default function ApiTest() {
  return (
    <>
      <h1>API test</h1>
      <p className="muted">Send any request to the backend to check an endpoint or response shape.</p>
      <RequestConsole />
    </>
  );
}
