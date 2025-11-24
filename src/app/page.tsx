import { portfolios } from "./data/portfolios";
import PortfolioBrowser from "./components/PortfolioBrowser";

export default function Home() {
  return (
    <main className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 min-h-0">
        <PortfolioBrowser portfolios={portfolios} />
      </div>
    </main>
  );
}
