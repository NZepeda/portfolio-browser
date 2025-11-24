import { portfolios } from "./data/portfolios";
import PortfolioBrowser from "./components/PortfolioBrowser";

export default function Home() {
  return (
    <main className="flex flex-col h-screen bg-gray-50">
      <header className="p-6 bg-white border-b border-gray-300">
        <h1 className="text-3xl font-bold text-gray-900">
          Developer Portfolio Browser
        </h1>
        <p className="text-gray-600 mt-1">
          Browse curated developer portfolio websites
        </p>
      </header>
      <div className="flex-1 min-h-0">
        <PortfolioBrowser portfolios={portfolios} />
      </div>
    </main>
  );
}
